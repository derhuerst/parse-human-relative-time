'use strict'

const parser = require('./parser')

const lexHumanRelativeTime = str => parser.parse(str)

module.exports = lexHumanRelativeTime
