'use strict'

const {deepStrictEqual: eql} = require('assert')
const parse = require('.')

const resetHours = ['setHours', 0]
const resetMinutes = ['setMinutes', 0]
const resetSeconds = ['setSeconds', 0]
const resetMilliseconds = ['setMilliseconds', 0]

eql(parse('12am'), [
	['setHours', 0],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('12:01am'), [
	['setHours', 0],
	['setMinutes', 1],
	resetSeconds,
	resetMilliseconds
])
eql(parse('1am'), [
	['setHours', 1],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('11:59am'), [
	['setHours', 11],
	['setMinutes', 59],
	resetSeconds,
	resetMilliseconds
])

eql(parse('noon'), [
	['setHours', 12],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('12pm'), [
	['setHours', 12],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])

eql(parse('12:01pm'), [
	['setHours', 12],
	['setMinutes', 1],
	resetSeconds,
	resetMilliseconds
])
eql(parse('11:59pm'), [
	['setHours', 23],
	['setMinutes', 59],
	resetSeconds,
	resetMilliseconds
])

eql(parse('midnight'), [
	['setHours', 0],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])

eql(parse('tomorrow at 7'), [
	['addDays', 1],
	['setHours', 7],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('yesterday at 7'), [
	['subDays', 1],
	['setHours', 7],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('today at 8am'), [
	['setHours', 8],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('now'), [])
eql(parse('3 days ago'), [
	['subDays', 3]
])
eql(parse('a week ago'), [
	['subWeeks', 1]
])
eql(parse('2 weeks ago'), [
	['subWeeks', 2]
])

// todo: `aug 25 2015 5pm`
eql(parse('aug 25th 2015 5pm'), [
	['setDate', 25],
	['setMonth', 7], // 7 = August
	['setYear', 2015],
	['setHours', 17],
	resetMinutes,
	resetSeconds,
	resetMilliseconds
])
eql(parse('august 25th 2015'), [
	['setDate', 25],
	['setMonth', 7], // 7 = August
	['setYear', 2015]
])
eql(parse('1st of Jan 2020'), [
	['setDate', 1],
	['setMonth', 0], // 0 = January
	['setYear', 2020]
])
eql(parse('30th of August'), [
	['setDate', 30],
	['setMonth', 7] // 7 = August
])

eql(parse('sunday'), [
	['setDay', 0] // 0 = Sunday
])
eql(parse('this friday'), [
	['setDay', 5] // 5 = Friday
])
eql(parse('next friday'), [
	['startOfWeek'],
	['addWeeks', 1],
	['setDay', 5] // 5 = Friday
])
eql(parse('last friday'), [
	['startOfWeek'],
	['subWeeks', 1],
	['setDay', 5] // 5 = Friday
])

eql(parse('in 12 minutes'), [
	['addMinutes', 12]
])
eql(parse('in 2 hours'), [
	['addHours', 2]
])
eql(parse('in 31 hours'), [
	['addHours', 31]
])
eql(parse('in 20 hours 40 minutes'), [
	['addHours', 20],
	['addMinutes', 40]
])
eql(parse('in 20 hours and 40 minutes'), [
	['addHours', 20],
	['addMinutes', 40]
])
eql(parse('in 20.2h'), [
	['addHours', 20.2]
])
eql(parse('in 5 weeks'), [
	['addWeeks', 5]
])
eql(parse('in 2 years'), [
	['addYears', 2]
])
eql(parse('in 2 years and 5 weeks'), [
	['addYears', 2],
	['addWeeks', 5]
])
eql(parse('in 1.5 weeks'), [
	['addWeeks', 1.5]
])

console.info('Tests successful. ✔︎')
