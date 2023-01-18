import moment from 'moment'

import 'moment-timezone'

moment.tz.setDefault('UTC')

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}
