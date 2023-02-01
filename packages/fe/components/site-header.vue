<template>
  <div>
    <NavMobile :header="headerData" :class="['mobile-nav', {'mobile-nav-open': navigationOpen}]" />
    <header class="grid-middle-center-spaceBetween-noGutter">
      <Filters class="show-desktop-only" open-direction="right" :show-search="true" />

      <nuxt-link to="/" class="logo-link">
        <SiteLogo class="logo-big" />
        <SiteLogoSmall class="logo-small" />
      </nuxt-link>

      <nav class="desktop-nav">
        <ButtonNav
          v-for="(link, index) in headerData.nav"
          :key="index"
          :button="{
            text: link.label,
            selected: $isRouteCurrent($route, link.href ? link.href : null),
            disabled: typeof link.href === 'undefined' || link.href === '',
            url: link.href,
            tooltip: link.tooltip || ''
          }" />
      </nav>

      <div class="hamburger-c" @click="toggleNav">
        <IconSearch />
        <div :class="['hamburger', { open : navigationOpen}]">
          <div class="hamburger-icon"></div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import Throttle from 'lodash/throttle'

import ButtonNav from '@/components/buttons/button-nav'
import SiteLogo from '@/components/icons/logo'
import SiteLogoSmall from '@/components/icons/logo-sm'
import Filters from '@/components/filters'
import IconSearch from '@/components/icons/search'
import NavMobile from '@/components/nav-mobile'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    ButtonNav,
    SiteLogo,
    SiteLogoSmall,
    Filters,
    IconSearch,
    NavMobile
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      navigationOpen: 'general/navigationOpen'
    }),
    headerData () {
      return this.siteContent.general ? this.siteContent.general.header : false
    }
  },

  mounted () {
    this.setNavigationOpen(false)
    this.resize = Throttle(() => {
      if (this.navigationOpen) {
        this.setNavigationOpen(false)
      }
    }, 200)
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      setNavigationOpen: 'general/setNavigationOpen'
    }),
    toggleNav () {
      if (this.navigationOpen) {
        this.setNavigationOpen(false)
      } else {
        this.setNavigationOpen(true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding-top: toRem(50);
  padding-bottom: toRem(70);
  @include medium {
    padding-top: toRem(10);
    padding-bottom: toRem(10);
  }
}

:deep(.searchbar) {
  @include large {
    width: toRem(210);
  }
}

.desktop-nav {
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
  .show-desktop-only {
    :deep(.button-filter span) {
      display: none;
    }
    :deep(.button-filter .icon) {
      margin-right: 0 !important;
    }
  }
}

.logo-link {
  z-index: 101;
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

.hamburger-c {
  position: relative;
  z-index: 101;
  align-items: center;
  display: none;
  cursor: pointer;
  @include medium {
    display: flex;
  }
  :deep(.icon-search) {
    width: toRem(17);
  }
}
.hamburger {
  width: 20px;
  height: 18px;
  top: -3px;
  transition-duration: 150ms;
  margin-left: toRem(15);
  position: relative;

  .hamburger-icon {
    transition-duration: 150ms;
    position: absolute;
    height: 2px;
    width: 20px;
    top: 10px;
    background-color: $rangoonGreen;
    &:before {
      transition-duration: 150ms;
      position: absolute;
      width: 20px;
      height: 2px;
      right: 0;
      background-color: $rangoonGreen;
      content: "";
      top: -6px;
    }
    &:after {
      transition-duration: 150ms;
      position: absolute;
      width: 20px;
      height: 2px;
      left: 0;
      background-color: $rangoonGreen;
      content: "";
      top: 6px;
    }
  }

  &.open {
    .hamburger-icon {
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

.mobile-nav {
  @include fadeOut;
  &.mobile-nav-open {
    @include fadeIn;
  }
}
</style>
