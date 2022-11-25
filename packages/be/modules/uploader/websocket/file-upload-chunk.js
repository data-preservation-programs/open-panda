console.log('⚡️ [websocket] module|file-upload-chunk|payload')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Path = require('path')
const Fs = require('fs-extra')
const CloneDeep = require('lodash/cloneDeep')

const FindUser = require('@Module_User/logic/find-user')
const { GetSocket } = require('@Module_Utilities')

const MC = require('@Root/config')

const TMP_UPLOADS_DIR = Path.resolve(`${MC.packageRoot}/tmp/uploads`)
const UPLOADS_DIR = Path.resolve(`${MC.publicRoot}/uploads`)

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.socket.listeners.push({
  name: 'module|file-upload-chunk|payload',
  async handler (data) {
    try {
      const socket = GetSocket(data.socket_id)
      const chunk = data.chunk
      const fileId = data.file_id
      const fileExt = data.file_ext
      const file = Fs.createWriteStream(`${TMP_UPLOADS_DIR}/${fileId}`, { flags: 'a' })
      file.write(chunk)
      file.end()
      if (data.place > data.goal) {
        await Fs.move(`${TMP_UPLOADS_DIR}/${fileId}`, `${UPLOADS_DIR}/${fileId}.${fileExt}`)
        const user = await FindUser({ githubUsername: socket.request.session.identifier.githubUsername })
        const upload = await MC.model.Upload.findById(fileId)
        const historyBefore = CloneDeep(upload)
        upload.upload_status = 1
        const saved = await upload.save()
        await MC.model.History.create({
          bucket: 'upload',
          event: 'complete',
          initiator: user._id,
          client: fileId,
          subject: fileId,
          initiator_ref: 'sl3_users',
          client_ref: 'sl3_uploads',
          subject_ref: 'sl3_uploads',
          before: historyBefore,
          after: saved
        })
        // File upload complete
        return socket.emit('module|file-upload-complete|payload')
      }
      // Emit db entry _id, chunksize and an incremented chunk place of 0
      socket.emit('module|file-upload-chunk|payload', {
        file_id: fileId,
        file_ext: fileExt,
        chunksize: MC.modules.uploader.chunkSize,
        place: data.place += 1,
        goal: data.goal
      })
    } catch (e) {
      console.log('============= [websocket: module|file-upload-chunk|payload]')
      console.log(e)
    }
  }
})
