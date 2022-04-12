'use strict'

const lex = require('./lex')

const createParse = dateFns => {
	const parseHumanRelativeTime = (
		str,
		now = new Date(),
		opts = {weekStartsOn: 0}
	) => {
		const instructions = lex(str)
		let res = now
		for (const [cmd, ...args] of instructions) {
			if ('function' !== typeof dateFns[cmd]) {
				const err = new Error(`date-fns.${cmd} is not a function`)
				err.cmd = cmd
				err.arguments = args
				err.instructions = instructions
				throw err
			}

			res = dateFns[cmd](res, ...args, opts)
		}
		return res
	}

	return parseHumanRelativeTime
}

module.exports = createParse
