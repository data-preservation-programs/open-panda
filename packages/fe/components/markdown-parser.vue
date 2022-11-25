<template>

  <div
    ref="markdown"
    class="markdown"
    v-html="parsed" />

</template>

<script>
// ===================================================================== Imports
import Kramed from 'kramed'
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'MarkdownParser',

  props: {
    markdown: { // unprocessed markdown
      type: String,
      required: true
    }
  },

  data () {
    return {
      renderer: false,
      headings: [],
      baseURL: false,
      textCopied: 'Copied!',
      textNotCopied: 'Click to copy link'
    }
  },

  computed: {
    ...mapGetters({
      clipboard: 'general/clipboard'
    }),
    parsed () {
      return Kramed(this.markdown, { renderer: this.renderer })
    }
  },

  created () {
    this.renderer = new Kramed.Renderer()
    // /////////////////////////////////////////////////////////////////// Links
    this.renderer.link = function (href, title, text) {
      const split = text.split('||')
      const len = split.length
      let attributeString = ''
      if (len > 1) {
        try {
          const attributes = JSON.parse(split[1].replace(/&quot;/g, '"'))
          if (typeof attributes === 'object') {
            Object.keys(attributes).forEach((key) => {
              attributeString += `${key}="${attributes[key]}" `
            })
          }
        } catch (e) {
          return `<a href="${href}">${split[0]}</a>`
        }
      }
      return `<a href="${href}" ${attributeString}>${split[0]}</a>`
    }
    // //////////////////////////////////////////////////////////////// Headings
    this.renderer.heading = function (text, level) {
      const escapedText = text.toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
      return `
        <div class="copy-heading-button-container">
          <button class="copy-heading-button" hash="${escapedText}" data-tooltip="Click to copy link" data-tooltip-theme="light">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195.085 195.085">
              <path fill="#E3D3C0" d="M179.617,15.453c-0.051-0.05-0.102-0.1-0.154-0.149c-18.689-18.549-48.477-20.463-69.37-4.441c-2.091,1.599-3.776,3.053-5.302,4.575c-0.044,0.044-0.087,0.088-0.13,0.133L71.224,49.012c-2.929,2.929-2.929,7.678,0.001,10.606c2.93,2.93,7.679,2.929,10.606-0.001l33.561-33.566c0.035-0.035,0.069-0.07,0.104-0.105c1.023-1.01,2.205-2.02,3.715-3.174c15.008-11.508,36.411-10.098,49.789,3.281c0.044,0.044,0.089,0.088,0.134,0.131c14.652,14.786,14.611,38.742-0.124,53.483l-33.559,33.563c-2.929,2.929-2.929,7.678,0.001,10.606c1.465,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197l33.56-33.563C200.241,69.641,200.241,36.077,179.617,15.453z" />
              <path fill="#E3D3C0" d="M113.23,135.437l-33.541,33.542c-0.066,0.067-0.132,0.136-0.196,0.205c-3.708,3.648-8.059,6.449-12.945,8.333c-13.995,5.418-29.888,2.07-40.481-8.524c-14.768-14.784-14.768-38.84,0-53.619L59.624,81.83c1.406-1.407,2.197-3.315,2.197-5.305v-0.013c0-4.143-3.357-7.494-7.5-7.494c-2.135,0-4.062,0.895-5.428,2.328l-33.435,33.422c-20.61,20.628-20.612,54.195-0.002,74.828c10.095,10.097,23.628,15.479,37.411,15.479c6.414-0.001,12.884-1.167,19.084-3.566c6.922-2.667,13.088-6.67,18.326-11.896c0.076-0.075,0.15-0.153,0.223-0.232l33.337-33.337c2.929-2.93,2.929-7.678-0.001-10.607C120.909,132.509,116.16,132.509,113.23,135.437z" />
              <path fill="#E3D3C0" d="M59.15,135.908c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196l66.164-66.161c2.93-2.929,2.93-7.678,0.001-10.606c-2.929-2.93-7.678-2.929-10.606-0.001l-66.164,66.161C56.221,128.23,56.221,132.979,59.15,135.908z" />
            </svg>
          </button>
          <h${level} id="${escapedText}">
            ${text}
          </h${level}>
        </div>
      `
    }
  },

  mounted () {
    this.headings = document.getElementsByClassName('copy-heading-button')
    this.baseURL = this.$config.frontendUrl + this.$route.path
    const len = this.headings.length
    for (let i = 0; i < len; i++) {
      const button = this.headings[i]
      const hash = button.getAttribute('hash')
      const url = `${this.baseURL}#${hash}`
      button.addEventListener('click', () => {
        this.$addTextToClipboard(url)
        this.clearCopiedStates()
        button.setAttribute('data-tooltip', this.textCopied)
      })
    }
  },

  methods: {
    ...mapActions({
      setClipboard: 'general/setClipboard'
    }),
    clearCopiedStates () {
      const len = this.headings.length
      for (let i = 0; i < len; i++) {
        this.headings[i].setAttribute('data-tooltip', this.textNotCopied)
      }
    }
  }
}
</script>
