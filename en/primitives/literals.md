## Literals and Operators 

The primitives types presented in the last section can be expressed using literals.

Integers literals can be expressed using hexadecimal `0x1B` or decimal notations `98`.

Undescores can be inserted in integers literals, they will be simply ignored : `12_345_123`

The type of literal is specified at the end of the literal, using the type as suffix : `1u32`, `0x43u64`.

The operator precedence is the same in Ymir as in other C-like Languages : 

```ymir
def main () {
	let i = 89i8; // x is of type i8
	let j = 7; // i32
	let k = 'r'; // c32
	let l = 'z'c8; // c8
	
	let m = true;
	let n = 0.0f; // f32
	let m = 1.; // f64	
}
```
