/* eslint-disable no-self-compare */
/* eslint-disable eqeqeq */
/* eslint-disable no-func-assign */

/*  value_equals.js

    The MIT License (MIT)

    Copyright (c) 2013-2020, Reactive Sets

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

/* --------------------------------------------------------------------------
      @function value_equals( a, b, enforce_properties_order, cyclic )

      @short Returns true if a and b are deeply equal, false otherwise.

      @parameters
      - **a** (Any type): value to compare to ```b```
      - **b** (Any type): value compared to ```a```
      - **enforce_properties_order** (Boolean): true to check if Object
        properties are provided in the same order between ```a``` and
        ```b```
      - **cyclic** (Boolean): true to check for cycles in cyclic objects

      @description
      Implementation:
      ```a``` is considered equal to ```b``` if all scalar values in
      a and b are strictly equal as compared with operator '===' except
      for these two special cases:
      - ```0 === -0``` but are not considered equal by value_equals().
      - ```NaN``` is not equal to itself but is considered equal by
      value_equals().

      ```RegExp``` objects must have the same ```lastIndex``` to be
      considered equal. i.e. both regular expressions have matched
      the same number of times.

      Functions must be identical, so that they have the same closure
      context.

      ```undefined``` is a valid value, including in Objects

      This function is checked by 106 CI tests.

      Provide options for slower, less-common use cases:

      - Unless enforce_properties_order is true, if ```a``` and ```b```
        are non-Array Objects, the order of occurence of their attributes
        is considered irrelevant: ```{ a: 1, b: 2 }``` is considered equal
        to ```{ b: 2, a: 1 }```.

      - Unless cyclic is true, Cyclic objects will throw a
        ```RangeError``` exception: ```"Maximum call stack size exceeded"```
  */
export function deepCompare(a, b, enforce_properties_order, cyclic) {
  return (
    (a === b && // strick equality should be enough unless zero
      a !== 0) || // because 0 === -0, requires test by _equals()
    _equals(a, b) // handles not strictly equal or zero values
  );

  function _equals(a, b) {
    // a and b have already failed test for strict equality or are zero

    var s, l, p, x, y;

    // They should have the same toString() signature
    if ((s = toString.call(a)) !== toString.call(b)) return false;

    switch (s) {
      default: // Boolean, Date, String
        return a.valueOf() === b.valueOf();

      case "[object Number]":
        // Converts Number instances into primitive values
        // This is required also for NaN test bellow
        a = +a;
        b = +b;

        return a // a is Non-zero and Non-NaN
          ? a === b
          : // a is 0, -0 or NaN
          a === a // a is 0 or -O
          ? 1 / a === 1 / b // 1/0 !== 1/-0 because Infinity !== -Infinity
          : b !== b; // NaN, the only Number not equal to itself!
      // [object Number]

      case "[object RegExp]":
        return (
          a.source == b.source &&
          a.global == b.global &&
          a.ignoreCase == b.ignoreCase &&
          a.multiline == b.multiline &&
          a.lastIndex == b.lastIndex
        );
      // [object RegExp]

      case "[object Function]":
        return false; // functions should be strictly equal because of closure context
      // [object Function]

      case "[object Array]":
        if (cyclic && (x = reference_equals(a, b)) !== null) return x; // intentionally duplicated bellow for [object Object]

        if ((l = a.length) != b.length) return false;
        // Both have as many elements

        while (l--) {
          if (((x = a[l]) === (y = b[l]) && x !== 0) || _equals(x, y)) continue;

          return false;
        }

        return true;
      // [object Array]

      case "[object Object]":
        if (cyclic && (x = reference_equals(a, b)) !== null) return x; // intentionally duplicated from above for [object Array]

        l = 0; // counter of own properties

        if (enforce_properties_order) {
          var properties = [];

          for (p in a) {
            if (a.hasOwnProperty(p)) {
              properties.push(p);

              if (((x = a[p]) === (y = b[p]) && x !== 0) || _equals(x, y))
                continue;

              return false;
            }
          }

          // Check if 'b' has as the same properties as 'a' in the same order
          for (p in b)
            if (b.hasOwnProperty(p) && properties[l++] != p) return false;
        } else {
          for (p in a) {
            if (a.hasOwnProperty(p)) {
              ++l;

              if (((x = a[p]) === (y = b[p]) && x !== 0) || _equals(x, y))
                continue;

              return false;
            }
          }

          // Check if 'b' has as not more own properties than 'a'
          for (p in b) if (b.hasOwnProperty(p) && --l < 0) return false;
        }

        return true;
      // [object Object]
    } // switch toString.call( a )
  }
} // _equals()

/* -----------------------------------------------------------------------------------------
       reference_equals( a, b )

       Helper function to compare object references on cyclic objects or arrays.

       Returns:
         - null if a or b is not part of a cycle, adding them to object_references array
         - true: same cycle found for a and b
         - false: different cycle found for a and b

       On the first call of a specific invocation of equal(), replaces self with inner function
       holding object_references array object in closure context.

       This allows to create a context only if and when an invocation of equal() compares
       objects or arrays.
    */
function reference_equals(a, b) {
  var object_references = [];

  return (reference_equals = _reference_equals)(a, b);

  function _reference_equals(a, b) {
    var l = object_references.length;

    while (l--)
      if (object_references[l--] === b) return object_references[l] === a;

    object_references.push(a, b);

    return null;
  } // _reference_equals()
} // reference_equals()
