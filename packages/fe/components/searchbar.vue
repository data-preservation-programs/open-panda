<template>
  <Searcher
    :search-value="searchValue"
    :action="action"
    :store-getter="storeGetter"
    :store-action="storeAction"
    @searchbarUpdated="$emit('searchbarUpdated')"
    v-on="$listeners">
    <div
      slot-scope="{ value, updateValue, empty, clearSearch }"
      :class="['searchbar', `theme__${theme}`, `format__${format}`, { focused, empty, loading }]">

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

        <ButtonB
          v-if="!empty"
          format="tiny"
          class="clear-button"
          @clicked="clearSearch">
          <IconClose />
          <span>Clear</span>
        </ButtonB>

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
import ButtonB from '@/components/buttons/button-b'

import IconSearch from '@/components/icons/search'
import IconClose from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'Searchbar',

  components: {
    Searcher,
    Spinner,
    ButtonB,
    IconSearch,
    IconClose
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
      type: String, // 'contained', 'line' or 'standalone'
      required: false,
      default: 'line'
    },
    format: {
      type: String, // 'regular' or 'mini'
      required: false,
      default: 'regular'
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
  @include placeholder {
    opacity: 1;
  }
}

.search-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0.625rem;
  margin-right: -0.625rem;
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
.theme__contained {
  border-radius: 1rem;
  border: 2px solid tomato;
  &:hover {
    background-color: rgba(8, 16, 17, 0.5);
  }
  &.focused {
    background-color: teal;
  }
}

.theme__line {
  border-bottom: 3px solid tomato;
  .input {
    padding: 0.5rem;
    padding-left: 0;
  }
  .icon-container {
    align-items: flex-end;
  }
}

.theme__standalone {
  background-color: teal;
  border: 1px solid blue;
  border-radius: 0.5rem;
  .input {
    padding-right: 0;
  }
  .search-button {
    margin-right: 0;
  }
}

// ///////////////////////////////////////////////////////////////////// Formats
.format__mini {
  .input {
    font-size: 0.875rem;
    padding: 0.5rem 0 0.5rem 0.75rem;
  }
  .search-button {
    padding: 0.5rem;
  }
}
</style>
