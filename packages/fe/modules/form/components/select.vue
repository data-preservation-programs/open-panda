<template>
  <div :class="['select-container', { focused, 'dropdown-open': dropdownOpen }]">

    <!-- =================================================== [Select] Native -->
    <select
      ref="selectNative"
      :aria-labelledby="ariaLabelledby"
      class="select native"
      @focus="focused = true"
      @blur="focused = false"
      @change="selectOption($event.target.value)">
      <option disabled="disabled" :selected="selectedOption === -1" value="-1">
        <slot name="option-native-default-text" />
      </option>
      <option
        v-for="(option, index) in options"
        :key="`native-${index}`"
        :value="index"
        :selected="isCurrentlySelected(index)">
        <slot name="option-native-text" :option="option" />
      </option>
    </select>

    <!-- =================================================== [Select] Custom -->
    <div
      v-click-outside="clickOutside"
      :aria-hidden="dropdownOpen ? 'false' : 'true'"
      class="select custom"
      @click="toggleDropdown">

      <div class="selection-window-wrapper">
        <slot
          name="selection-window"
          :selected="selectedOption" />
      </div>

      <div class="dropdown">
        <div
          v-for="(option, index) in options"
          :key="`custom-${index}`"
          class="option-wrapper"
          @mouseenter="toggleOptionHighlighted('enter', index)"
          @mouseleave="toggleOptionHighlighted('leave', index)"
          @click="selectOption(index)">
          <slot
            name="option-custom"
            :option="option"
            :index="index"
            :highlighted="isCurrentlyHighlighted(index)"
            :selected="isCurrentlySelected(index)" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Select',

  props: {
    options: {
      type: Array,
      required: true
    },
    ariaLabelledby: {
      type: String,
      required: true
    },
    selectedOption: {
      type: [Number, String],
      required: false,
      default: -1
    },
    /**
     * Define whether or not to handle v-click-outside in this component. Example:
     * the typeahead field handles this instead.
     */
    handleClickOutside: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    const selectedOption = this.selectedOption
    return {
      keydown: false,
      focused: false,
      dropdownOpen: false,
      currentOptionHighlighted: selectedOption,
      internalSelectedOption: selectedOption
    }
  },

  watch: {
    dropdownOpen (state) {
      this.$emit('dropdownToggled', state)
    },
    currentOptionHighlighted (index) {
      this.$emit('optionHighlighted', index)
    }
  },

  mounted () {
    this.keydown = this.handleKeyboardNavigation
    window.addEventListener('keydown', this.keydown)
  },

  beforeDestroy () {
    if (this.keydown) { window.removeEventListener('keydown', this.keydown) }
  },

  methods: {
    toggleDropdown () {
      this.dropdownOpen = !this.dropdownOpen
    },
    openDropdown () {
      this.dropdownOpen = true
    },
    closeDropdown () {
      this.dropdownOpen = false
      if (this.selectedOption === -1) {
        this.currentOptionHighlighted = -1
      }
    },
    clickOutside () {
      if (this.handleClickOutside) {
        this.closeDropdown()
      }
    },
    toggleOptionHighlighted (action, index) {
      this.currentOptionHighlighted = action === 'leave' ? -1 : index
    },
    isCurrentlyHighlighted (index) {
      return this.currentOptionHighlighted === index
    },
    isCurrentlySelected (index) {
      return this.selectedOption === index
    },
    selectOption (index) {
      const value = parseInt(index)
      this.internalSelectedOption = value
      this.$refs.selectNative.value = value
      this.$emit('optionSelected', value)
    },
    handleKeyboardNavigation (e) {
      if (this.dropdownOpen) {
        let selection = this.currentOptionHighlighted
        const len = this.options.length
        const keyCode = e.keyCode
        const code = e.keyCode
        const key = e.key
        const down = keyCode === 40 || code === 40 || key === 'ArrowDown'
        const up = keyCode === 38 || code === 38 || key === 'ArrowUp'
        const submit = keyCode === 13 || code === 13 || key === 'Enter'
        if (down || up || submit) {
          e.preventDefault()
        }
        if (down && selection < len - 1) {
          selection++
        } else if (up && selection > 0) {
          selection--
        }
        if (this.currentOptionHighlighted !== selection) {
          this.currentOptionHighlighted = selection
        }
        if (submit) {
          this.selectOption(selection)
          this.toggleDropdown()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.select-container {
  width: 100%;
  height: 100%;
  &.dropdown-open {
    .dropdown {
      display: block;
    }
  }
}

.select {
  width: 100%;
  height: 100%;
  &.native {
    appearance: none;
    background-color: transparent;
    border: 0;
    &:focus-visible {
      outline: none;
    }
  }
  &.custom {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 5;
  }
}

@media (hover: hover) {
  .select {
    &.native {
      opacity: 0;
      &:focus {
        opacity: 1;
        + .custom {
          display: none;
        }
      }
    }
    &.custom {
      display: block
    }
  }
}

.selection-window-wrapper {
  width: 100%;
  height: 100%;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 10rem;
  overflow-y: scroll;
  background-color: black;
}
</style>
