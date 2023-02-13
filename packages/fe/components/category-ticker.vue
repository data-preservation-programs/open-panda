<template>
  <div>
    <Filters class="show-mobile-only" open-direction="right" :show-typeahead="true" />
    <div class="category-ticker">
      <img :src="block.image" class="img" />
      <Filterer
        filter-key="categories"
        :options="filters.categories">
        <div
          slot-scope="{ applyFilter }"
          class="text-wrapper">

          <div class="message">
            {{ message }}
          </div>

          <div
            class="ticker"
            @click="applyFilter(categoryIndex)">
            <span
              v-for="(category, i) in categories"
              :key="category"
              :class="['tick', { current: categoryIndex === i }]">
              {{ category }}
            </span>
          </div>

        </div>
      </Filterer>
    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'
import Filterer from '@/modules/search/components/filterer'
import Filters from '@/components/filters'

// ====================================================================== Export
export default {
  name: 'CategoryTicker',

  components: {
    Filterer,
    Filters
  },

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data () {
    return {
      categoryIndex: 0,
      interval: false
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters'
    }),
    message () {
      return this.block.message
    },
    categories () {
      if (this.filters) { return this.filters.categories.map(item => item.label) }
      return []
    }
  },

  mounted () {
    if (this.categories.length) {
      this.$nextTick(() => {
        this.increment()
        this.interval = setInterval(() => { this.increment() }, 1750)
      })
    }
  },

  beforeDestroy () {
    if (this.interval) { clearInterval(this.interval) }
  },

  methods: {
    increment () {
      this.categoryIndex = (this.categoryIndex + 1) % this.categories.length
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.filters) {
  margin-bottom: toRem(20);
}

.category-ticker {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.text-wrapper {
  display: flex;
  position: absolute;
  bottom: 20%;
}

.ticker {
  position: relative;
  min-width: 5rem;
}

.message {
  margin-right: 0.25rem;
  @include fontSize_16;
  @include fontWeight_Medium;
  line-height: leading(24, 16);
}

.tick {
  @include fontSize_16;
  @include fontWeight_Bold;
  line-height: leading(24, 16);
  cursor: pointer;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 200ms ease;
  &.current {
    opacity: 1;
  }
}
</style>
