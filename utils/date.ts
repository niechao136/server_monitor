import moment from 'moment'
moment.suppressDeprecationWarnings = true

export const formatDate = (date: string | Date = new Date(), format = 'YYYY/MM/DD') => {
  return moment(date).format(format)
}
