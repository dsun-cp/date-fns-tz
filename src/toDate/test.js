import assert from 'power-assert'
import { toDate } from './index.js'

describe('toDate', function () {
  describe('date argument', function () {
    it('returns a clone of the given date', function () {
      var date = new Date(2016, 0, 1)
      var dateClone = toDate(date)
      dateClone.setFullYear(2015)
      assert.deepEqual(date, new Date(2016, 0, 1))
    })
  })

  describe('timestamp argument', function () {
    it('creates a date from the timestamp', function () {
      var timestamp = new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      var result = toDate(timestamp)
      assert.deepEqual(result, new Date(2016, 0, 1, 23, 30, 45, 123))
    })
  })

  describe('string argument', function () {
    describe('centuries', function () {
      it('parses YY', function () {
        var result = toDate('20')
        assert.deepEqual(result, new Date(2000, 0 /* Jan */, 1))
      })
    })

    describe('years', function () {
      it('parses YYYY', function () {
        var result = toDate('2014')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 1))
      })
    })

    describe('months', function () {
      it('parses YYYY-MM', function () {
        var result = toDate('2014-02')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 1))
      })
    })

    describe('weeks', function () {
      it('parses YYYY-Www', function () {
        var result = toDate('2014-W02')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 6))
      })

      it('parses YYYYWww', function () {
        var result = toDate('2014W02')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 6))
      })
    })

    describe('calendar dates', function () {
      it('parses yyyy-MM-dd', function () {
        var result = toDate('2014-02-11')
        assert.deepEqual(result, new Date(2014, 1, /* Feb */ 11))
      })

      it('parses YYYYMMDD', function () {
        var result = toDate('20140211')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11))
      })
    })

    describe('week dates', function () {
      it('parses YYYY-Www-D', function () {
        var result = toDate('2014-W02-7')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 12))
      })

      it('parses YYYYWwwD', function () {
        var result = toDate('2014W027')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 12))
      })

      it('correctly handles years in which 4 January is Sunday', function () {
        var result = toDate('2009-W01-1')
        assert.deepEqual(result, new Date(2008, 11 /* Dec */, 29))
      })
    })

    describe('ordinal dates', function () {
      it('parses YYYY-DDD', function () {
        var result = toDate('2014-026')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 26))
      })

      it('parses YYYYDDD', function () {
        var result = toDate('2014026')
        assert.deepEqual(result, new Date(2014, 0 /* Jan */, 26))
      })
    })

    describe('date and time combined', function () {
      it('parses yyyy-MM-ddThh:mm', function () {
        var result = toDate('2014-02-11T11:30')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses yyyy-MM-ddThhmm', function () {
        var result = toDate('2014-02-11T1130')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses 24:00 as midnight', function () {
        var result = toDate('2014-02-11T2400')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 0, 0))
      })
    })

    describe('extended century representation', function () {
      it('parses century 101 BC - 2 BC', function () {
        var result = toDate('-0001')
        var date = new Date(-100, 0 /* Jan */, 1)
        date.setFullYear(-100)
        assert.deepEqual(result, date)
      })

      it('parses century 1 BC - 99 AD', function () {
        var result = toDate('00')
        var date = new Date(0, 0 /* Jan */, 1)
        date.setFullYear(0)
        assert.deepEqual(result, date)
      })

      it('parses centruries after 9999 AD', function () {
        var result = toDate('+0123')
        assert.deepEqual(result, new Date(12300, 0 /* Jan */, 1))
      })

      it('allows to specify the number of additional digits', function () {
        var result = toDate('-20', { additionalDigits: 0 })
        var date = new Date(-2000, 0 /* Jan */, 1)
        date.setFullYear(-2000)
        assert.deepEqual(result, date)
      })
    })

    describe('extended year representation', function () {
      it('correctly parses years from 1 AD to 99 AD', function () {
        var result = toDate('0095-07-02')
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(95)
        assert.deepEqual(result, date)
      })

      it('parses years after 9999 AD', function () {
        var result = toDate('+012345-07-02')
        assert.deepEqual(result, new Date(12345, 6 /* Jul */, 2))
      })

      it('allows to specify the number of additional digits', function () {
        var result = toDate('+12340702', { additionalDigits: 0 })
        assert.deepEqual(result, new Date(1234, 6 /* Jul */, 2))
      })

      it('parses year 1 BC', function () {
        var result = toDate('0000-07-02')
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(0)
        assert.deepEqual(result, date)
      })

      it('parses years less than 1 BC', function () {
        var result = toDate('-000001-07-02')
        var date = new Date(0, 6 /* Jul */, 2)
        date.setFullYear(-1)
        assert.deepEqual(result, date)
      })
    })

    describe('float time', function () {
      it('parses float hours', function () {
        var result = toDate('2014-02-11T11.5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })

      it('parses float minutes', function () {
        var result = toDate('2014-02-11T11:30.5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30, 30))
      })

      it('parses float seconds', function () {
        var result = toDate('2014-02-11T11:30:30.768')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30, 30, 768))
      })

      it('parses , as decimal mark', function () {
        var result = toDate('2014-02-11T11,5')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 11, 30))
      })
    })

    describe('timezones', function () {
      context('when the date and the time are specified', function () {
        it('parses Z', function () {
          var result = toDate('2014-10-25T06:46:20Z')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hh:mm', function () {
          var result = toDate('2014-10-25T13:46:20+07:00')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hhmm', function () {
          var result = toDate('2014-10-25T03:46:20-0300')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })

        it('parses ±hh', function () {
          var result = toDate('2014-10-25T13:46:20+07')
          assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
        })
      })
      context('when the year and the month are specified', function () {
        it('sets timezone correctly on yyyy-MMZ format', function () {
          var result = toDate('2012-01Z')
          assert.deepEqual(result, new Date('2012-01-01T00:00:00+00:00'))
        })
      })

      it('accepts a timeZone option as offset', function () {
        var result = toDate('2014-10-25T13:46:20', { timeZone: '+0500' })
        assert.deepEqual(result, new Date('2014-10-25T13:46:20+05:00'))
      })
      it('accepts a timeZone option as IANA zone', function () {
        var result = toDate('2014-10-25T13:46:20', { timeZone: 'Asia/Bangkok' })
        assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
      })
      it('accepts a timeZone option as UTC zone', function () {
        var result = toDate('2014-10-25T13:46:20', { timeZone: 'UTC' })
        assert.deepEqual(result, new Date('2014-10-25T13:46:20Z'))
      })
      it('accepts IANA zone in the date string', function () {
        var result = toDate('2014-10-25T13:46:20 Asia/Bangkok')
        assert.deepEqual(result, new Date('2014-10-25T13:46:20+07:00'))
      })
      it('accepts IANA zone with a T in the date string', function () {
        var result = toDate('2014-10-25T13:46:20 America/Tijuana')
        assert.deepEqual(result, new Date('2014-10-25T13:46:20-07:00'))
      })
      it('accepts UTC zone in the date string', function () {
        var result = toDate('2014-10-25T13:46:20 UTC')
        assert.deepEqual(result, new Date('2014-10-25T13:46:20Z'))
      })
      it('produces correct offsets around a DST transition', function () {
        ;[
          ['America/Vancouver', '2020-11-01T00:59:59', new Date('2020-11-01T00:59:59-07:00')],
          // When DST ends the same hour occurs twice, and whether that is
          // the equivalent of when DST is on or off is indeterminate.
          [
            'America/Vancouver',
            '2020-11-01T01:00:00',
            new Date('2020-11-01T01:00:00-07:00'),
            new Date('2020-11-01T01:00:00-08:00'),
          ],
          ['America/Vancouver', '2020-11-01T02:00:00', new Date('2020-11-01T02:00:00-08:00')],
          ['America/Vancouver', '2020-11-01T03:00:00', new Date('2020-11-01T03:00:00-08:00')],
          ['America/Vancouver', '2020-11-01T23:00:00', new Date('2020-11-01T23:00:00-08:00')],
          ['America/Vancouver', '2021-03-14T01:00:00', new Date('2021-03-14T01:00:00-08:00')],
          ['America/Vancouver', '2021-03-14T02:00:00', new Date('2021-03-14T02:00:00-07:00')],
          ['America/Vancouver', '2021-03-14T03:00:00', new Date('2021-03-14T03:00:00-07:00')],
          ['Australia/Sydney', '2019-04-06T23:45:00', new Date('2019-04-06T12:45:00.000Z')],
          ['Australia/Sydney', '2020-04-05T01:00:00', new Date('2020-04-05T01:00:00+11:00')],
          ['Australia/Sydney', '2020-04-05T02:00:00', new Date('2020-04-05T02:00:00+10:00')],
          ['Australia/Sydney', '2020-04-05T03:00:00', new Date('2020-04-05T03:00:00+10:00')],
          ['Australia/Sydney', '2020-10-04T01:00:00', new Date('2020-10-04T01:00:00+10:00')],
          ['Australia/Sydney', '2020-10-04T02:00:00', new Date('2020-10-04T02:00:00+11:00')],
          ['Australia/Sydney', '2020-10-04T03:00:00', new Date('2020-10-04T03:00:00+11:00')],
          ['America/New_York', '2020-03-08T01:00:00', new Date('2020-03-08T01:00:00-05:00')],
          ['America/New_York', '2020-03-08T02:00:00', new Date('2020-03-08T02:00:00-04:00')],
          ['America/New_York', '2020-03-08T03:00:00', new Date('2020-03-08T03:00:00-04:00')],
          ['America/New_York', '2020-11-01T00:59:59', new Date('2020-11-01T00:59:59-04:00')],
          // When DST ends the same hour occurs twice, and whether that is
          // the equivalent of when DST is on or off is indeterminate.
          [
            'America/New_York',
            '2020-11-01T01:00:00',
            new Date('2020-11-01T01:00:00-04:00'),
            new Date('2020-11-01T01:00:00-05:00'),
          ],
          ['America/New_York', '2020-11-01T02:00:00', new Date('2020-11-01T02:00:00-05:00')],
          ['America/New_York', '2020-11-01T03:00:00', new Date('2020-11-01T03:00:00-05:00')],
          ['Canada/Mountain', '2021-03-14T02:30:00', new Date('2021-03-14T02:30:00-06:00')],
        ].forEach(([timeZone, dateStr, expectedDate, alternativeDate]) => {
          var result = toDate(dateStr, { timeZone })
          if (alternativeDate) {
            assert(
              result.getTime() === expectedDate.getTime() ||
                result.getTime() === alternativeDate.getTime()
            )
          } else {
            assert.deepEqual(result, expectedDate)
          }
        })
      })
    })

    describe('failure', function () {
      it('returns `Invalid Date` if the string is not an ISO formatted date', function () {
        var result = toDate(new Date(2014, 8 /* Sep */, 1, 11).toString())
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })
  })

  describe('validation', function () {
    describe('months', function () {
      it('returns `Invalid Date` for invalid month', function () {
        var result = toDate('2014-00')
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })

    describe('weeks', function () {
      it('returns `Invalid Date` for invalid week', function () {
        var result = toDate('2014-W00')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('returns `Invalid Date` for 54th week', function () {
        var result = toDate('2014-W54')
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })

    describe('calendar dates', function () {
      it('returns `Invalid Date` for invalid day of the month', function () {
        var result = toDate('2012-02-30')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('returns `Invalid Date` for 29th of February of non-leap year', function () {
        var result = toDate('2014-02-29')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('parses 29th of February of leap year', function () {
        var result = toDate('2012-02-29')
        assert.deepEqual(result, new Date(2012, 1, /* Feb */ 29))
      })
    })

    describe('week dates', function () {
      it('returns `Invalid Date` for invalid day of the week', function () {
        var result = toDate('2014-W02-0')
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })

    describe('ordinal dates', function () {
      it('returns `Invalid Date` for invalid day of the year', function () {
        var result = toDate('2012-000')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('returns `Invalid Date` for 366th day of non-leap year', function () {
        var result = toDate('2014-366')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('parses 366th day of leap year', function () {
        var result = toDate('2012-366')
        assert.deepEqual(result, new Date(2012, 11, /* Dec */ 31))
      })
    })

    describe('time', function () {
      it('parses 24:00 as midnight', function () {
        var result = toDate('2014-02-11T24:00')
        assert.deepEqual(result, new Date(2014, 1 /* Feb */, 11, 0, 0))
      })

      it('returns `Invalid Date` for invalid hours', function () {
        var result = toDate('2014-02-11T25')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('returns `Invalid Date` for invalid minutes', function () {
        var result = toDate('2014-02-11T21:60')
        assert(result instanceof Date)
        assert(isNaN(result))
      })

      it('returns `Invalid Date` for invalid seconds', function () {
        var result = toDate('2014-02-11T21:59:60')
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })

    describe('timezones', function () {
      it('returns `Invalid Date` for invalid timezone minutes', function () {
        var result = toDate('2014-02-11T21:35:45+04:60')
        assert(result instanceof Date)
        assert(isNaN(result))
      })
    })
  })

  describe('invalid argument', function () {
    it('returns Invalid Date if an invalid time zone is provided', function () {
      var result = toDate('2020-01-01T12:00:00.000', { timeZone: 'bad/timeZone' })
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is non-date string', function () {
      var result = toDate('abc')
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is NaN', function () {
      var result = toDate(NaN)
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is Invalid Date', function () {
      var result = toDate(new Date(NaN))
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is null', function () {
      // $ExpectedMistake
      var result = toDate(null)
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is undefined', function () {
      // $ExpectedMistake
      var result = toDate(undefined)
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is false', function () {
      // $ExpectedMistake
      var result = toDate(false)
      assert(result instanceof Date)
      assert(isNaN(result))
    })

    it('returns Invalid Date if argument is true', function () {
      // $ExpectedMistake
      var result = toDate(true)
      assert(result instanceof Date)
      assert(isNaN(result))
    })
  })

  describe('argument conversion', function () {
    it('implicitly converts instance of Number into a number', function () {
      // eslint-disable-next-line no-new-wrappers
      var timestamp = new Number(new Date(2016, 0, 1, 23, 30, 45, 123).getTime())
      // $ExpectedMistake
      var result = toDate(timestamp)
      assert.deepEqual(result, new Date(2016, 0, 1, 23, 30, 45, 123))
    })

    it('implicitly converts instance of String into a string', function () {
      // eslint-disable-next-line no-new-wrappers
      var dateString = new String('2014-02-11')
      // $ExpectedMistake
      var result = toDate(dateString)
      assert.deepEqual(result, new Date(2014, 1, /* Feb */ 11))
    })

    it('implicitly converts options', function () {
      // $ExpectedMistake
      var result = toDate('+12340702', { additionalDigits: '0' })
      assert.deepEqual(result, new Date(1234, 6 /* Jul */, 2))
    })

    it('throws `RangeError` if `options.additionalDigits` is not convertable to 0, 1, 2 or undefined`', function () {
      // $ExpectedMistake
      var block = toDate.bind(null, '+12340702', { additionalDigits: 3 })
      assert.throws(block, RangeError)
    })
  })

  it('throws TypeError exception if passed less than 1 argument', function () {
    assert.throws(toDate.bind(null), TypeError)
  })
})
