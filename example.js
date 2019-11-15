'use strict'

const {DateTime} = require('luxon')
const dateFns = require('date-fns')
const {format} = require('date-fns-tz')
const parseWithLuxon = require('.')(DateTime)
const parseWithDateFns = require('./date-fns')(dateFns)

// Europe/Berlin switched to DST at 31st of March at 2am.
const withoutDST = '2019-03-31T01:59+01:00'
const timeZone = 'Europe/Berlin'
const rel = 'in 2 minutes'

const dt = DateTime.fromISO(withoutDST).setZone(timeZone)
const withDST1 = parseWithLuxon(rel, dt)
console.log(withDST1.toFormat('HH:mm ZZZZ'))
// 03:01 GMT+2

const withDST2 = parseWithDateFns(rel, new Date(withoutDST))
console.log(format(withDST2, 'HH:mm zz', {timeZone: 'Europe/Berlin'}))
// 03:01 GMT+2
