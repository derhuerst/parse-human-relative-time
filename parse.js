import parser from './parser.cjs'

const parseHumanRelativeTime = str => parser.parse(str)

export {
	parseHumanRelativeTime,
}
