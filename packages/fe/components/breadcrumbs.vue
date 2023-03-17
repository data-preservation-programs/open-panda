<template>
  <div v-if="!hidden" class="breadcrumbs">

    <template v-for="(link, index) in links">

      <Button
        v-if="link.url"
        :key="`link-${index}`"
        :button="link"
        class="breadcrumb link">
      </Button>

      <div
        v-else
        :key="`text-${index}`"
        class="breadcrumb text">
        <span class="slug">{{ limitChars(50, link.text) }}</span>
        <span class="mobile-slug">{{ limitChars(20, link.text) }}</span>
      </div>

      <div
        :key="`divider-${index}`"
        class="divider">
        /
      </div>

    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Button from '@/components/buttons/button'

// ====================================================================== Export
export default {
  name: 'Breadcrumbs',

  components: {
    Button
  },

  data () {
    return {
      links: false,
      hidden: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      dataset: 'dataset/dataset'
    }),
    breadcrumbsMapping () {
      if (this.siteContent.general) {
        return this.siteContent.general.breadcrumbs_mapping
      }
      return false
    }
  },

  watch: {
    '$route' () {
      this.setBreadcrumbLinks()
    },
    hidden (val) {
      this.$emit('visibility-changed', val)
    }
  },

  mounted () {
    this.setBreadcrumbLinks()
  },

  methods: {
    setBreadcrumbLinks () {
      if (this.breadcrumbsMapping) {
        const breadcrumbs = this.breadcrumbsMapping
        const path = this.$route.path
        const items = path.split('/').filter(string => string !== '/' && string !== '')
        const links = [{ // contains index route by default
          type: 'default',
          url: '/',
          text: breadcrumbs.index
        }]
        this.hidden = true
        items.forEach((item, i) => {
          const routeName = items.slice(0, i + 1).join('-')
          if (breadcrumbs.hasOwnProperty(routeName)) {
            this.hidden = false
            const url = `/${items.slice(0, i + 1).join('/')}`
            if (i !== items.length - 1 && routeName !== 'dataset') {
              links.push({ type: 'default', url, text: breadcrumbs[routeName] })
            } else {
              links.push({ text: breadcrumbs[routeName] })
            }
          } else {
            if (this.dataset) {
              // single dataset
              links.push({ text: this.dataset.name })
            }
          }
        })
        this.links = links
      }
    },
    limitChars (amt, text) {
      if (text.length > amt) {
        return `${text.substring(0, amt)}...`
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.breadcrumbs {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1.75rem;
  padding-bottom: 1.25rem;
}

.breadcrumb {
  white-space: nowrap;
}

.link,
.text,
.divider {
  @include fontSize_14;
  @include fontWeight_Regular;
  line-height: leading(21, 14);
  margin-right: 0.25rem;
}

.divider {
  &:last-child {
    display: none;
  }
}

.slug {
  @include mini {
    display: none;
  }
}

.mobile-slug {
  display: none;
  @include mini {
    display: inline;
  }
}
</style>
