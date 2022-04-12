(() => {
	const b = str => `\\b${str}\\b`
	const any = strs => `(${strs.join('|')})`
	const json = val => JSON.stringify(val)
	const idx = arr => arr.reduce((idx, [k, v]) => ({...idx, [k]: v}), {})

	const toOrdinal = (i) => {
		// https://github.com/dcousens/ordinal.js/blob/84d42351e2f6ea458f26ce00d761104d25dc5968/indicator.js
		i = Math.abs(i)
		const cent = i % 100
		if (cent >= 10 && cent <= 20) return i + 'th'
		const dec = i % 10
		if (dec === 1) return i + 'st'
		if (dec === 2) return i + 'nd'
		if (dec === 3) return i + 'rd'
		return i + 'th'
	}

	const ordinals = new Array(31)
	.fill(0)
	.map((_, i) => i + 1)
	.map(x => [toOrdinal(x), x])

	const daysOfWeek = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	].reduce((acc, m, i) => [
		...acc,
		[m, i],
		[m.slice(0, 3), i]
	], [])

	const months = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
	].reduce((acc, m, i) => [
		...acc,
		[m, i],
		[m.slice(0, 3), i]
	], [])

	return {
		lex: {
			macros: {},

			rules: [
				// basics
				[`[\\s,]+`,			`/* ignore whitespace */`],
				[b('and'),			`return 'AND'`],
				[b('of'),			`return 'OF'`],
				[b('at'),			`return 'AT'`],
				[`:`,				`return 'COLON'`],

				// numbers
				[
					b(any(ordinals.map(([p]) => p))),
					`return 'ORDINAL'`
				],
				[`\\d{1,20}\\.\\d{1,20}`, `return 'FLOAT'`],
				[`\\d{4}`,			`return 'INT_4'`],
				[`\\d{1,2}`,		`return 'INT_1_2'`],
				[`\\d+`,			`return 'INT'`],

				// units
				[b('seconds?'),		`return 'SECOND'`],
				[b('minutes?'),		`return 'MINUTE'`],
				[b('hours?'),		`return 'HOUR'`],
				[b('days?'),		`return 'DAY'`],
				[b('weeks?'),		`return 'WEEK'`],
				[b('months?'),		`return 'MONTH'`],
				[b('years?'),		`return 'YEAR'`],
				[b('sec'),			`return 'SECOND'`],
				[b('min'),			`return 'MINUTE'`],
				[b('s'),			`return 'SECOND'`],
				[b('m'),			`return 'MINUTE'`],
				[b('h'),			`return 'HOUR'`],
				[b('d'),			`return 'DAY'`],
				[b('w'),			`return 'WEEK'`],
				[b('m'),			`return 'MONTH'`],
				[b('y'),			`return 'YEAR'`],

				// time
				[b('a\\.?m\\.?'),	`return 'AM'`],
				[b('p\\.?m\\.?'),	`return 'PM'`],
				[b('noon'),			`return 'NOON'`],
				[b('midnight'),		`return 'MIDNIGHT'`],
				[b('tomorrow'),		`return 'TOMORROW'`],
				[b('yesterday'),	`return 'YESTERDAY'`],
				[b('today'),		`return 'TODAY'`],

				// relative time
				[b('a'),			`return 'A'`],
				[b('now'),			`return 'NOW'`],
				[b('next'),			`return 'NEXT'`],
				[b('last'),			`return 'LAST'`],
				[b('this'),			`return 'THIS'`],
				[b('in'),			`return 'IN'`],
				[b('ago'),			`return 'AGO'`],

				// days of the week
				[
					b(any(daysOfWeek.map(([p]) => p))),
					`return 'DAY_OF_WEEK'`
				],

				// months
				[
					b(any(months.map(([p]) => p))),
					`return 'MONTH'`
				]
			],

			options: {
				'case-insensitive': true
			}
		},

		bnf: {
			E: [[
				'NOW',
				`$$ = []`
			], [
				'abs_time',
				`$$ = $1`
			], [
				'abs_date',
				`$$ = $1`
			], [
				'abs_date abs_time',
				`$$ = [...$1, ...$2]`
			], [
				'abs_date AT abs_time',
				`$$ = [...$1, ...$3]`
			], [
				'rel_date',
				`$$ = $1`
			], [
				'rel_date abs_time',
				`$$ = [...$1, ...$2]`
			], [
				'rel_date AT abs_time',
				`$$ = [...$1, ...$3]`
			], [
				'rel_time',
				`$$ = $1`
			], [
			// 	'rel_time abs_time',
			// 	`$$ = [...$1, ...$2]`
			// ], [
				'rel_time AT abs_time',
				`$$ = [...$1, ...$3]`
			]],

			float: [
				['FLOAT', `$$ = parseFloat($1)`]
			],
			int_4: [
				['INT_4', `$$ = parseInt($1)`]
			],
			int_1_2: [
				['INT_1_2', `$$ = parseInt($1)`]
			],
			int: [
				['INT', `$$ = parseInt($1)`]
			],

			am_pm: [
				['AM', `$$ = 0`],
				['PM', `$$ = 12`]
			],
			abs_time: [[
				'MIDNIGHT',
				`$$ = [['setHours', 0], ['setMinutes', 0], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'NOON',
				`$$ = [['setHours', 12], ['setMinutes', 0], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'int_1_2',
				`$$ = [['setHours', $1], ['setMinutes', 0], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'int_1_2 am_pm',
				`$$ = [['setHours', ($1 === 12 ? 0 : $1) + $2], ['setMinutes', 0], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'int_1_2 COLON int_1_2',
				`$$ = [['setHours', $1], ['setMinutes', $3], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'int_1_2 COLON int_1_2 am_pm',
				`$$ = [['setHours', ($1 === 12 ? 0 : $1) + $4], ['setMinutes', $3], ['setSeconds', 0], ['setMilliseconds', 0]]`
			], [
				'int_1_2 COLON int_1_2 COLON int_1_2',
				`$$ = [['setHours', $1], ['setMinutes', $3], ['setSeconds', $5], ['setMilliseconds', 0]]`
			], [
				'int_1_2 COLON int_1_2 COLON int_1_2 am_pm',
				`$$ = [['setHours', ($1 === 12 ? 0 : $1) + $6], ['setMinutes', $3], ['setSeconds', $5], ['setMilliseconds', 0]]`
			]],

			float_int_a: [
				['float', `$$ = $1`],
				['int', `$$ = $1`],
				['int_1_2', `$$ = $1`],
				['int_4', `$$ = $1`],
				['A', `$$ = 1`]
			],
			duration: [
				['float_int_a SECOND', `$$ = [['seconds', $1]]`],
				['float_int_a MINUTE', `$$ = [['minutes', $1]]`],
				['float_int_a HOUR', `$$ = [['hours', $1]]`],
				['float_int_a DAY', `$$ = [['days', $1]]`],
				['float_int_a WEEK', `$$ = [['weeks', $1]]`],
				['float_int_a MONTH', `$$ = [['months', $1]]`],
				['float_int_a YEAR', `$$ = [['years', $1]]`],
				['duration AND duration', `$$ = [...$1, ...$3]`],
				['duration duration', `$$ = [...$1, ...$2]`]
			],
			rel_time: [
				['IN duration', `$$ = $2.map(([u, x]) => ['add' + u[0].toUpperCase() + u.slice(1), x])`],
				['duration AGO', `$$ = $1.map(([u, x]) => ['sub' + u[0].toUpperCase() + u.slice(1), x])`]
			],

			day_of_week: [
				['DAY_OF_WEEK', `$$ = ${json(idx(daysOfWeek))}[$1.toLowerCase()]`]
			],
			month: [
				['MONTH', `$$ = ${json(idx(months))}[$1.toLowerCase()]`]
			],
			rel_date: [[
				'TODAY',
				`$$ = []`
			], [
				'TOMORROW',
				`$$ = [['addDays', 1]]`
			], [
				'YESTERDAY',
				`$$ = [['subDays', 1]]`
			], [
				'month',
				`$$ = [['setMonth', $1]]`
			], [
				'day_of_week',
				`$$ = [['setDay', $1]]`
			], [
				'THIS month',
				`$$ = [['setMonth', $2]]`
			], [
				'THIS day_of_week',
				`$$ = [['setDay', $2]]`
			], [
				'NEXT month',
				`$$ = [['startOfMonth'], ['addMonths', 1], ['setMonth', $2]]`
			], [
				'NEXT day_of_week',
				`$$ = [['startOfWeek'], ['addWeeks', 1], ['setDay', $2]]`
			], [
				'LAST month',
				`$$ = [['startOfMonth'], ['subDays', 1], ['startOfMonth']]`
			], [
				'LAST day_of_week',
				`$$ = [['startOfWeek'], ['subWeeks', 1], ['setDay', $2]]`
			]],

			ordinal: [
				['ORDINAL', `$$ = ${json(idx(ordinals))}[$1]`]
			],
			abs_day_month: [[
				'ordinal OF month',
				`$$ = [['setDate', $1], ['setMonth', $3]]`
			], [
				'ordinal month',
				`$$ = [['setDate', $1], ['setMonth', $2]]`
			], [
				'month ordinal',
				`$$ = [['setDate', $2], ['setMonth', $1]]`
			]],

			year: [
				['int_4', '$$ = $1']
			],
			abs_date: [[
				'abs_day_month',
				`$$ = $1`
			],[
				'abs_day_month year',
				`$$ = [...$1, ['setYear', $2]]`
			]]
		}
	}
})()
