<template>
  <Searcher
    :search-value="searchValue"
    :action="action"
    :store-getter="storeGetter"
    :store-action="storeAction"
    @searchbarUpdated="$emit('searchbarUpdated')"
    v-on="$listeners">
    <div
      slot-scope="{ value, updateValue, empty }"
      :class="['searchbar', `theme__${theme}`, { focused, empty, loading }]">

      <div class="input-wrapper">

        <input
          ref="input"
          :value="value"
          :placeholder="placeholder"
          type="text"
          class="input"
          @input="updateValue"
          @focus="focused = true"
          @blur="focused = false">

        <button
          :class="['search-button', { loading }]"
          @click="focusInput">
          <Spinner />
          <IconSearch />
        </button>

      </div>

    </div>
  </Searcher>
</template>

<script>
// ===================================================================== Imports
import Searcher from '@/modules/search/components/searcher'
import Spinner from '@/components/spinners/material-circle'

import IconSearch from '@/components/icons/search'

// ====================================================================== Export
export default {
  name: 'Searchbar',

  components: {
    Searcher,
    Spinner,
    IconSearch
  },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'Enter a search term'
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    searchValue: {
      type: String,
      required: false,
      default: ''
    },
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    storeGetter: {
      type: String,
      required: false,
      default: 'general/searchValue'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setSearchValue'
    },
    theme: {
      type: String, // 'line' or 'solid'
      required: false,
      default: 'line'
    }
  },

  data () {
    return {
      focused: false
    }
  },

  watch: {
    focused () {
      this.$emit('inputFocused')
    }
  },

  methods: {
    focusInput () {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input {
  flex: 1;
  appearance: none;
  height: 100%;
  padding: 0.75rem;
  font-weight: 500;
  transition: 150ms ease-out;
  color: $fuscousGray;
  @include placeholder {
    color: $fuscousGray;
    opacity: 1;
  }
}

.search-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-right: toRem(20);
  margin-left: toRem(10);
  cursor: pointer;
  &.loading {
    .spinner {
      opacity: 1;
    }
    .icon-search {
      opacity: 0;
    }
  }
  .spinner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 1.125rem;
    height: 1.125rem;
    opacity: 0;
  }
}

.icon-search {
  display: block;
  width: 1rem;
}

::v-deep .clear-button {
  &:hover {
    .svg-icon path {
      transition: 150ms ease-in;
      fill: tomato;
    }
  }
  .svg-icon {
    width: 8px;
    margin-right: 0.25rem;
    path {
      transition: 150ms ease-out;
      fill: teal;
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__line {
  border: 2px solid $tasman;
  border-radius: toRem(30);
  .input {
    padding: toRem(15) toRem(30);
  }
  .icon-container {
    align-items: flex-end;
  }
}

.theme__solid {
  background-color: white;
  border-radius: toRem(30) toRem(30) toRem(30) toRem(2);
  @include shadow3;
  .input {
    padding: toRem(15) toRem(15) toRem(15) toRem(22);
  }
}

</style>
