console.log('⚡️ [websocket] module|file-upload-initialize|payload')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mime = require('mime')

const FindUser = require('@Module_User/logic/find-user')
const { GetSocket } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.socket.listeners.push({
  name: 'module|file-upload-initialize|payload',
  async handler (data) {
    try {
      const socket = GetSocket(data.socket_id)
      const user = await FindUser({ githubUsername: socket.request.session.identifier.githubUsername })
      const mimetype = data.mimetype
      const filesize = data.filesize
      const fileExt = Mime.getExtension(mimetype)
      const chunksize = MC.modules.uploader.chunkSize
      // Create database entry
      const created = await MC.model.Upload.create({
        filename: data.filename,
        mimetype,
        filesize,
        file_ext: fileExt,
        upload_status: 0,
        form_metadata: data.form_metadata,
        owner: user._id
      })
      const uploadId = created._id
      await MC.model.History.create({
        bucket: 'upload',
        event: 'initialize',
        initiator: user._id,
        client: uploadId,
        subject: uploadId,
        initiator_ref: 'sl3_users',
        client_ref: 'sl3_uploads',
        subject_ref: 'sl3_uploads',
        before: null,
        after: created
      })
      // Emit db entry _id, chunksize and a start chunk place of 0
      socket.emit('module|file-upload-chunk|payload', {
        file_id: created._id,
        file_ext: fileExt,
        chunksize,
        place: 0,
        goal: filesize / chunksize // how many steps to reach 100% downloaded
      })
    } catch (e) {
      console.log('======== [websocket: module|file-upload-initialize|payload]')
      console.log(e)
    }
  }
})
