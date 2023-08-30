# parse-human-relative-time

Yet another package to **parse human relative time strings like "next Tuesday 3pm" and apply them to a date+time**.

[![npm version](https://img.shields.io/npm/v/parse-human-relative-time.svg)](https://www.npmjs.com/package/parse-human-relative-time)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/parse-human-relative-time.svg)
![minimum Node.js version](https://img.shields.io/node/v/parse-human-relative-time.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install parse-human-relative-time
```


## Usage

When using `luxon`, note that [it currently always follows ISO weekdays (`0` = Monday) instead of the locale](https://github.com/moment/luxon/issues/373).

### [Luxon](https://moment.github.io/luxon/#/) integration

```js
const {DateTime} = require('luxon')
const parseHumanRelativeTime = require('parse-human-relative-time')(DateTime)

// Europe/Berlin switched to DST at 31st of March at 2am.
const tz = 'Europe/Berlin'
const dt = DateTime.fromISO('2019-03-31T01:59+01:00').setZone(tz)

parseHumanRelativeTime('in 2 minutes', dt)
.toISO({suppressSeconds: true, suppressMilliseconds: true})
// 2019-03-31T03:01+02:00
```

### [`date-fns`](https://date-fns.org) integration

```js
const dateFns = require('date-fns')
const parseHumanRelative = require('parse-human-relative-time/date-fns')(dateFns)
const {format} = require('date-fns-tz')

// Europe/Berlin switched to DST at 31st of March at 2am.
const withoutDST = new Date('2019-03-31T01:59+01:00')
const timeZone = 'Europe/Berlin'

const withDST = parseHumanRelative('in 2 minutes', withoutDST)
format(withDST, 'HH:mm zz', {timeZone})
// 03:01 GMT+2
````

### Lexing into instructions

```js
const lexHumanRelativeTime = require('parse-human-relative-time/lex')

lexHumanRelativeTime('next tuesday 5pm')
```

```js
[
	// next tuesday
	['startOfWeek'],
	['addWeeks', 1],
	['setDay', 2],

	// 12:01 am
	['setHours', 17],
	['setMinutes', 0],
	['setSeconds', 0],
	['setMilliseconds', 0]
]
```


## Why yet another package?

**Other packages don't handle time zones correctly**, because they

- mess up timezones (e.g. [`parse-messy-time`](https://github.com/substack/parse-messy-time)),
- parse to relative milliseconds, in some [DST](https://en.wikipedia.org/wiki/Daylight_saving_time) cases (e.g. [`parse-relative-time`](https://github.com/fczbkk/parse-relative-time) & [`timestring`](https://github.com/mike182uk/timestring)),
- require or even monkey-patch a specific date/time library (e.g. [`relative-time-parser`](https://github.com/cmaurer/relative.time.parser)).

Some actually do it right, but don't support a lot of expressions, e.g. [`relative-time-expression`](https://github.com/Frezc/relative-time-expression).

This package **parses** a human relative time string (e.g. `next Tuesday 2pm`) **into a set of manipulation *instructions* and applies them to a `Date`** using [Luxon](https://moment.github.io/luxon/) or [`date-fns`](https://date-fns.org). It therefore separates parsing and manipulation, letting the date/time lib handle the complex topic of time zones.


## Contributing

If you have a question or need support using `parse-human-relative-time`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/parse-human-relative-time/issues).
