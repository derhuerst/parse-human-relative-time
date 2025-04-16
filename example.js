import * as dateFns from 'date-fns'
import {TZDate} from '@date-fns/tz'
import {DateTime} from 'luxon'
import {
	createParseHumanRelativeTime as createParseHumanRelativeTimeWithLuxon,
} from './luxon.js'
import {
	createParseHumanRelativeTime as createParseHumanRelativeTimeWithDateFns,
} from './date-fns.js'

const parseWithLuxon = createParseHumanRelativeTimeWithLuxon(DateTime)
const parseWithDateFns = createParseHumanRelativeTimeWithDateFns(dateFns)

// Europe/Berlin switched to DST at 31st of March at 2am.
const withoutDST = '2019-03-31T01:59+01:00'
const timeZone = 'Europe/Berlin'
const rel = 'in 2 minutes'

const dt = DateTime.fromISO(withoutDST).setZone(timeZone)
const withDST1 = parseWithLuxon(rel, dt)
console.log(withDST1.toFormat('HH:mm ZZZZ'))
// 03:01 GMT+2

const withDST2 = parseWithDateFns(rel, new TZDate(withoutDST, {timeZone: 'Europe/Berlin'}))
console.log(dateFns.format(withDST2, 'HH:mm zz'))
// 03:01 GMT+2
