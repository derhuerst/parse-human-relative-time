'use strict'

const {deepStrictEqual: eql} = require('assert')
const {toDate} = require('date-fns-tz')
const lex = require('./lex')
const parse = require('.')

const resetHours = ['setHours', 0]
const resetMinutes = ['setMinutes', 0]
const resetSeconds = ['setSeconds', 0]
const resetMilliseconds = ['setMilliseconds', 0]

eql(lex('12am'), [
	['setHours', 0],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('12:01am'), [
	['setHours', 0],
	['setMinutes', 1],
	resetSeconds,
	resetMilliseconds
])
eql(lex('1am'), [
	['setHours', 1],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('11:59am'), [
	['setHours', 11],
	['setMinutes', 59],
	resetSeconds,
	resetMilliseconds
])

eql(lex('noon'), [
	['setHours', 12],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('12pm'), [
	['setHours', 12],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])

eql(lex('12:01pm'), [
	['setHours', 12],
	['setMinutes', 1],
	resetSeconds,
	resetMilliseconds
])
eql(lex('11:59pm'), [
	['setHours', 23],
	['setMinutes', 59],
	resetSeconds,
	resetMilliseconds
])

eql(lex('midnight'), [
	['setHours', 0],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])

eql(lex('tomorrow at 7'), [
	['addDays', 1],
	['setHours', 7],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('yesterday at 7'), [
	['subDays', 1],
	['setHours', 7],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('today at 8am'), [
	['setHours', 8],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('now'), [])
eql(lex('3 days ago'), [
	['subDays', 3]
])
eql(lex('a week ago'), [
	['subWeeks', 1]
])
eql(lex('2 weeks ago'), [
	['subWeeks', 2]
])

// todo: `aug 25 2015 5pm`
eql(lex('aug 25th 2015 5pm'), [
	['setDate', 25],
	['setMonth', 7], // 7 = August
	['setYear', 2015],
	['setHours', 17],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(lex('august 25th 2015'), [
	['setDate', 25],
	['setMonth', 7], // 7 = August
	['setYear', 2015]
])
eql(lex('1st of Jan 2020'), [
	['setDate', 1],
	['setMonth', 0], // 0 = January
	['setYear', 2020]
])
eql(lex('30th of August'), [
	['setDate', 30],
	['setMonth', 7] // 7 = August
])

eql(lex('sunday'), [
	['setDay', 0] // 0 = Sunday
])
eql(lex('this friday'), [
	['setDay', 5] // 5 = Friday
])
eql(lex('next friday'), [
	['startOfWeek'],
	['addWeeks', 1],
	['setDay', 5] // 5 = Friday
])
eql(lex('last friday'), [
	['startOfWeek'],
	['subWeeks', 1],
	['setDay', 5] // 5 = Friday
])

eql(lex('in 12 minutes'), [
	['addMinutes', 12]
])
eql(lex('in 2 hours'), [
	['addHours', 2]
])
eql(lex('in 31 hours'), [
	['addHours', 31]
])
eql(lex('in 20 hours 40 minutes'), [
	['addHours', 20],
	['addMinutes', 40]
])
eql(lex('in 20 hours and 40 minutes'), [
	['addHours', 20],
	['addMinutes', 40]
])
eql(lex('in 20.2h'), [
	['addHours', 20.2]
])
eql(lex('in 5 weeks'), [
	['addWeeks', 5]
])
eql(lex('in 2 years'), [
	['addYears', 2]
])
eql(lex('in 2 years and 5 weeks'), [
	['addYears', 2],
	['addWeeks', 5]
])
eql(lex('in 1.5 weeks'), [
	['addWeeks', 1.5]
])


// 01:00 in Europe/Berlin: switch non-DST -> DST
//   require('luxon')
//   .DateTime
//   .fromISO('2019-03-31T01:59+01:00')
//   .setZone('Europe/Berlin')
//   .plus({minutes: 2})
//   .toISO()
//   -> 2019-03-31T03:01+02:00
const timeZone = 'Europe/Berlin'
const d = toDate('2019-03-31T01:59+01:00', {timeZone})
const d2 = parse('in 2 minutes', d)
eql(d2.toISOString(), '2019-03-31T01:01:00.000Z')


console.info('Tests successful. ✔︎')
