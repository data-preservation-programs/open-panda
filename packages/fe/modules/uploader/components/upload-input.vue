<template>
  <div class="upload-input-container">

    <!-- ========================================================== metadata -->
    <slot
      v-if="file"
      :filename="filename"
      :filesize="filesize"
      :mimetype="mimetype"
      name="metadata" />

    <!-- ============================================================ loader -->
    <slot
      :progress="progress"
      name="progress" />

    <!-- ============================================== [button] upload file -->
    <div class="file-upload-container">

      <div class="file-upload-button-wrapper">
        <slot
          :click-file-input="clickFileInput"
          name="file-upload-button" />
      </div>

      <input
        ref="fileInput"
        type="file"
        class="input"
        :accept="acceptedMimetypes"
        @change="handleInputChange" />

    </div>

    <!-- ========================================= [button] prompt to upload -->
    <slot
      v-if="file && promptToUpload && status === 'idle'"
      :upload-file="uploadFile"
      :clear-file-input="clearFileInput"
      name="prompt-to-upload" />

    <!-- ===================================== [general content area] bottom -->
    <slot name="bottom" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'UploadInput',

  props: {
    acceptedMimetypes: {
      type: String,
      required: true
    },
    promptToUpload: {
      type: Boolean,
      required: false,
      default: true
    },
    clearFileAfterUpload: {
      type: Boolean,
      required: false,
      default: false
    },
    clearProgressAfterUpload: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      status: 'idle', // 'idle', 'initializing', 'uploading', 'upload-complete'
      file: false,
      fileReader: false,
      socket: false,
      progress: 0,
      place: 0,
      nextChunkPayload: false
    }
  },

  computed: {
    filename () {
      return this.file.name
    },
    filesize () {
      return this.file.size
    },
    mimetype () {
      return this.file.type
    }
  },

  watch: {
    status (status) {
      this.$emit('statusChanged', status)
    },
    file (file) {
      this.$emit('fileChanged', file)
    }
  },

  async mounted () {
    this.fileReader = new FileReader()
    this.fileReader.onload = (e) => {
      this.socket.emit('module|file-upload-chunk|payload', Object.assign(this.nextChunkPayload, {
        chunk: e.target.result
      }))
    }
    this.$emit('statusChanged', status)
    await this.$connectWebsocket(this, () => {
      this.socket.on('module|file-upload-chunk|payload', this.uploadNextChunk)
      this.socket.on('module|file-upload-complete|payload', this.fileUploadComplete)
    })
    // this.socket.on('disconnect', () => {
    //   this.error = true
    //   this.resetVideoUpload()
    // })
  },

  methods: {
    handleInputChange (e) {
      const file = e.target.files[0]
      if (file) {
        this.file = file
        this.$emit('fileSelected')
        if (!this.promptToUpload) {
          this.uploadFile()
        }
      }
    },
    clickFileInput () {
      this.clearFileInput()
      this.$refs.fileInput.click()
    },
    clearFileInput () {
      this.status = 'idle'
      this.file = false
      this.progress = 0
      this.place = 0
      this.nextChunkPayload = false
      this.$refs.fileInput.value = null
    },
    uploadFile () {
      const file = this.file
      const formMetadata = {}
      for (const key in file) {
        const value = file[key]
        typeof value !== 'function' && (formMetadata[key] = value)
      }
      this.socket.emit('module|file-upload-initialize|payload', {
        socket_id: this.socket.id,
        filename: this.filename,
        filesize: this.filesize,
        mimetype: this.mimetype,
        form_metadata: formMetadata
      })
    },
    uploadNextChunk (data) {
      const file = this.file
      if (!file.id) {
        this.file.id = data.file_id
        this.status = 'uploading'
      }
      const chunksize = data.chunksize
      const filesize = this.filesize
      const place = data.place * chunksize
      const chunk = file.slice(place, place + Math.min(chunksize, (filesize - place)), file.type)
      this.place = data.place
      this.goal = data.goal
      this.progress = ((this.place / this.goal) * 100).toFixed(0)
      this.nextChunkPayload = {
        socket_id: this.socket.id,
        file_id: file.id,
        file_ext: data.file_ext,
        place: this.place,
        goal: this.goal
      }
      this.fileReader.readAsArrayBuffer(chunk)
    },
    fileUploadComplete () {
      this.status = 'upload-complete'
      this.place = 0
      this.nextChunkPayload = false
      if (this.clearFileAfterUpload) {
        this.file = false
      }
      if (this.clearProgressAfterUpload) {
        this.progress = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.upload-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// //////////////////////////////////////////////////////// [button] file upload
.file-upload-container {
  position: relative;
}

.file-upload-button-wrapper {
  position: relative;
  z-index: 10;
}

.input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 5;
}
</style>
