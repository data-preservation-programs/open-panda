<template>
  <header
    v-if="links"
    id="site-header"
    ref="header"
    :class="{ mini }">

    <div class="grid-noGutter">
      <div class="col">
        <div class="inner-container">

          <!-- <nuxt-link to="/" class="logo-link">
            <img class="logo" src="~assets/images/logo-horizontal.png" />
          </nuxt-link> -->

          <nav id="site-nav">
            <ButtonA
              v-for="(link, index) in links"
              :key="index"
              :to="link.href"
              :text="link.label"
              :selected="isRouteCurrent(link.href)"
              tag="nuxt-link"
              class="site-nav-link" />
          </nav>

        </div>
      </div>
    </div>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonA from '@/components/buttons/button-a'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    ButtonA
  },

  data () {
    return {
      mini: false,
      scroll: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      const siteContent = this.siteContent
      return siteContent.general ? siteContent.general.navigation.header : false
    }
  },

  mounted () {
    const scrollHandler = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop
      const mini = this.mini
      if (y > 0) {
        if (!mini) { this.mini = true }
      } else {
        if (mini) { this.mini = false }
      }
    }; scrollHandler()
    this.scroll = this.$throttle(scrollHandler, 1)
    window.addEventListener('scroll', this.scroll)
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $siteHeaderHeight;
  z-index: 1000;
  transition: background-color 150ms ease-out, height 150ms ease-out;
  &.mini {
    transition: background-color 150ms ease-in, height 150ms ease-in;
    height: $siteHeaderHeightMini;
    @include mini {
      height: $siteHeaderHeight;
    }
    .logo-link {
      transform: scale(0.85);
      @include mini {
        transform: scale(1);
      }
    }
  }
}

[class~="grid"],
[class*="grid-"],
[class*="grid_"] {
  height: 100%;
}

.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;;
  align-items: center;
  width: 100%;
  height: 100%;
  @include small {
    flex-wrap: wrap;
    padding: 1rem 0;
  }
}

#site-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include small {
    display: none;
  }
}

// /////////////////////////////////////////////////////////////////////// Links
.site-nav-link {
  &:not(:last-child) {
    margin-right: 3rem;
  }
}

.logo-link {
  display: block;
}

.logo {
  height: 2.5rem;
  transition: 150ms ease-out;
  @include small {
    height: 2rem;
  }
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.05);
  }
}
</style>
