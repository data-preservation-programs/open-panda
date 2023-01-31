<template>
  <div class="mobile-nav-c">
    <div class="mobile-nav-inner">
      <div class="grid-noGutter">
        <Filters class="col-12" :show-search="true" />
        <Button
          v-for="(link, index) in header.nav"
          :key="index"
          :button="{
            text: link.label,
            selected: $isRouteCurrent($route, link.href ? link.href : null),
            disabled: typeof link.href === 'undefined' || link.href === '',
            url: link.href,
            tooltip: link.tooltip || ''
          }" />
      </div>
    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import Button from '@/components/buttons/button'
import Filters from '@/components/filters'

// ====================================================================== Export
export default {
  name: 'NavMobile',

  components: {
    Button,
    Filters
  },

  props: {
    header: {
      type: Object,
      required: false,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>

.mobile-nav-c {
  background-color: white;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  overflow: hidden;
  display: none;
  z-index: 100;
  padding-top: toRem(100);
  @include medium {
    display: block;
  }
  .mobile-nav-inner {
    overflow: scroll;
    height: 100%;
  }
}

</style>
