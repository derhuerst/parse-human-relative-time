'use strict'

const {format} = require('date-fns-tz')
const parseHumanRelative = require('.')

// Europe/Berlin switched to DST at 31st of March at 2am.
const withoutDST = new Date('2019-03-31T01:59+01:00')

const withDST = parseHumanRelative('in 2 minutes', withoutDST)

console.log(format(withDST, 'HH:mm zz', {timeZone: 'Europe/Berlin'}))
// 03:01 GMT+2
