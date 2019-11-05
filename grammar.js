(() => {
	const b = str => `\\b${str}\\b`
	const any = strs => `(${strs.join('|')})`

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
	].flatMap((m, i) => [
		[m, i],
		[m.slice(0, 3), i]
	])

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
	].flatMap((m, i) => [
		[m, i],
		[m.slice(0, 3), i]
	])

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
		}
	}
})()
