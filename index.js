'use strict'

const lex = require('./lex')

const cmds = new Map([
	['addMilliseconds', (dt, ms) => dt.plus({milliseconds: ms})],
	['addSeconds', (dt, s) => dt.plus({seconds: s})],
	['addMinutes', (dt, m) => dt.plus({minutes: m})],
	['addHours', (dt, h) => dt.plus({hours: h})],
	['addDays', (dt, d) => dt.plus({days: d})],
	['addWeeks', (dt, w) => dt.plus({weeks: w})],
	['addMonths', (dt, m) => dt.plus({months: m})],
	['addYears', (dt, y) => dt.plus({years: y})],

	['subMilliseconds', (dt, ms) => dt.minus({milliseconds: ms})],
	['subSeconds', (dt, s) => dt.minus({seconds: s})],
	['subMinutes', (dt, m) => dt.minus({minutes: m})],
	['subHours', (dt, h) => dt.minus({hours: h})],
	['subDays', (dt, d) => dt.minus({days: d})],
	['subWeeks', (dt, w) => dt.minus({weeks: w})],
	['subMonths', (dt, m) => dt.minus({months: m})],
	['subYears', (dt, y) => dt.minus({years: y})],

	['setMilliseconds', (dt, ms) => dt.set({millisecond: ms})],
	['setSeconds', (dt, s) => dt.set({second: s})],
	['setMinutes', (dt, m) => dt.set({minute: m})],
	['setHours', (dt, h) => dt.set({hour: h})],
	['setDay', (dt, d) => dt.set({weekday: d})],
	['setDate', (dt, d) => dt.set({day: d})],
	['setMonth', (dt, m) => dt.set({month: m + 1})],
	['setYear', (dt, y) => dt.set({year: y})],

	['startOfWeek', dt => dt.startOf('week')],
	['startOfMonth', dt => dt.startOf('month')],
	['endOfWeek', dt => dt.endOf('week')]
])

const createParse = DateTime => {
	const parseHumanRelativeTime = (str, now = DateTime.local()) => {
		const instructions = lex(str)
		let res = now
		for (const [cmd, ...args] of instructions) {
			if (!cmds.has(cmd)) {
				const err = new Error(cmd + ' is not supported')
				err.cmd = cmd
				err.arguments = args
				err.instructions = instructions
				throw err
			}

			res = cmds.get(cmd)(res, ...args)
		}
		return res
	}

	return parseHumanRelativeTime
}

module.exports = createParse
