<template>
  <Searcher
    :search-value="searchValue"
    :action="action"
    :store-getter="storeGetter"
    :store-action="storeAction"
    :url-hash="showTypeahead ? '' : $route.hash "
    @searchbarUpdated="$emit('searchbarUpdated')"
    v-on="$listeners">
    <div
      slot-scope="{ value, updateValue, empty }"
      :class="['searchbar', showTypeahead ? 'has-typeahead' : 'no-typeahead', `theme__${theme}`, { empty, loading }]">

      <FieldContainer
        field-key="typeahead"
        reset-group-id="filters"
        :scaffold="{
          type: 'typeahead',
          inputType: 'text',
          modelKey: 'typeahead',
          placeholder: `Search ${datasetListTypeahead.length || '...'} datasets`,
          required: false,
          autocomplete: 'none',
          optionDisplayKey: 'name',
          optionReturnKey: 'slug',
          options: datasetListTypeahead,
          defaultValue: value || ''
        }"
        @input="updateValue"
        @optionSelected="goToDatasetPage"
        @typeaheadOnEnter="searchbarSearch" />

      <button
        :class="['search-button', { loading }]"
        @click="searchbarSearch">
        <Spinner />
        <IconSearch />
      </button>

    </div>
  </Searcher>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Searcher from '@/modules/search/components/searcher'
import Spinner from '@/components/spinners/material-circle'
import FieldContainer from '@/components/form/field-container'
import IconSearch from '@/components/icons/search'

// ====================================================================== Export
export default {
  name: 'Searchbar',

  components: {
    Searcher,
    Spinner,
    IconSearch,
    FieldContainer
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
    },
    showTypeahead: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    ...mapGetters({
      datasetListTypeahead: 'datasets/datasetListTypeahead'
    })
  },

  methods: {
    searchbarSearch () {
      this.$router.push({
        path: '/',
        query: this.$route.query,
        hash: '#datasets'
      })
    },
    goToDatasetPage (slug) {
      this.$router.push({
        path: `/dataset/${slug}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.no-typeahead {
  :deep(.select-container) {
    display: none !important;
  }
}
.searchbar {
  display: flex;
  padding-left: toRem(20);
  flex-grow: 1;
  :deep(.field-container) {
    width: 100%;
  }
}

.input {
  flex: 1;
  appearance: none;
  height: 100%;
  padding: 0.75rem;
  font-weight: 500;
  transition: 150ms ease-out;
  color: $fuscousGray;
  width: 100%;
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

// ////////////////////////////////////////////////////////////////////// Themes
.theme__line {
  border: 2px solid $tasman;
  border-radius: toRem(30);
  .input {
    padding: toRem(15) toRem(30) toRem(15) toRem(10);
  }
  .icon-container {
    align-items: flex-end;
  }
}

.theme__solid {
  background-color: white;
  border-radius: toRem(30) 0 0 toRem(2);
  .input {
    height: toRem(50);
    padding: toRem(15) toRem(30) toRem(15) toRem(10);
  }
}

</style>
