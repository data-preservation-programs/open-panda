<template>
  <div
    :class="['block text-block', `align__${block.align ? block.align : 'left'}`]">

    <h5 v-if="block.label" class="label">
      <TriangleArrow v-if="block.showLabelIcon" class="icon" />
      <span>{{ block.label }}</span>
    </h5>

    <h1 v-if="block.heading" class="heading" v-html="block.heading"></h1>

    <div class="text-wrapper">
      <div v-if="block.description" class="description">
        <MarkdownParser :markdown="block.description" />
      </div>
    </div>

    <div v-if="block.ctas" class="button-row">
      <div v-if="block.ctas && Array.isArray(block.ctas)">
        <Button v-for="(cta, index) in ctaData" :key="index" :button="cta" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button'
import MarkdownParser from '@/components/markdown-parser'

export default {
  name: 'TextBlock',

  components: {
    Button,
    MarkdownParser
  },

  props: {
    block: {
      /**
       * align: String (left, right, center)
       * label: String
       * heading: String
       * description: String
       * ctas: [{Button}]
       */
      type: Object,
      required: true
    }
  },

  computed: {
    ctaData () {
      return this.block.ctas.map((object) => {
        return { ...object, disabled: object.url === undefined || object.url === '' }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  position: relative;
  &.align__center {
    text-align: center;
    .label,
    .button-row {
      justify-content: center;
    }
  }
  &.align__right {
    text-align: right;
    .label,
    .button-row {
      justify-content: flex-end;
    }
  }
  > * {
    margin-bottom: toRem(30);
    position: relative;
  }
}

.button-row {
  margin-bottom: 0;
  .button:first-child {
    margin-right: toRem(35);
  }
  .button:only-child {
    margin-right: 0;
  }
}
</style>
