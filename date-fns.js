'use strict'

const lex = require('./lex')

const createParse = (dateFns) => {
	const parseHumanRelativeTime = (str, now = new Date()) => {
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

			res = dateFns[cmd](res, ...args)
		}
		return res
	}

	return parseHumanRelativeTime
}

module.exports = createParse
