# Primitives types

In **Ymir** language, each value has a certain type of data, which
indicates how the program must behave and how it should operate with
the value. **Ymir** is a statically typed language, which means that
all types of all values must be known at compile time. Usually, the
compiler is able to deduce the data types from the values, and it is
not necessary to specify them when declaring a variable. But
sometimes, when it comes to the mutability of a variable or the
inheritance of a class, for example, the inference can be wrong and
the behavior not adapted to what you might want to do.

Therefore, the type may be added when declaring a variable, as in the
following code.

```ymir
let mut x : [mut i32] = [1, 2];
let mut y = [1, 2];
```

To understand the difference between the type of **`x`** and the type
of **`y`**, we invite you to read the chapter
[Aliases and References]().

Each type has type attributes, which can be accessed by using the `::`
operator on a type.

```ymir
let a = i32::init;  // i32 (0)
```

All primitive types have common attributes that are listed in the
table below:

| Name | Meaning |
| --- | --- |
| `init` | The initial value of the type |
| `typeid` |  The name of the type stored in a value of type **`[c32]`** |

## Scalar types

Scalar types represent all types containing a single value. **Ymir**
has four primitive scalar types: integers, floating point, characters,
and booleans. They can have different sizes for different purposes.

### Integer types

An integer is a number without decimal points. There are different
types of integers in **Ymir**, the signed one and the unsigned
one. Signed and unsigned refers to the possibility for a number to be
negative. Signed integer types begin with the letter **`i`**, while
unsigned integers begin with the letter **`u`**. The following table
lists all the different types of integers, and sorts them by memory
size.

| size | signed | unsigned |
| --- | --- | --- |
| 8 bits | i8 | u8 |
| 16 bits | i16 | u16 |
| 32 bits | i32 | u32 |
| 64 bits | i64 | u64 |
| arch | isize | usize |

The `usize` and `isize` types are architecture dependent, and have the
size of a pointer.

Each type of signed integer can store values ranging from *-(2
<sup>n - 1</sup>)* to *2 <sup>n - 1</sup> - 1*, where *n* is the size
of the integer in memory. Unsigned types, on the other hand, can store
numbers ranging from *0* to *2 <sup>n</sup> - 1*. For example, type
**`i8`**, can store values from *-128* to *127*, and type **`u8`** can
store values from *0* to *255*.

You can write an integer in two forms, decimal `9_234` and hexadecimal
`0x897A`. The `_` token, is simply ignored in a literal integer.

To make sure the literal has the type you want, you will need to add
the type as a prefix to the literal. For example, to get a **`i8`**
with the value *7*, you would write `7i8`. By default, if no prefix is
added at the end of the literal, its type is considered a **`i32`**.

As indicated above, each type has attributes, the following table
lists the integer-specific attributes:

| Name | Meaning |
| --- | --- |
| `max` | The maximal value |
| `min` | The minimal value |

An overflow check is performed on literals, and an error is returned
by the compiler if the type of integer you chose is not large enough
to contain the value. For example:

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

However, if the value cannot be known at compile time, the overflow is
not checked and can lead to strange behavior. For example, if you try
to add 1 to a variable of type **`i16`** that contains the value
`32767`, the result will be `-32768`.

### Floating-point types

Floating-point types, refer to the number having a decimal
part. **Ymir** provides two types of floating point numbers, **`f32`**
and **`f64`**, which have a size of 32 bits and 64 bits respectively.

You can add the prefix **`f`**, at the end of a literal floating point
to specify that you want a **`f32`**, instead of a **`f64`** as it is
by default.

```ymir
def main () {
	let x = 1.0; 
	let y : f32 = 1.0f;
}
```

The following table lists the attributes specific to floating point
types.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `nan` | 
| `max` | The maximal finite value that this type can encode| 
| `min` | The minimal finite value that this type can encode| 
| `nan` | The value __Not a Number__ |
| `dig` | The number of decimal digit of precision | 
| `inf` | The value positive infinity | 
| `epsilon` | The smallest increment to the value `1` |
| `mant_dig` | Number of bits in the  __mantissa__ |
| `max_10_exp` | 	maximum int value such that $$10^{max\_10\_exp}$$ is representable |
| `max_exp` | maximum int value such that $$2^{max\_exp-1}$$ is representable| 
| `min_10_exp` | minimum int value such that $$10^{min\_10\_exp}$$ is representable as a normalized value| 
| `min_exp` | minimum int value such that $$2^{min\_exp-1}$$ is representable as a normalized value| 

### Boolean type 

A boolean is a very simple type that can take two values, either `true` or `false`.  For example:

```ymir
def main () {
	let b = true;
	let f : bool = false;
}
```

### Character type 

The **`c8`** and **`c32`** are the types used to encode the
characters.  As with literal integers, it is necessary to add a prefix
to define the type of a literal. The prefix used to specify the type
of a literal character is **`c8`**, if nothing is specified, the
character type will be **`c32`**.

The **`c32`** character has a size of four bytes and can store any
unicode value.  Literal characters can have two forms, and are always
surrounded by the **`'`** token. The first form is the character
itself **`r`**, and the second is the unicode value in the integer
form `\u{12}` or `\u{0xB}`.

```ymir
def main () {
	let x = '☺';	
	let y = '\u{0x263A}';
}
```

If the loaded literal is too long to be stored in the character type,
an error will be returned by the compiler. For example :

```ymir
def main () {
	let x = '☺'c8; 
}
```

The error should be as follows, and this means that you will need at
least 3 **`c8`** to store the value, so it doesn't fit into one
**`c8`** :

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

Unlike scalar types, the compound contains multiple values.  There are
three types of compounds: the tuple, the range and the arrays.

### Tuple 

A tuple is a set of values of different types. Tuples have a fixed
arity, once it has been defined at compile time, it cannot be
modified. Each element of a tuple has a type, and its order cannot be
changed either. Tuples are built between parentheses, by a
comma-separated list of values.

```ymir
def main () {
	let t : (i32, c32, f64) = (1, 'r', 3.14); 
}
```

The tuple `t`, is a single element, and can be passed as a function
parameter or as a return value of a function. It can also be
destructured, in order to retrieve the values of its component
elements. There are three ways to do this, the first one is to use the
dot operator **`.`**, and an integer whose value is known at
compilation time.

```ymir
import std::io;

def main () {
	let t = (1, 'r', 3.14);
	let z : i32 = t._0;
	let y : c32 = t. (0 + 1); 
	println (t.2);
}
```

The other method is to use the tuple destructuring syntax, which will
create new variables and therefore starts with the keyword **`let`**.

```ymir
def main () {
	let t = (1, 'r', 3.14);
	let (x, y, z) = t;
	
	let (f, e...) = t;
	println (f, " ", e.0);
}
```

In the last example, we can see that the tuple destructuring syntax
allows to extract only a part of the tuple values. The value of
**`e`** in this example will be **`('r', 3.14)`**.

The last method to extract values from the tuple is with the keyword
**`expand`**, this keyword is a compile-time rewrite and the following
example shows how you can use it.

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

Ranges are types that contain two values defining a range, and are
named **`r!(T)`**, where **`T`** is the type of the range limits. They
are created by the token **`..`** or **`...`**. A range consists
of four values, which are stored in the fields shown in the following
table.

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

The `step_by` function takes a range as a parameter and returns a
new range, with a modified step.

```ymir
def main () { 
	let range = (1 .. 8).step_by (2); 
} 
```

The [Flow Control]() section shows a use of these types.. 

### Arrays 

An array is a collection of values of the same type, stored in
contiguous memory.  Unlike tuples, the size of an array is unknown at
compile time, and in **Ymir**, they are similar to slices.
 
A slice is a two-word object, the first word is the length of the
slice, and the second is a pointer to the data stored in the
slice. A slice is an aliasable type, its mutability is a bit more
complicated than the mutability of scalar types, because it borrows
memory which is not automatically copied when an assignment is
made. This section will not discuss the mutability of internal types
or aliasable types, so we recommend you read the
[Aliases and References]() chapter.
 
The field **`len`** records the length of the slice and can be
retrieved by the point operator **`.`**.  The length of the slice is
stored in a **`usize`** field.
 
```ymir
import std::io
 
def main () {
   let x = [1, 2, 3];
   println ("The value of x : ", x); 
   println ("The length of x : ", x.len);
}
```

Similarly, the **`ptr`** field, gives access to the pointer of the
slice and its types depend on the inner type of the slice, and is
never mutable. Pointer type are absolutely not important for a
**Ymir** program, and we suspect that you will never have use of
them. But they are defined just in case.

To access the elements of an array, the **`[]`** operator is used. It
will take either an integer value or a range value. If a range value
is given, a second slice that borrows a section of the first is
created. For now, the range step does not affect the borrowing of the
array.
 
```ymir
import std::io
def main () 
	throws OutOfArray 
{
	let x = [1, 2, 3];
	let y = x [0..2];
	let z = x [0];
	
	println (x, " ", y, " ", z); 
}
```

Access to a slice is not secure, and may fail at runtime. This is why
the main function in the above example throws the OutOfArray
exception. The exception system is detailed in the [Error Handling]()
chapter.

The "~" operator is used to concatenate two arrays of the same
type. We did not use the `+` operator as in many languages, because it
creates ambiguities. For example, the following line ``"string: 1 +
2"`, is unclear, maybe the user wanted to add `1` and `2` and then
make the concatenation , but the result will be `"string : 12"`.


```ymir
import std::io

def foo () -> [i32] {
	[8, 7, 6]
}

def main ()  {
	println ([1, 2, 3] ~ foo ());
}
```

You can also create a new table using the allocation syntax. This will
allow you to allocate a new array in the heap, with an initial value
for each index in the slice. The size may be unknown at compile time.

```ymir
import std::io

def main () {
	let a = [0 ; new 100u64]; 
	println (a);
}
```

### Static Arrays

Unlike the slice, static arrays are stored on the stack rather than in
the heap, and their size is known at compile time. They are
instantiated with a syntax close to the slice allocation syntax, but
omitting the `new` keywork.

```ymir
import std::io

/**
  * Takes an array of size twelve as parameter
  */
def foo (a : [i32 ; 12]) {
    println (a);
}

def main ()
    throws OutOfArray
{
    let mut a : [mut i32 ; 12] = [0 ; 12];

    for i in 0 .. 12
        a [i] = i

    let b = [1; 12];

    foo (a);
    foo (b);
}
```

You can transform a static array into a slice using the `alias`,
`copy` and `dcopy` keywords. The chapter [Aliases and references]()
explains the difference between these keywords.

```ymir
import std::io

def main () {
	let x = [0; 12];
	
	let a = alias x;
	let b = copy x;
	
	println (a, " ", b);
}
```


