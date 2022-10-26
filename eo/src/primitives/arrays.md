# Primitives types

## Compound type

Unlike the scalar types, compound contains multiple values. 
There are two type of compound type:
- Tuple
- Array and Slice

### Array

 An array is a collection of value of the same type, stored in
 contiguous memory.  Unlike Tuple, the size of an array is unknown at
 compile time, and are therefore similar to Slices.
 
 A slice is a two word object, the first word is the length of the
 slice, and the second a pointer to the data stored in the slice.  The
 operator `..` and `...` can be used on a slice to create another
 slice that borrow section of memory.
 
 The length of the slice is stored in a `usize`.
 
```ymir
import std::io
 
def main () {
	let x = [1, 2, 3];
	let y = x [0..2];
	
	println (x, " ", y); 
}
```
 
 Will print : 
```
 [1, 2, 3] [1, 2]
```
 
 Arrays store a reference to data, that is not automatically duplicated
 when an affectation is made.  For this reason, Arrays are aliasable
 types, Cf. [Alias and Reference](alias_and_ref.md).
 
```ymir
import std::io
 
def main () {
	let mut x : [mut i32] = [1, 2, 3];
	let dmut y = alias x [0..2];
	// Try to remove ^ the alias, to see the compilation error
	// Or replace it with a copy, or a dcopy
	
	y [0] = 9;
	println (x, " ", y); 
}
``` 
 
 Will print : 
```
 [9, 2, 3] [9, 2]
```
 
### Array concatenation 
