<template>
  <header class="grid-middle-center-spaceBetween-noGutter">
    <Searchbar
      placeholder="Search datasets"
      theme="solid" />
    <Filters />

    <nuxt-link to="/" class="logo-link">
      <SiteLogo />
    </nuxt-link>

    <nav>
      <Button
        v-for="(link, index) in headerData.nav"
        :key="index"
        :button="{
          text: link.label,
          type: 'nav',
          selected: isRouteCurrent(link.href ? link.href : null),
          disabled: typeof link.href === 'undefined' || link.href === '',
          url: link.href
        }" />
    </nav>

    <div
      :class="['hamburger']"
      @click="toggleNav">
      <div class="icon"></div>
    </div>
  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Button from '@/components/buttons/button'
import SiteLogo from '@/components/icons/logo'
import Searchbar from '@/components/searchbar'
import Filters from '@/components/filters'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Button,
    SiteLogo,
    Searchbar,
    Filters
  },

  data () {
    return {
      navigationOpen: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    headerData () {
      return this.siteContent.general ? this.siteContent.general.header : false
    }
  },

  methods: {
    isRouteCurrent (href) {
      return this.$route.fullPath === href
    },
    toggleNav () {
      if (this.navigationOpen) {
        this.closeNav()
      } else {
        this.navigationOpen = true
        document.body.classList.remove('no-scroll')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding-top: toRem(50);
  padding-bottom: toRem(70);
}

:deep(.searchbar) {
  @include medium {
    display: none;
  }
}

:deep(nav) {
  @include medium {
    display: none;
  }
  > * {
    margin-right: toRem(10);
    @include large {
      margin-right: toRem(5);
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

.logo-link {
  svg {
    width: 100%;
  }
  @include large {
    width: toRem(160);
  }
  @include medium {
    width: toRem(120);
  }
}

.hamburger {
  width: 24px;
  height: 24px;
  transition-duration: 150ms;
  display: none;
  cursor: pointer;
  position: relative;
  @include medium {
    display: block;
  }

  .icon {
    transition-duration: 150ms;
    position: absolute;
    height: 3px;
    width: 24px;
    top: 10px;
    background-color: $rangoonGreen;
    &:before {
      transition-duration: 150ms;
      position: absolute;
      width: 13px;
      height: 3px;
      right: 0;
      background-color: $rangoonGreen;
      content: "";
      top: -6px;
    }
    &:after {
      transition-duration: 150ms;
      position: absolute;
      width: 13px;
      height: 3px;
      background-color: $rangoonGreen;
      content: "";
      top: 6px;
    }
  }

  &.open {
    .icon {
      transition-duration: 150ms;
      background: transparent;
      will-change: transform;
      &:before {
        width: 24px;
        transform: rotateZ(45deg) scaleX(1.25) translate(4px, 4px);
      }
      &:after {
        width: 24px;
        transform: rotateZ(-45deg) scaleX(1.25) translate(3px, -4px);
      }
    }
  }
}
</style>
