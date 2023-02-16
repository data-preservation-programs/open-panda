<template>
  <footer>

    <div class="grid-bottom">
      <div class="col-5_md-12">
        <img :src="footerData.image">
      </div>
  
      <div class="col-7_md-12">
        <div class="right">
          <h3>{{ footerData.heading }}</h3>
          <div class="grid-spaceBetween-noGutter">
            <nav class="col-5_ti-12">
              <Button
                v-for="(link, index) in footerData.nav_1"
                :key="index"
                :button="{
                  type: 'footerNav',
                  text: link.label,
                  url: link.href
                }" />
            </nav>
            <nav class="col-3_ti-12">
              <Button
                v-for="(link, index) in footerData.nav_2"
                :key="index"
                :button="{
                  type: 'footerNav',
                  text: link.label,
                  url: link.href
                }" />
            </nav>
            <nav class="col-3_ti-12">
              <Button
                v-for="(link, index) in footerData.nav_3"
                :key="index"
                :button="{
                  type: 'footerNav',
                  text: link.label,
                  url: link.href
                }" />
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-1-right">
      <div class="col copyright" v-html="footerData.copyright">
      </div>
    </div>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Button from '@/components/buttons/button'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    Button
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    footerData () {
      return this.siteContent.general.footer
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  padding: toRem(50) 0 toRem(10) 0;
}
.copyright {
  text-align: right;
  :deep(a) {
    &:hover {
      text-decoration: underline;
    }
  }
}
.right {
  background-color: $rangoonGreen;
  color: $grayNurse;
  padding: 13% 15% 11%;
  border-top-left-radius: toRem(100);
  border-top-right-radius: toRem(100);
  border-bottom-left-radius: toRem(100);
  @include medium {
    padding: toRem(40) toRem(40) toRem(40) toRem(48);
    border-top-left-radius: toRem(50);
    border-top-right-radius: toRem(50);
    border-bottom-left-radius: toRem(50);
  }
  :deep(h3) {
    margin-bottom: toRem(40);
    @include medium {
      margin-bottom: toRem(20);
    }
  }
  :deep(.button) {
    display: block;
    margin-bottom: toRem(20);
    @include medium {
      margin-bottom: toRem(16);
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  nav {
    @include tiny {
      margin-bottom: toRem(20);
    }
  }
}
</style>
