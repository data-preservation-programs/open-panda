<template>
  <div id="site-header">

    <!-- ======================================================== Mobile nav -->
    <NavMobile :header="headerData" :class="['mobile-nav', {'mobile-nav-open': navigationOpen}]" />

    <!-- ============================================================ Header -->
    <header :class="['grid-middle-center-spaceBetween-noGutter', { 'has-breadcrumbs': hasBreadcrumbs }]">
      <Filters class="show-desktop-only" open-direction="right" :show-typeahead="true" />

      <div class="logo-container">

        <nuxt-link to="/" class="logo-link" @click.native="setNavigationOpen(false)">
          <SiteLogo class="logo-big" />
          <SiteLogoSmall class="logo-small" />
        </nuxt-link>

        <nuxt-link to="/alpha" class="alpha-tag-link" @click.native="setNavigationOpen(false)">
          <AlphaTag class="alpha-tag" />
        </nuxt-link>

      </div>

      <nav class="desktop-nav">
        <ButtonNav
          v-for="(link, index) in navLinks"
          :key="index"
          :tag="link.tag"
          :to="link.href"
          :label="link.label"
          :selected="$isRouteCurrent($route, link.href ? link.href : null)"
          :disabled="link.disabled || !link.href || link.href === ''"
          :tooltip="link.tooltip" />
      </nav>

      <div class="hamburger-c" @click="toggleNav">
        <IconSearch />
        <div :class="['hamburger', { open : navigationOpen}]">
          <div class="hamburger-icon"></div>
        </div>
      </div>
    </header>

    <!-- ======================================================= Breadcrumbs -->
    <div class="grid">
      <div class="col">
        <Breadcrumbs @visibility-hidden="toggleBreadcrumbs" />
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import Throttle from 'lodash/throttle'

import ButtonNav from '@/components/buttons/button-nav'
import SiteLogo from '@/components/icons/logo'
import AlphaTag from '@/components/icons/alpha-tag'
import SiteLogoSmall from '@/components/icons/logo-sm'
import Filters from '@/components/filters'
import IconSearch from '@/components/icons/search'
import NavMobile from '@/components/nav-mobile'
import Breadcrumbs from '@/components/breadcrumbs'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    ButtonNav,
    SiteLogo,
    AlphaTag,
    SiteLogoSmall,
    Filters,
    IconSearch,
    NavMobile,
    Breadcrumbs
  },

  data () {
    return {
      hasBreadcrumbs: true
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      navigationOpen: 'general/navigationOpen'
    }),
    headerData () {
      return this.siteContent.general.header
    },
    navLinks () {
      return this.headerData.nav
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
    },
    toggleBreadcrumbs (val) {
      this.hasBreadcrumbs = val
    }
  }
}
</script>

<style lang="scss" scoped>
#site-header {
  padding-top: toRem(50);
  padding-bottom: toRem(70);
  @include medium {
    padding-top: toRem(10);
    padding-bottom: toRem(10);
  }
  &.has-breadcrumbs {
    padding-bottom: 0.875rem;
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
  :deep(.tooltip) {
    left: 50%;
    transform: translateX(-50%);
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

.logo-container {
  position: relative;
}

.logo-link {
  z-index: 101;
  svg {
    display: block;
    width: 100%;
  }
  .logo-small {
    display: none;
    @include large {
      width: 4vw;
      display: inline-block;
    }
    @include medium {
      display: none;
    }
  }
  .logo-big {
    width: toRem(202);
    @include large {
      display: none;
    }
    @include medium {
      width: toRem(121);
      display: inline-block;
    }
  }
}

.alpha-tag-link {
  position: absolute;
  top: calc(100% - 3px);
  right: 0.5rem;
  @include large {
    right: -3px;
  }
  @include medium {
    right: 0.4vw;
    top: calc(100% - 7px);
  }
  &:hover {
    transform: scale(1.1);
  }
}

.alpha-tag {
  width: toRem(55);
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
