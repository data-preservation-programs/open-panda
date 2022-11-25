<template>
  <div class="error-page">

    <section class="content">
      <div class="grid">
        <div class="col">
          <div class="inner-content">

            <h1 class="heading">
              {{ message }}
            </h1>

          </div>
        </div>
      </div>
    </section>

    <img class="image" src="~assets/images/star-warp.jpg" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    message () {
      return this.siteContent.general['404_error_message']
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  position: relative;
  margin-bottom: -5rem;
  overflow: hidden;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  [class~="grid"], [class*="grid-"], [class*="grid_"] {
    width: 100%;
    height: 100%;
  }
}

.inner-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.heading {
  font-size: 3.125rem;
  font-weight: 600;
  @include mini {
    font-size: 2rem;
  }
}

.image {
  position: relative;
  width: 100%;
  @include mini {
    width: 150%;
    left: -22%;
  }
}
</style>
