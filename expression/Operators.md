# Operators

The precedence of the operator is similar to other C-like language.

```ymir
let a = 1 + 3 * 4;
assert (a == 13);
```

## Type promotion

The operations on primitives types are allowed in **Ymir** language
only if they don't create lost of precision. This is called type
promotions : A type *x* can be transform to type *y*, if and only
if the size of *x* is smaller than the size of *y*, and *x* and
*y* are of the same nature. That is to say, *x* and *y* are both
unsigned, or both signed, or they are both floating point types.

```ymir
let a = 12; // i32
let b = 12B; // i8
b = a; // Illegal
a = b; // Ok

let c = 34UB; // u8
b = c; // Illegal
a = c; // Illegal
```

