import * as A from 'fp-ts/Array'
import * as ROR from 'fp-ts/ReadonlyRecord'
import * as _ from 'lodash'

const log = console.log
//castArray
// this is a useless function for typescript because you already know the type
log(_.castArray(1))
log(_.castArray([1,2,3]))

// you can make something into an array like this if you like though
log(A.of(1))

// clone
var objects = [{ 'a': 1 }, { 'b': 2 }];
 
var shallow = _.clone(objects);
console.log(shallow[0] === objects[0]);


