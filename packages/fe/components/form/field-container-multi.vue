<template>
  <FieldArray
    :scaffold="formScaffold.additional_identifiers"
    :form-id="formId"
    :field-key="fieldKey">
    <template #array="{ field, addGroup, removeGroup }">

      <div
        v-for="(group, index) in field.value"
        :key="group.groupId"
        class="row">

        <FieldContainer
          v-for="(template, templateIndex) in field.scaffold.template"
          :key="`${group.groupId}|${templateIndex}`"
          :scaffold="formScaffold[template.fieldKey]"
          :form-id="formId"
          :group-index="index"
          :field-key="template.key"
          :deregister-on-destroy="true"
          class="group-field" />

        <ButtonX
          class="trash-button"
          @clicked="removeGroup(index, formId)">
          <IconTrash />
        </ButtonX>

      </div>

      <ButtonB
        class="add-button"
        @clicked="addGroup">
        Add
      </ButtonB>

    </template>
  </FieldArray>
</template>

<script>
// ===================================================================== Imports
import FieldArray from '@/modules/form/components/field-array'
import FieldContainer from '@/components/form/field-container'
import ButtonB from '@/components/buttons/button-b'
import ButtonX from '@/components/buttons/button-x'

import IconTrash from '@/components/icons/trash'

// ====================================================================== Export
export default {
  name: 'FieldContainerMulti',

  components: {
    FieldArray,
    FieldContainer,
    ButtonB,
    ButtonX,
    IconTrash
  },

  props: {
    formScaffold: {
      type: Object,
      required: true
    },
    formId: {
      type: String,
      required: true
    },
    fieldKey: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.row {
  &:first-child {
    margin-top: 2rem;
  }
  .group-field.field-container {
    &:not(:last-child) {
      margin-right: 2rem;
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

:deep(.trash-button) {
  padding: 1rem;
  margin-bottom: -1rem;
  &:hover {
    path {
      transition: 150ms ease-in;
      fill: $malibu;
    }
  }
  path {
    transition: 150ms ease-out;
  }
}

:deep(.icon-trash) {
  width: 1.25rem;
}

.add-button {
  margin-top: 2rem;
}
</style>
