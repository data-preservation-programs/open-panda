<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Alert',

  props: {
    alertId: {
      type: String,
      required: true
    }
  },

  data () {
    const localId = this.$uuid.v4()
    return {
      localId
    }
  },

  computed: {
    id () {
      return `${this.alertId}|${this.localId}`
    },
    alert () {
      return this.$alert(this.alertId)
    },
    isOpen () {
      return this.$alert(this.alertId).isOpen()
    }
  },

  mounted () {
    this.registerAlert({
      id: this.id,
      alertId: this.alertId
    })
  },

  beforeDestroy () {
    this.deregisterAlert(this.id)
  },

  methods: {
    ...mapActions({
      registerAlert: 'alert/registerAlert',
      deregisterAlert: 'alert/deregisterAlert'
    }),
    triggerAlertAction () {
      const alert = this.alert.fetch()
      const action = alert.action
      const storeAction = alert.storeAction
      const data = alert.data
      if (action === 'store' && storeAction) {
        this.$store.dispatch(storeAction, data)
      }
    }
  },

  render () {
    return this.$scopedSlots.default({
      isOpen: this.isOpen,
      triggerAlertAction: this.triggerAlertAction,
      closeAlert: this.alert.close
    })
  }
}
</script>
