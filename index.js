'use strict'

const parser = require('./parser')

const parseHumanRelativeTime = str => parser.parse(str)

module.exports = parseHumanRelativeTime
