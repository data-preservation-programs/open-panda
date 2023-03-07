<template>
  <div class="faq-card">

    <div
      v-if="index"
      class="index">
      <span>{{ stylizedIndex }}</span>
    </div>

    <div class="content">

      <div class="title">
        {{ title }}
      </div>

      <div class="description">
        {{ description }}
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FAQCard',

  props: {
    index: {
      type: Number,
      required: false,
      default: 0
    },
    card: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    title () {
      return this.card.title
    },
    description () {
      return this.card.description
    },
    stylizedIndex () {
      return this.index > 9 ? this.index.toString() : `0${this.index}`
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.faq-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-top: solid 2px black;
  &:last-child {
    border-bottom: solid 2px black;
  }
  @include small {
    &:last-child {
      border-bottom: none;
    }
  }
}

.index {
  @include h4;
  @include small {
    position: absolute;
    top: 1.8125rem;
    left: 0;
    font-size: toRem(28);
    line-height: leading(32, 28);
  }
}

.content {
  display: flex;
  flex-direction: column;
  width: 80%;
  @include small {
    width: 100%;
  }
}

.title {
  @include h4;
  margin-bottom: 0.625rem;
  @include small {
    padding-left: 3.5rem;
    font-size: toRem(22);
    line-height: leading(34, 22);
    margin-bottom: 1.25rem;
  }
}

.description {
  @include p2;
  margin-bottom: 0.75rem;
  @include small {
    margin-bottom: 0;
  }
}
</style>
