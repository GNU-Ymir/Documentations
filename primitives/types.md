# Primitives types

In **Ymir** language every value has a certain data type, which tells
the behavior of the program, and how to operate with the
value. **Ymir** is statically typed language, which means that all the
type of all values must be known at compile time. Usually the compiler
is able to infer the data types of the values, and there is no need to
specify them when declaring a variable. But sometimes, when dealing
with variable mutability, or class inheritance, for example, the
inference could be wrong, and the behavior not adapted to what you
could want to do.

Therefore, the type can be added when declaring a variable, as in the
following code.

```ymir
let mut x : [mut i32] = [1, 2];
let mut y = [1, 2];
```

To understand the difference, between the type of **`x`**, and the
type of **`y`**, I invite you to read the chapter
[Alias and References]().

Each integer type has type attributs, which are accessible using the
operator `::`, on a type.

```ymir
let a = i32::init;  // i32 (0)
```

Every primitive types have common attributes that are listed in the table bellow : 

| Name | Meaning |
| --- | --- |
| `init` | The initial value of the type |
| `typeid` | The name of the type stored in a value of type **`[c32]`** |

## Scalar types

Scalar types represents all the types containing a single
value. **Ymir** has four primitive scalar types : integers, floating
point, characters, and boolean. They can have different size for
different purposes.

### Integer types

An integer is a number whithout decimal part. There are differents
integer types in **Ymir**, the signed one, and the unsigned
one. Signed and unsigned refers to the possibilty of a number to be
negative. The signed integer types begins with the letter **`i`**,
when the unsigned ones begin with the letter **`u`**. The following
table lists all the different integer types, and sort them by memory
size.

| size | signed | unsigned |
| --- | --- | --- |
| 8 bits | i8 | u8 |
| 16 bits | i16 | u16 |
| 32 bits | i32 | u32 |
| 64 bits | i64 | u64 |
| arch | isize | usize |

The type `usize` and `isize` are types that are architecture
dependent, and have the size of a pointer.

Each signed integer types, can store values from *-(2 <sup>n - 1</sup>)* to
*2 <sup>n - 1</sup> - 1*, where *n* is the size of the integer in
memory. Unsigned types, in the other hand, can store number going from
*0* to *2 <sup>n</sup> - 1*. For example, the type **`i8`**, can store values
from *-128* to *127*, and the type **`u8`** values from *0* to *255*.

You can write literal for integer in two forms, decimal `9_234` and
hexadecimal `0x897A`. The token `_`, is simply ignored in a integer
literal.

To ensure that the literal has the type you want, you will need to add
the type as a prefix of the literal. For example, to get a **`i8`** with
the value *7*, you will have to write `7i8`. By default, if no
prefix is added at the end of the literal, its type is considered to
be a **`i32`**.

As said above, each type has attributs, the following table lists the
attributs specific to integer :

| Name | Meaning |
| --- | --- |
| `max` | The maximal value |
| `min` | The minimal value |

A capacity overflow verification is made on the literals, and an error
is returned by the compiler if the type of integer you have choose is
not large enough to contain the value. For example : 

```ymir
def main () {
	let x : i8 = 934i8;
}
```
You should get the following error : 

```
Error : overflow capacity for type i8 = 934
 --> main.yr:(2,18)
    | 
 2  |     let x : i8 = 934i8;
    |                  ^

ymir1: fatal error: 
compilation terminated.
```

However, if the value cannot be known at the compile time the overflow
is not checked and can results in strange behaviour. For example, if
you try to add 1 to a variable of type **`i16`** that contains the
value `32767`, the result will be `-32768`.

### Floating-point types

The floating point types, refers to the number having a decimal
part. **Ymir** offers two floating point types, **`f32`** and **`f64`**, that
have a respective size of `32` bits and `64` bits.

You can add the prefix **`f`**, at the end of a floating point literal
to specify that you want a **`f32`**, instead of a **`f64`** as it is
by default.

```ymir
def main () {
	let x = 1.0; 
	let y : f32 = 1.0f;
}
```

The following table list the attributes specific to floating point types.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `0.0` | 
| `max` | The maximal finite value that this type can encode| 
| `min` | The minimal finite value that this type can encode| 
| `nan` | The value __Not a Number__ |
| `dig` | The number of decimal digit of precision | 
| `infinity` | The value positive infinity | 
| `epsilon` | The smallest increment to the value `1` |
| `mant_dig` | Number of bits in the  __mantissa__ |
| `max_10_exp` | 	maximum int value such that $$10^{max\_10\_exp}$$ is representable |
| `max_exp` | maximum int value such that $$2^{max\_exp-1}$$ is representable| 
| `min_10_exp` | minimum int value such that $$10^{min\_10\_exp}$$ is representable as a normalized value| 
| `min_exp` | minimum int value such that $$2^{min\_exp-1}$$ is representable as a normalized value| 

### Boolean type 

A Boolean is a very simple type that can take two values, either `true` or `false`.
For example : 

```ymir
def main () {
	let b = true;
	let f : bool = false;
}
```

### Character type 

The **`c8`** and **`c32`** are the types used to encode characters.
As for integer literal, the prefix used to specify the type of a
character literal is **`c8`**, if nothing is specified the character
type will be **`c32`**. 

**`c32`** character has a size of four bytes and can store any unicode
value.  Character literals can have to forms, and are always surronded
by the token **`'`**. The first form is the character itself **`r`**, and the
second the unicode value in integer form `\u{12}` or `\u{0xB}`.

```ymir
def main () {
	let x = '☺';	
	let y = '\u{0x263A}';
}
```

If the characted literal is to long to be stored in the dezired type,
an error will be returned by the compiler. For example :

```ymir
def main () {
	let x = '☺'c8; 
}
```

The error should be the following, and it means that you will need at
least 3 **`c8`** to store the value, and therefore it does not fit in
a single **`c8`** :

```
Error : malformed literal, number of c8 is 3
 --> main.yr:(2,10)
    | 
 2  | 	let x = '☺'c8; 
    | 	        ^

ymir1: fatal error: 
compilation terminated.
```

## Compound types 

Unlike the scalar types, compound contains multiple values.  There are
three type of compound type: tuple, range and arrays.

### Tuple 

A tuple is a collection of values of different types. Tuples have
fixed arity, once it has been set at compile time, it cannot be
changed. Each element of a tuple has a type, and its order equally
cannot be changed. Tuple are constructed inside parentheses, by a list
of values separated by commas.

```ymir
def main () {
	let t : (i32, c32, f64) = (1, 'r', 3.14); 
}
```

The tuple t, is a single element, and can be passed as function
parameter or as a return value of a function. It also can be
destructured, in order to retreive the values of its composing
elements. There is three ways to do that, the first one is by using the
dot operator **`.`**, and an integer compile time known value.

```ymir
import std::io;

def main () {
	let t = (1, 'r', 3.14);
	let z : i32 = t._0;
	let y : c32 = t. (0 + 1); 
	println (t.2);
}
```

The other method is to used the tuple destructuring syntax, that will
create new variables and therefore begins with the keyword **`let`**.

```ymir
def main () {
	let t = (1, 'r', 3.14);
	let (x, y, z) = t;
	
	let (f, e...) = t;
	println (f, " ", e.0);
}
```

In the last example, we can that the tuple destructuring syntax allows
to extract only some of the values of the tuple. The value of **`e`**
in this example will be **`('r', 3.14)`**.

The last method to extract values from tuple is with the keyword
**`expand`**, this keyword is a compile time rewrite and the following
example demonstrate how you can use it.

```ymir
import std::io

def add (a : i32, b : i32) -> i32 
	a + b


def main () {
    let x = (1, 2);
	println (add (expand x)); 
	
	// Will be rewritten into : 	
	println (add (x.0, x.1));
	
	// rewritter into : (1, x.0, x.1)
	let j : (i32, i32, i32) = (1, expand x);	
}
```

### Ranges

Range are types that contains two values defining an interval, and are
named **`r!(T)`**, where **`T`** is the type of the bounds of the interval. They
are created by the token **`..`** or ***`...`***. A range is composed
of four values, that are stored in the fields presented in the
following table.

| name | type | value | 
| --- | --- | --- |
| fst | T | the first bound |
| scd | T | the second bound |
| step | mut T | the step of the interval |
| contain | bool | Is the scd bound contained in the interval |

```ymir
def main () {
	let range : r!(i32) = 1 .. 8; 	
	let c_range : r!(i32) = 1 ... 8;
}
```

The function `step_by` take an interval as parameters and return a new
one, with a modified step.

```ymir
def main () { 
	let range = (1 .. 8).step_by (2); 
} 
```

The section [Control flow]() shows a usage of those types. 

### Arrays 

 An array is a collection of value of the same type, stored in
 contiguous memory.  Unlike Tuple, the size of an array is unknown at
 compile time, and in **Ymir** they are therefore similar to Slices.
 
 A slice is a two word object, the first word is the length of the
 slice, and the second a pointer to the data stored in the slice. A
 slice is an aliasable type, its mutability has is a bit more
 complicated than the mutability of scalar types, as it borrows memory
 that is not automatically copied when a affectation is made. This
 section will not talk about inner type mutability and aliasable
 types, so I recommand that you read the chapter
 [Alias and References]().
 
 The field **`len`** stores the length of the slice and can be
 retreived by the dot operator **`.`**.  The length of the slice is
 stored in a **`usize`**.
 
```ymir
import std::io
 
def main () {
   let x = [1, 2, 3];
   println ("The value of x : ", x); 
   println ("The length of x : ", x.len);
}
```

Equally, the field **`ptr`**, give access to the pointer, of the slice
and its types depend inner type of the slice, and is never mutable. For example : 

```ymir
import std::io
 
def main () {
   let mut x : [mut i32] = [1, 2, 3];
   *(x.ptr) = 8; 
}
```

You should get the following error : 

```
Error : left operand of type i32 is immutable
 --> main.yr:(6,4)
    | 
 6  |    *(x.ptr) = 8;
    |    ^

ymir1: fatal error: 
compilation terminated.
```

To access array elements, the operator **`[]`** is used. It will take
either a integer value, or a range value. If a range value is given, a
second slice that borrow a section of the first one is created. For
the moment, the step of the interval does not affect the borrowing of
the array.
 
```ymir
import std::io
def main () {
	let x = [1, 2, 3];
	let y = x [0..2];
	let z = x [0];
	
	println (x, " ", y, " ", z); 
}
```

The operator `~` is used to make a concatenation of two arrays of the same type : 
```ymir
import std::io

def foo () -> [i32] {
	[8, 7, 6]
}

def main ()  {
	println ([1, 2, 3] ~ foo ());
}
```
