import {deepStrictEqual as eql} from 'node:assert'
import * as dateFns from 'date-fns'
import {TZDate} from '@date-fns/tz'
import {DateTime} from 'luxon'
import {
	lexHumanRelativeTime as lex,
} from './index.js'
import {
	createParseHumanRelativeTime as createParseHumanRelativeTimeWithDateFns,
} from './date-fns.js'
import {
	createParseHumanRelativeTime as createParseHumanRelativeTimeWithLuxon,
} from './luxon.js'

const parseWithDateFns = createParseHumanRelativeTimeWithDateFns(dateFns)
const parseWithLuxon = createParseHumanRelativeTimeWithLuxon(DateTime)

const resetHours = ['setHours', 0]
const resetMinutes = ['setMinutes', 0]
const resetSeconds = ['setSeconds', 0]
const resetMilliseconds = ['setMilliseconds', 0]

const timeZone = 'Europe/Berlin'
const now = '2019-03-31T01:59:00+01:00'

const tests = [
	['12am', [
		resetHours,
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T00:00:00+01:00'],
	['12:01am', [
		resetHours,
		['setMinutes', 1],
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T00:01:00+01:00'],
	['1am', [
		['setHours', 1],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T01:00:00+01:00'],
	['11:59am', [
		['setHours', 11],
		['setMinutes', 59],
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T11:59:00+02:00'],

	['noon', [
		['setHours', 12],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T12:00:00+02:00'],
	['12pm', [
		['setHours', 12],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T12:00:00+02:00'],

	['12:01pm', [
		['setHours', 12],
		['setMinutes', 1],
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T12:01:00+02:00'],
	['11:59pm', [
		['setHours', 23],
		['setMinutes', 59],
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T23:59:00+02:00'],

	['midnight', [
		['setHours', 0],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T00:00:00+01:00'],

	['tomorrow at 7', [
		['addDays', 1],
		['setHours', 7],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-04-01T07:00:00+02:00'],
	['yesterday at 7', [
		['subDays', 1],
		['setHours', 7],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-30T07:00:00+01:00'],
	['today at 8am', [
		['setHours', 8],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2019-03-31T08:00:00+02:00'],
	['now', [], now],
	['3 days ago', [
		['subDays', 3]
	], '2019-03-28T01:59:00+01:00'],
	['a week ago', [
		['subWeeks', 1]
	], '2019-03-24T01:59:00+01:00'],
	['2 weeks ago', [
		['subWeeks', 2]
	], '2019-03-17T01:59:00+01:00'],

	// todo: `aug 25 2015 5pm`
	['aug 25th 2015 5pm', [
		['setDate', 25],
		['setMonth', 7], // 7 = August
		['setYear', 2015],
		['setHours', 17],
		resetMinutes,
		resetSeconds,
		resetMilliseconds
	], '2015-08-25T17:00:00+02:00'],
	['august 25th 2015', [
		['setDate', 25],
		['setMonth', 7], // 7 = August
		['setYear', 2015]
	], '2015-08-25T01:59:00+02:00'],
	['1st of Jan 2020', [
		['setDate', 1],
		['setMonth', 0], // 0 = January
		['setYear', 2020]
	], '2020-01-01T01:59:00+01:00'],
	['30th of August', [
		['setDate', 30],
		['setMonth', 7] // 7 = August
	], '2019-08-30T01:59:00+02:00'],

	['friday', [
		['setDay', 5] // 5 = Friday
	], '2019-03-29T01:59:00+01:00'],
	['this friday', [
		['setDay', 5] // 5 = Friday
	], '2019-03-29T01:59:00+01:00'],
	// todo: should be 2019-04-05T01:59:00+02:00
	['next friday', [
		['startOfWeek'],
		['addWeeks', 1],
		['setDay', 5] // 5 = Friday
	], '2019-04-05T00:00:00+02:00'],
	// todo: should be 2019-03-22T01:59:00+02:00
	['last friday', [
		['startOfWeek'],
		['subWeeks', 1],
		['setDay', 5] // 5 = Friday
	], '2019-03-22T00:00:00+01:00'],

	['in 12 minutes', [
		['addMinutes', 12]
	], '2019-03-31T03:11:00+02:00'],
	['in 12 min', [
		['addMinutes', 12]
	], '2019-03-31T03:11:00+02:00'],
	['in 2 hours', [
		['addHours', 2]
	], '2019-03-31T04:59:00+02:00'],
	['in 31 hours', [
		['addHours', 31]
	], '2019-04-01T09:59:00+02:00'],
	['in 20 hours 40 minutes', [
		['addHours', 20],
		['addMinutes', 40]
	], '2019-03-31T23:39:00+02:00'],
	['in 20 hours and 40 minutes', [
		['addHours', 20],
		['addMinutes', 40]
	], '2019-03-31T23:39:00+02:00'],
	['in 20.2h', [
		['addHours', 20.2]
	], '2019-03-31T23:11:00+02:00'],
	// todo: should be 2019-05-05T02:59:00+02:00
	['in 5 weeks', [
		['addWeeks', 5]
	], '2019-05-05T01:59:00+02:00'],
	['in 2 years', [
		['addYears', 2]
	], '2021-03-31T01:59:00+02:00'],
	['in 2 years and 5 weeks', [
		['addYears', 2],
		['addWeeks', 5]
	], '2021-05-05T01:59:00+02:00'],
	['in 1.5 weeks', [
		['addWeeks', 1.5]
	], '2019-04-10T13:59:00+02:00']
]

for (const [relative, instructions, iso] of tests) {
	console.info(relative)

	eql(lex(relative), instructions)

	// todo: test `parse` once https://github.com/marnusw/date-fns-tz/issues/31 is fixed

	const d = DateTime.fromISO(now).setZone('Europe/Berlin')
	const d2 = parseWithLuxon(relative, d)
	const actual = d2.toISO({suppressMilliseconds: true})
	try {
		eql(actual, iso)
	} catch (err) {
		err.relative = relative
		throw err
	}
}


// 01:00 in Europe/Berlin: switch non-DST -> DST
const d = new TZDate('2019-03-31T01:59+01:00', timeZone)
const d2 = parseWithDateFns('in 2 minutes', d)
eql(d2.toISOString(), '2019-03-31T03:01:00.000+02:00')


console.info('\nTests successful. ✔︎')
