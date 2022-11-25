<template>
  <div class="field field-array">
    <template v-if="field">

      <template v-if="!singular">
        <div
          v-for="group in groups"
          :key="group.group_id"
          class="row">

          <FieldContainer
            :scaffold="group.fields.name"
            :value="group.fields.name.value"
            :form-id="formId"
            :group-id="group.group_id"
            class="name" />

          <FieldContainer
            :scaffold="group.fields.email"
            :value="group.fields.email.value"
            :form-id="formId"
            :group-id="group.group_id"
            class="email" />

          <FieldContainer
            :scaffold="group.fields.slack_handle"
            :value="group.fields.slack_handle.value"
            :form-id="formId"
            :group-id="group.group_id" />

          <ButtonX
            class="trash-button"
            @clicked="removeGroup(group.group_id)">
            <IconTrash />
          </ButtonX>

        </div>
      </template>

      <ButtonB
        class="add-button"
        @clicked="addGroup">
        Add
      </ButtonB>

    </template>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import FieldContainer from '@/components/form/field-container'
import ButtonB from '@/components/buttons/button-b'
import ButtonX from '@/components/buttons/button-x'

import IconTrash from '@/components/icons/trash'

// ====================================================================== Export
export default {
  name: 'FieldArray',

  components: {
    FieldContainer,
    ButtonB,
    ButtonX,
    IconTrash
  },

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    formScaffold: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    formId: {
      type: String,
      required: true
    },
    deregisterFormFieldOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    },
    autoPopulateGroupIfEmpty: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const id = `${this.formId}|${this.scaffold.model_key}`
    return {
      id
    }
  },

  computed: {
    ...mapGetters({
      formFields: 'form/fields'
    }),
    field () {
      return this.formFields.find(obj => obj.id === this.id)
    },
    groups () {
      return this.field.value
    },
    template () {
      return this.field.template
    },
    singular () {
      return typeof this.template === 'string'
    }
  },

  mounted () {
    const scaffold = CloneDeep(this.scaffold)
    const value = this.value.map((entry) => {
      return this.createGroup(entry, scaffold.template)
    })
    this.registerFormField(Object.assign(scaffold, {
      id: this.id,
      formId: this.formId,
      value,
      originalValue: value,
      state: 'valid',
      validation: false
    }))
    if (value.length === 0 && this.autoPopulateGroupIfEmpty) {
      this.addGroup()
    }
  },

  beforeDestroy () {
    if (this.deregisterFormFieldOnDestroy) {
      this.deregisterFormField(this.id)
    }
  },

  methods: {
    ...mapActions({
      registerFormField: 'form/registerFormField',
      deregisterFormField: 'form/deregisterFormField',
      updateFormField: 'form/updateFormField'
    }),
    createGroup (entry, template) {
      const groupId = this.$uuid.v4()
      const fields = Object.keys(template).reduce((acc, key) => {
        const scaffoldKey = template[key]
        const value = (entry && entry[key]) || ''
        acc[key] = Object.assign(CloneDeep(this.formScaffold[scaffoldKey]), {
          scaffold_key: scaffoldKey,
          group_id: groupId,
          parent_id: this.id,
          value
        })
        return acc
      }, {})
      return {
        group_id: groupId,
        fields
      }
    },
    addGroup () {
      const value = CloneDeep(this.field.value)
      const group = this.createGroup(false, this.template)
      value.push(group)
      this.updateValue(value)
    },
    removeGroup (groupId) {
      const value = CloneDeep(this.field.value)
      const formFields = this.formFields.filter(obj => obj.parent_id === this.id && obj.group_id === groupId)
      const index = value.findIndex(obj => obj.group_id === groupId)
      value.splice(index, 1)
      this.updateValue(value)
      formFields.forEach((child) => {
        this.deregisterFormField(child.id)
      })
    },
    updateValue (value) {
      const field = CloneDeep(this.field)
      field.value = value
      field.state = JSON.stringify(field.value) !== JSON.stringify(field.originalValue) ? 'caution' : 'valid'
      field.validation = false
      this.updateFormField(field)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-array {
  .row {
    &:first-child {
      margin-top: 2rem;
    }
    .field-container {
      &:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }
}

.field-container {
  margin-top: 2rem;
  &.name,
  &.email {
    flex: 2;
  }
}

::v-deep .trash-button {
  padding: 1rem;
  margin-bottom: -1rem;
  &:hover {
    path {
      transition: 150ms ease-in;
      fill: darkorange;
    }
  }
  path {
    transition: 150ms ease-out;
  }
}

::v-deep .icon-trash {
  width: 1.25rem;
}

.add-button {
  margin-top: 2rem;
}
</style>
