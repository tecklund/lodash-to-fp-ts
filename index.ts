import * as A from 'fp-ts/Array'
import * as A1 from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'
import * as Eq from 'fp-ts/Eq'
import * as Ord from 'fp-ts/Ord'
import * as R from 'fp-ts/Record'
import * as _ from 'lodash'
import * as Map from 'fp-ts/Map'
import {getFirstSemigroup} from 'fp-ts/Semigroup'
import {pipe} from 'fp-ts/function'
import { lowerFirst } from 'lodash'

const log = console.log

//chunks
log(_.chunk([1,2,3], 2))
log(A.chunksOf(2)([1,2,3]))

//compact
log(_.compact([0, 1, false, 2, '', 3]))
log(A.filter(x => x ? true : false)([0, 1, false, 2, '', 3]))

log(A.compact([O.some(1), O.zero<number>()]))


//concat
log(_.concat([1,2,3], [4,5,6]))
log(A.getMonoid<number>().concat([1,2,3], [4,5,6]))

//difference
log(_.difference([2, 1], [2, 3]))
log(A.difference(Eq.eqNumber)([2, 1], [2, 3]))


//differenceBy
const eqFloor: Eq.Eq<number> = {
    equals: (x, y) => Math.floor(x) === Math.floor(y)
}

const eqProp: Eq.Eq<{x:number}> = {
    equals: (x, y) => x.x === y.x
}

log(_.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor))
log(A.difference(eqFloor)([2.1, 1.2], [2.3, 3.4]))

//differenceby
log(_.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x'))
log(A.difference(eqProp)([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }]))

//differenceWith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 
log(_.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual))

const eq = Eq.getStructEq<{x:number, y:number}>({
  x: Eq.eqNumber,
  y: Eq.eqNumber
})
log(A.difference(eq)(objects, [{ 'x': 1, 'y': 2 }]))

//drop
log(_.drop([1, 2, 3], 2))
log(A.dropLeft(2)([1, 2, 3]))

//drop right
log(_.dropRight([1, 2, 3], 2))
log(A.dropRight(2)([1,2,3]))

//drop right while
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
log(_.dropRightWhile(users, function(o) { return !o.active; }))
log(pipe(users, A1.dropRightWhile((o) => !o.active)))

//drop while
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
log(_.dropWhile(users, function(o) { return !o.active; }))
log(pipe(users, A.dropLeftWhile((o) => !o.active)))

// fill
log(_.fill(Array(3), 2))
log(A.replicate(3,2))

//findindex
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
log(_.findIndex(users, function(o) { return o.user == 'barney'; }))
log(pipe(users, A.findIndex(o => o.user == 'barney'))) //returns an option

//findlastindex
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
log(_.findLastIndex(users, function(o) { return o.user == 'pebbles'; }))
log(pipe(users, A.findLastIndex(o => o.user == 'pebbles')))

//flatten
log(_.flatten([1, [2, [3, [4]], 5]]))
log(A.flatten([[1], [2, [3, [4]], 5]])) //actually typesafe

//flattendeep
//some recursive shit i guess

//flattendepth
//same as above

//from pairs
log(_.fromPairs([['a', 1], ['b', 2]]))
log(R.fromFoldable(getFirstSemigroup<number>(), A.Foldable)([['a', 1], ['b', 2]]))
