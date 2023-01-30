<template>
  <header class="grid-middle-center-spaceBetween-noGutter">
    <Filters open-direction="right" :show-search="true" />

    <nuxt-link to="/" class="logo-link">
      <SiteLogo class="logo-big" />
      <SiteLogoSmall class="logo-small" />
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
          url: link.href,
          tooltip: link.tooltip || ''
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
import SiteLogoSmall from '@/components/icons/logo-sm'
import Filters from '@/components/filters'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Button,
    SiteLogo,
    SiteLogoSmall,
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
  @include large {
    width: toRem(210);
  }
  @include medium {
    display: none;
  }
}

:deep(nav) {
  @include medium {
    display: none;
  }
  > * {
    margin-right: 0.4vw;
    &:last-child {
      margin-right: 0;
    }
  }
}

@include large {
  :deep(.button-filter span) {
    display: none;
  }
  :deep(.button-filter .icon) {
    margin-right: 0 !important;
  }
}

.logo-link {
  width: 10vw;
  @include large {
    width: 4vw;
  }
  @include medium {
    width: toRem(121);
  }
  svg {
    width: 100%;
  }
  .logo-small {
    display: none;
    @include large {
      display: inline-block;
    }
    @include medium {
      display: none;
    }
  }
  .logo-big {
    display: inline-block;
    @include large {
      display: none;
    }
    @include medium {
      display: inline-block;
    }
  }
}

.hamburger {
  width: 20px;
  height: 20px;
  transition-duration: 150ms;
  cursor: pointer;
  position: relative;
  display: none;
  @include medium {
    display: block;
  }

  .icon {
    transition-duration: 150ms;
    position: absolute;
    height: 3px;
    width: 20px;
    top: 10px;
    background-color: $rangoonGreen;
    &:before {
      transition-duration: 150ms;
      position: absolute;
      width: 20px;
      height: 3px;
      right: 0;
      background-color: $rangoonGreen;
      content: "";
      top: -6px;
    }
    &:after {
      transition-duration: 150ms;
      position: absolute;
      width: 20px;
      height: 3px;
      left: 0;
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
        width: 20px;
        transform: rotateZ(45deg) scaleX(1.25) translate(4px, 4px);
      }
      &:after {
        width: 20px;
        transform: rotateZ(-45deg) scaleX(1.25) translate(3px, -4px);
      }
    }
  }
}
</style>
