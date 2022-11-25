<template>
  <section id="pagination-controls">

    <div class="inner-wrapper">

      <template v-if="page !== 1">
        <button
          class="control-button first"
          @click="incrementPage(1)">
          First
        </button>
        <button
          class="control-button prev"
          @click="incrementPage(page - 1)">
          Prev
        </button>
        <div class="breaker">
          {{ breaker }}
        </div>
      </template>

      <template v-for="pageButton in pages">
        <button
          v-if="pageButton.display"
          :key="`page-${pageButton.num}`"
          :class="['page-button', { current: pageButton.current }]"
          @click="incrementPage(pageButton.num)">
          {{ pageButton.num }}
        </button>
      </template>

      <template v-if="page !== totalPages">
        <div class="breaker">
          {{ breaker }}
        </div>
        <button
          class="control-button next"
          @click="incrementPage(page + 1)">
          Next
        </button>
        <button
          class="control-button last"
          @click="incrementPage(totalPages)">
          Last
        </button>
      </template>

    </div>

    <Spinner v-if="loading" />

  </section>
</template>

<script>
// ===================================================================== Imports
import Spinner from '@/components/spinners/material-circle'

// ====================================================================== Export
export default {
  name: 'PaginationControls',

  components: {
    Spinner
  },

  props: {
    breaker: {
      type: String,
      required: false,
      default: '⋯'
    },
    page: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    storeKey: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    pages () {
      const total = this.totalPages
      const current = this.page
      const buffer = 2
      const compiled = []
      for (let i = 0; i < total; i++) {
        compiled.push({
          num: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  methods: {
    incrementPage (page) {
      this.$store.dispatch(`${this.storeKey}/incrementPage`, { route: this.$route, page })
    }
  }
}
</script>

<style lang="scss" scoped>
$dimension: 2.75rem;

// ///////////////////////////////////////////////////////////////////// General
#pagination-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.inner-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

// /////////////////////////////////////////////////////////// Buttons & Breaker
.page-button,
.breaker {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: $dimension;
  height: $dimension;
  @include tiny {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.page-button,
.control-button {
  font-size: 0.875rem;
  font-weight: 500;
}

.breaker {
  display: flex;
  font-weight: 500;
  color: tomato;
}

.page-button {
  display: flex;
  &:not(.current) {
    &:hover {
      text-decoration: underline;
    }
  }
  &.current {
    color: tomato;
    background-color: teal;
    border-radius: 0.3125rem;
    cursor: default;
  }
}

.control-button {
  &:hover {
    text-decoration: underline;
  }
  &.first,
  &.prev {
    margin-right: 1rem;
  }
  &.next,
  &.last {
    margin-left: 1rem;
  }
  &.prev,
  &.next {
    @include mini {
      display: none;
    }
  }
}

.spinner {
  margin-left: 1rem;
}
</style>
