import * as D from 'fp-ts/Date'
import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import { time } from 'fp-ts-contrib/time'
import * as _ from 'lodash'

const log = console.log

//Date
log(_.now())
// => date in milliseconds
log(D.now())
// => date in milliseconds

// time something
_.defer(function(stamp) {
    log(_.now() - stamp);
  }, _.now())
// => elapsed time

// time something, and give back the value and how long it took
time(T.task)(T.delay(100)(T.of(0)))().then(log)
// => [0, 102]

