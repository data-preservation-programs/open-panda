<template>
  <Paginator
    v-bind="$props"
    id="pagination-controls"
    v-on="$listeners">

    <template #first="{ incrementPage, getIndex }">
      <button
        class="control-button first"
        @click="incrementPage({ index: getIndex(1), live: true })">
        First
      </button>
    </template>

    <template #prev="{ incrementPage, getIndex }">
      <button
        class="control-button prev"
        @click="incrementPage({ index: getIndex(page - 1), live: true })">
        Prev
      </button>
    </template>

    <template #breaker-left>
      <div class="breaker">
        ⋯
      </div>
    </template>

    <template #button="{ button, incrementPage, getIndex }">
      <button
        v-if="button.display"
        :key="`page-${button.value}`"
        :class="['page-button', { current: button.current }]"
        @click="incrementPage({ index: getIndex(button.value), live: true })">
        {{ button.value }}
      </button>
    </template>

    <template #breaker-right>
      <div class="breaker">
        ⋯
      </div>
    </template>

    <template #next="{ incrementPage, getIndex }">
      <button
        class="control-button next"
        @click="incrementPage({ index: getIndex(page + 1), live: true })">
        Next
      </button>
    </template>

    <template #last="{ incrementPage, getIndex }">
      <button
        class="control-button last"
        @click="incrementPage({ index: getIndex(totalPages), live: true })">
        Last
      </button>
    </template>

    <template #after>
      <Spinner v-if="loading" />
    </template>

  </Paginator>
</template>

<script>
// ===================================================================== Imports
import Paginator from '@/modules/search/components/paginator'
import Spinner from '@/components/spinners/material-circle'

// ====================================================================== Export
export default {
  name: 'PaginationControls',

  components: {
    Paginator,
    Spinner
  },

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    page: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$dimension: 2.5rem;

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
  opacity: .5;
}

.page-button {
  display: flex;
  &:not(.current) {
    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 2px;
    }
  }
  &.current {
    border: 2px solid $tasman;
    border-radius: 0.3125rem;
    cursor: default;
  }
}

.control-button {
  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
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
