'use strict'

const {format} = require('date-fns-tz')
const dateFns = require('date-fns')
const {DateTime} = require('luxon')
const parseWithDateFns = require('.')(dateFns)
const parseWithLuxon = require('./luxon')(DateTime)

// Europe/Berlin switched to DST at 31st of March at 2am.
const withoutDST = '2019-03-31T01:59+01:00'
const timeZone = 'Europe/Berlin'
const rel = 'in 2 minutes'

const withDST1 = parseWithDateFns(rel, new Date(withoutDST))
console.log(format(withDST1, 'HH:mm zz', {timeZone: 'Europe/Berlin'}))
// 03:01 GMT+2

const withDST2 = parseWithLuxon(rel, DateTime.fromISO(withoutDST).setZone(timeZone))
console.log(withDST2.toFormat('HH:mm ZZZZ'))
// 03:01 GMT+2
