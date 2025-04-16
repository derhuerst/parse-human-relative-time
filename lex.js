import parser from './parser.cjs'

const lexHumanRelativeTime = str => parser.parse(str)

export {
	lexHumanRelativeTime,
}
