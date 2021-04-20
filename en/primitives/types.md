# Primitives types

In **Ymir** language, each value has a certain type of data, which
indicates how the program must behave and how it should operate with
the value. **Ymir** is a statically typed language, which means that
all types of all values must be known at compile time. Usually, the
compiler is able to infer the data types from the values, and it is
not necessary to specify them when declaring a variable. But
sometimes, when it comes to the mutability of a variable or the
inheritance of a class for example, the inference can be wrong and
the behavior not adapted to what you might want to do.

Therefore, the type may be added when declaring a variable, as in the
following code.

```ymir
let mut x : [mut i32] = [1, 2];
let mut y = [1, 2];
```

<br>

To understand the difference between the type of **`x`** and the type
of **`y`**, we invite you to read the chapter
[Aliases and References](https://gnu-ymir.github.io/Documentations/en/advanced/).

Each type has type attributes. Theses attributes are accessed using
the double colon operator **`::`** on a type expression.

```ymir
let a = i32::init;  // i32 (0)
```

<br>

All primitive types have common attributes that are listed in the
table below. Attributes can be surrounded by `_`, to avoid some
ambiguity for some types (*cf.*
[Enumeration](https://gnu-ymir.github.io/Documentations/en/types/enum.html)). For
example, the attribute `typeid` is equivalent to `__typeid__`, or
`_typeid`.

| Name | Meaning |
| --- | --- |
| `init` | The initial value of the struct, where each field are set to init if they don't have default value |
| `typeid` |  The name of the type stored in a value of type **`[c32]`** |
| `typeinfo` | A structure of type TypeInfo, containing information about the type |

All the information about TypeInfo are presented in chapter [Dynamic
types](https://gnu-ymir.github.io/Documentations/en/types_advanced/).

The keyword **`typeof`** retreive the type of a value at compilation
time. This type can be used in any context, to retreive type
information. For example, in a variable declaration. 

```ymir
import std::io;

def bar () -> i32 {
	42 
}

def foo () -> typeof (bar ()) {
	bar ()
}

def main () {
	let x : typeof (foo ()) = foo ();
	
	println (typeof (x)::typeid, " (", x, ")");
}
```

Results: 
```
i32 (42)
```

## Scalar types

Scalar types represent all types containing a single value. **Ymir**
has five primitive scalar types: integers, floating point, characters,
booleans, and pointers. They can have different sizes for different
purposes.

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
size of a pointer, depending on the architecture targeted.

Each type of signed integer can store values ranging from *-(2
<sup>n - 1</sup>)* to *2 <sup>n - 1</sup> - 1*, where *n* is the size
of the integer in memory. Unsigned types, on the other hand, can store
numbers ranging from *0* to *2 <sup>n</sup> - 1*. For example, type
**`i8`**, can store values from *-128* to *127*, and type **`u8`** can
store values from *0* to *255*.

You can write an integer in two forms, decimal `9_234` and hexadecimal
`0x897A`. The `_` token, is simply ignored in a literal integer.

To make sure a literal value has the right type, a prefix can be added
at the end of it. For example, to get a **`i8`** with the value *7*,
the right literal is written `7i8`. By default, if no prefix is added
at the end of the literal, the language defines its type as a
**`i32`**.

As indicated above, each type has attributes, the following table
lists the integer-specific attributes:

| Name | Meaning |
| --- | --- |
| `max` | The maximal value |
| `min` | The minimal value |

An overflow check is performed on literals at compilation time, and an
error is returned by the compiler if the type of integer choosed to
encode the literal is not large enough to contain the value. For
example:

```ymir
def main () {
	let x : i8 = 934i8;
}
```

Because a i8 can only store value ranging from `-127` to `128`, the
value `934` would not fit. For that reason the compiler returns the
following error.

```error
Error : overflow capacity for type i8 = 943
 --> main.yr:(12,18)
    ┃ 
12  ┃     let x : i8 = 943i8;
    ┃                  ^^^

ymir1: fatal error: 
compilation terminated.
```

<br>

**WARNING** However, if the value cannot be known at compile time, the
overflow is not checked and can lead to strange behavior. For example,
if you try to add 1 to a variable of type **`i16`** that contains the
value `32767`, the result will be `-32768`. *Contribution:* Provide a
dynamic way to verify the overflow of arithmetic operation (at least
in debug mode).

### Floating-point types

Floating-point types, refer to numbers with a decimal
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

<br>

The following table lists the attributes specific to boolean type.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `false` | 

### Character type 

The **`c8`** and **`c32`** are the types used to encode the
characters.  As with literal integers, it is necessary to add a prefix
to define the type of a literal. The prefix used to specify the type
of a literal character is **`c8`**, if nothing is specified, the
character type will be **`c32`**.

The **`c32`** character has a size of four bytes and can store any
unicode value.  Literal characters can have two forms, and are always
surrounded by the token **`'`**. The first form is the character
itself, and the second is the unicode value in the integer
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

The error will be the following. This error means that you will need
at least 3 **`c8`** to store the value, so it doesn't fit into one
**`c8`** :

```error
Error : malformed literal, number of c8 is 3
 --> main.yr:(2,10)
    | 
 2  | 	let x = '☺'c8; 
    | 	        ^

ymir1: fatal error: 
compilation terminated.
```

<br>

The following table lists the attributes specific to character types.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `\u{0}` | 

### Pointers

Pointer are values that stores an address of memory. They can be used
to store the location of a data in memory. In **`Ymir`**, pointers are
considered low level programming and are mainly used in the std, and
runtime to interface with machine level semantics. You can perfectly
write any program without needing pointers, and for that reason we
recomand to not use them.

Pointers are defined using the `&` keyword on types, or on
values. They are aliasable types, as they borrow memory (cf [Aliasable
and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)).

```ymir
import std::io;

def main ()
    throws &SegFault, &AssertError
{
    let mut i = 12;
    let p : &i32 = &i; // creation of a pointer on i
    i = 42;
    assert (*p == 42); // dereference the pointer and access the value
}
```

<br>

Pointers are unsafe, and dereferencing a pointer can result in undefined
behavior depending on where it points. It can also sometimes raise a
segmentation fault. In **`Ymir`**, segmentation fault are recovered,
and an exception is thrown. Error handling is presented in chaper
[Error
Handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html).

**WARNING**, Note that the segmentation fault may not occur even if
  the pointer is not properly set. The easiest way to avoid undefined
  behavior is to not use pointers and use `std` verified functions, or
  other semantically verified elements (cf [Aliasable and
  References](https://gnu-ymir.github.io/Documentations/en/advanced/)).

<br>

The following table lists the attributes specific to pointer types.

| Name | Meaning | 
| --- | --- |
| `inner` | The type of the inner value - for example : `i32` for `&i32` | 


## Compound types 

Unlike scalar types, the compound contains multiple values.  There are
three types of compounds: the tuple, the range and the arrays.

### Tuple 

A tuple is a set of values of different types. Tuples have a fixed
arity. The arity of a tuple is defined at compilation time, and
represent the number of values contained inside the tuple. Each
element of a tuple has a type, and a given order. Tuples are built
between parentheses, by a comma-separated list of values. A tuple of
one value can be defined, by putting a coma after the first
value. This way the compiler can understand the desire of creating a
tuple, and do not confuse it with a normal expression between
parentheses.

```ymir
def main () {
	let t : (i32, c32, f64) = (1, 'r', 3.14);  // three value tuple
	let t2 : (i32,) = (1,); // single value tuple
	let t3 : i32 = (1); // single value of type i32
}
```

<br>

The tuple `t`, is a single element, and can be used as a function
parameter or as a return value of a function. It can also be
destructured, to retrieve the values of its component elements. There
are three ways of tuple destructuring.

1) the dot operator **`.`**, followed by an integer value, whose value
is known at compilation time. This value can be computed by a complex
expression, as long as the compiler is able to retreive the value at
compilation time (*cf.* [Compilation time
execution](https://gnu-ymir.github.io/Documentations/en/templates/cte.html)).

```ymir
import std::io;

def main () {
	let t = (1, 'r', 3.14);
	let z : i32 = t._0;
	let y : c32 = t. (0 + 1); 
	println (t.2);
}
```

<br>

2) the tuple destructuring syntax. This syntax, close to variable
declaration, creates new variables that contains parts of the tuple
that is destructured. In the following example, one can note that the
tuple destructuring syntax allows to extract only some of the tuple
values. The type of the variable **`e`** is the tuple **`(c32,
f64)`**, and its values are **`('r', 3.14)`**, when the variable
**`f`** contains the value **`1`** of type **`i32`**.

```ymir
def main () {
	let t = (1, 'r', 3.14);
	let (x, y, z) = t;
	
	let (f, e...) = t;
	println (f, " ", e.0);
}
```

<br>

3) the keyword **`expand`**. this keyword is a compile-time rewrite,
that expands the values of a tuple into a list of values. This list is
then used to create other tuples, call functions, etc. The following
example shows the use of the keyword **`expand`** to call a function
taking two parameters, with the value of a tuple containing two
values. 

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

<br>

There is two other ways to destructurate a tuple. These ways are
presented in forthcoming chapters. The following table lists the
attributes specific to tuple types.

| Name | Meaning | 
| --- | --- |
| `arity` | The number of elements contained in the tuple (in a **`u32`**) |
| `init` | a tuple, where each element values are set to `init`  | 

### Ranges

Ranges are types that contain two values defining a range. A range is
named **`r!T`**, where **`T`** is the type of the range limits. They
are created by the token **`..`** and **`...`**. A range consists of
four values, which are stored in the fields shown in the following
table. These fields can be accessed using the dot operator **`.`**. 

| name | type | value | 
| --- | --- | --- |
| fst | T | the first bound |
| scd | T | the second bound |
| step | mut T | the step of the interval |
| contain | bool | Is the scd bound contained in the interval ? |

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

The [Control
flows](https://gnu-ymir.github.io/Documentations/en/primitives/control.html)
section shows a use of these types.

### Arrays 

An array is a collection of values of the same type, stored in
contiguous memory.  Unlike tuples, the size of an array is unknown at
compile time, and in **Ymir**, they are similar to slices, and will be
refered as such. Slices are defined with a syntax close to the one of
tuple, but with brackets instead of parentheses, for example **`[1, 2, 3]`**. 
The type of a slice is also defined using the brackets, for example **`[i32]`**, meaning a slice containing **`i32`** values.

String literals, enclosed between double quotes are a special case of
slice literals. There is no string type in Ymir, but only slices
type. Because of this, string values are typed **`[c32]`** or
**`[c8]`** depending on the type of values contained in the
slice. String literals can be prefixed with the keyword **`s8`** or
**`s32`** to define the encoding system used. By default, when no
prefix is specified a string literal have a type **`[c32]`**. 

```ymir
import std::io;

def main () { 
	let x = [1, 2, 3]; // a [i32] slice
	let y = "Hello World !!"; // a [c32] slice
	let z = "Hello World !!"s8; // a [c8] slice
}
```
<br>

**Warning**: The length of a [c8] literals can seem incorrect
due to the encoding system. For example, the slice `"☺"s8` will have a
length of **`3`**. To summarize, **`[c8]`** slices are utf-8 encoded
string literals, when **`[c32]`** are encoded in utf-32.
 
A slice is a two-word object, the first word is the length of the
slice, and the second is a pointer to the data stored in the slice. A
slice is an aliasable type, its mutability is a bit more complicated
than the mutability of scalar types, because it borrows memory which
is not automatically copied when an assignment is made. This section
will not discuss the mutability of internal types or aliasable
types. This is discussed in the chapter [Aliases and
References](https://gnu-ymir.github.io/Documentations/en/advanced/).
 
The field **`len`** records the length of the slice and can be
retrieved with the dot operator **`.`**.  The length of the slice is
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
them. They are defined to allow low level programming paradigms, and
are used in the std and runtime. 

To access the elements of an array, the **`[]`** operator is used. It
takes either an integer value or a range value as parameter. If a
range value is given, a second slice that borrows a section of the
first is created. For now, the step of the range does not affect the
borrowing of the array. A contribution can be made here. On the other
hand if an integer value **`i`** is given as parameter, the value at
the index **`i`** is returned.
 
```ymir
import std::io;

def main () 
	throws &OutOfArray 
{
	let x = [1, 2, 3];
	let y = x [0 .. 2];
	let z = x [0];
	
	println (x, " ", y, " ", z); 
}
```

<br>

The length of a slice is unknown at compilation time, and access can
be made with dynamic integers whose values are also unknown at
compilation time. For that reason, it may happen that the parameters
used go beyond the slice length. With this in mind, slice access is
considered unsafe, and can throw an exception of type
**`&OutOfArray`**. The exception system, and error handling is
detailed in the chapter [Error
Handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html).

Slices can be concatenated, to form another slice. The concatenation
is made using the operator tilde on two operands. To work properly and
be accepted by the language, the two slice used as operands must share
the same type (but not necessarily mutability level, the mutability of
the operand with the lowest mutability level is choosed for the result
of the operation *cf.* [Aliases and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)).

```ymir
import std::io

def foo () -> [i32] {
	[8, 7, 6]
}

def main ()  {
	println ([1, 2, 3] ~ foo ());
}
```

The tilde token was chosen to avoid some ambiguity. In some languages
such as Java, the concatenation is made using the token **`+`** that
sometimes creates some ambiguity when concatenating strings, and other
elements such as integers. For example, the expression `"foo" + 1 + 2`, is ambiguous. 
One can note however, that since concatenation only works on slices of
the same type, the following expression `"foo" ~ 2`, is invalid as
"foo" is of type **`[c32]`**, and **`2`** of type **`i32`**.

Another syntax can be used to create slices. This syntax called *slice
allocation*, allocates a slice on the heap and set the same value to
every element of the slice.

```ymir
import std::io
import std::random;

def main () {
	let a : [i32] = [0 ; new 100u64]; // this avoids the write of 100 zeros
	                                  // but the result is the same
							  
	let b = [12 ; new uniform (10, 100)]; 
	//                ^^^^^^^ generates a random value between 10 and 100
	println (a, " ", b);
}
```

<br>

The following table lists the attributes specific to slice types.

| Name | Meaning | 
| --- | --- |
| `inner` | the inner type |
| `init` | an empty slice (with `len == 0us`) |

### Static Arrays

Unlike the slice, static arrays are stored in the stack rather than on
the heap. To be possible, their size must be known at compilation
time. The syntax used to create a static array is close to the syntax
of a *slice allocation*, but the keyword **`new`** omitted.

```ymir
import std::io

/**
  * Takes an array of size twelve as parameter
  */
def foo (a : [i32 ; 12]) {
    println (a);
}

def main ()
    throws &OutOfArray
{
    let mut a : [mut i32 ; 12] = [0 ; 12];

    for i in 0 .. 12
        a [i] = i

    let b = [1; 12];

    foo (a);
    foo (b);
}
```

A static array can be transformed into a slice using the `alias`,
`copy` and `dcopy` keywords. The chapter [Aliases and
references](https://gnu-ymir.github.io/Documentations/en/advanced/)
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

One can argue that slice literals should be of static array type. We
made the choice to create slices from array literals rather than
static arrays to avoid verbosity, as we claim that slices are way more
commonly used than arrays with a static size. We are for the moment
considering the possibility to prefix slice literals, to define static
array literals, but the question is not yet decided.

<br>

The following table lists the attributes specific to array types.

| Name | Meaning | 
| --- | --- |
| `inner` | the inner type |
| `len` | the len of the array (`usize` value) |
| `init` | an array where each element is set to the `init` value of the inner type | 

### Option

The option typed values are values that may be set or not. They are
defined using the token **`?`** on types or values. Further
information on option type are given in the chapter [Error
handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html),
as they are completely related to error management system. 

```ymir
import std::io;

def main () {
    let i : i32? = (12)?; // an option type containing the value 12
    let j : i32? = (i32?)::err; // an option value containing no value
}
```

The value of an option type can be retreived using functions in the
std, or pattern matching. In this chapter, we only focus on the
**`unwrap`** function, pattern matching being left for a future
chapter (*cf.* [Pattern
matchin](https://gnu-ymir.github.io/Documentations/en/pattern)).  The
function **`unwrap`** from the module **`std::conv`**, get the value
contained inside an option type. If no value is contained inside the
option, the function throws an error of type **`CastFailure`**.

```ymir
import std::io;
import std::conv;

def foo (b : bool)-> (i32)? {
	if b { 
		19? // return the value 19, wrapped into an option
	} else {
		(i32?)::__err__ // return an empty value
	}
}


def main () 
	throws &CastFailure 
{
	let x = foo (true);
	println (x.unwrap () + 23);
}
```

<br>

The following table lists the attributes specific to option types.

| Name | Meaning | 
| --- | --- |
| `err` | An empty option value | 
