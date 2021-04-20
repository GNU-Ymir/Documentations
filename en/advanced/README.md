# Alias and References


The alias and reference is one of the most important characteristics
of the **Ymir** language, which allows it to give guarantees on the
mutability of the data, and the explicit movement of the memory. It is
important to understand how memory works in **Ymir**, in order to
understand the error message you might get when you try to move data
from one variable to another.

It is important to understand that **Ymir** is a high level
programming language, and that you will never have to worry about
memory management (memory leaks), the language using a garbage
collector. However, in terms of mutability and access rights, the
language provides an expressive system for managing memory movements.

## Standard and Aliasable types

In **Ymir**, there are two types, standard types and aliasable
types. A value whose type is a standard type, can be copied without
the need of explicitly inform the compiler. The standard types are all
primitive scalar types. On the other hand, aliasable types are types
that have borrowed data, which will not be copied unless it is
explicitly written into the code, to avoid performance loss.

To understand how data is represented in a program, you need to know
the difference between heap and stack. The stack is a space allocated
by the program when a function is entered, which is released when the
function is exited. On the other hand, the heap is a space that is
allocated when certain instructions in the program require it, such as
allocating a new slice, allocating  a new object instance, and so on.

When a slice is allocated, all its data is stored in the heap, and the
address of this data is stored in the stack, where the variables are
located. The following figure shows the data representation for this
program:

```ymir
def foo () {
	let x = [1, 2, 3];
}
```

<br>

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x_foo.png" alt="drawing" width="700">

## Mutability level 

We define the level of mutability as the deepest level of the type
that is mutable. An example of a mutability level is shown in the
following table:

| Type | Level |
| --- | --- |
| mut [i32] | 1 |
| [i32] | 0 |
| mut [mut i32] | 2 |
| dmut [[[i32]]] | 4 |

This is mainly used to ensure that the borrowed data is not changed by
another variable in a foreign part of the program. The users have full
control over the data they have created. The example below shows
how the mutability level is used to ensure that the content of a
table is never changed.

```ymir
import std::io

def main () 
	throws &OutOfArray
{
	let mut x = [1, 2, 3];
	x = [2, 3, 4];

	x [0] = 8;
}
```

<br>

The type of **`x`** in the above example is **`mut [i32]`**. The
mutability of the internal part of the slice (**`i32`** value) is not
specified. The compiler, for security reasons, infered it as
immutable. The line **5** of the previous example is accepted, because
the variable **`x`** is mutable, however, the value pointed by the
slice contained in **`x`** is not. For that reason the line **9** is
not accepted and the compiler returns the following error.

```error
Error : left operand of type i32 is immutable
 --> main.yr:(7,7)
 7  ┃     x [0] = 8;
    ╋       ^


ymir1: fatal error: 
compilation terminated.
```

<br>

If the mutability level defines the write permission of every data, it
is assumed that every parts of the code that have access to a give
value have read permission on it. For that reason, in the previous
example, even if writting into **`x [0]`** is not permitted, reading
its value is allowed.

### Deep mutability

Earlier we introduced the keyword **`dmut`**, this keyword is used to
avoid a very verbose type statement, and defines that every subtype
are mutable. This keyword is applicable to all types, but will only
have a different effect from the **`mut`** decorator on aliasable
types. The following table gives an example of an slice type, using
the keyword `dmut` :

| Type | Verbose equivalent |
| --- | --- |
| dmut [i32] | mut [mut i32] |
| dmut [[[i32]]] | mut [mut [mut [mut i32]]] |


If we come back to our previous example, and change the type of the
variable **`x`**, and use the keyword **`dmut`**. The variable **`x`**
now borrows mutable datas, that can be modified, thus the expression
at line **9** is accepted.

```ymir
import std::io

def main () 
	throws &OutOfArray
{
	let dmut x = [1, 2, 3];
	x = [2, 3, 4];
	
	x [0] = 8;
}
```

### Const keyword

The **`const`** keyword is the perfect opposite of the **`dmut`**
keyword. This keyword has no interest when defining types directly
(because they are immutable by default), but coupled with the keyword
**`typeof`**, it can transform a mutable type into a immutable type.

```ymir
import std::io;

def main () {
	let mut x = 12;
	println (typeof (x)::typeid);
	println ((const typeof (x))::typeid);
}
```
Results:
```
mut i32
i32
```

### String literal 

Strings literal, unlike slice literals, are in the text segment of the
program (read-only part of a program). This means that the type of a
literal string is **`[c32]`** (or **`[c8]`** if the suffix `s8` is
specified), while the type of a literal array (of `i32` for example)
is **`mut [mut i32]`**. For that reason, it impossible to borrow the
data into a deeply mutable variable.

```ymir
import std::io

def main () {
	let dmut x = "Try to make me mutable !?";
}
```

<br>

The compiler returns an error. This error means that the mutability
level of the right operand is **1**, here `mut [c32]`, (the reference
of the array is mutable but not its content), and the code try to put
the reference inside a variable of mutability level **2**, that is to
say of type `mut [mut c32]`. If this was allowed the variable `x`
would have the possibility to change data that has been marked as
immutable at some point of the program, so the compiler does not allow
it, and returns the following error.

```error
Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
 --> main.yr:(4,11)
 4  ┃ 	let dmut x = "Try to make me mutable !?";
    ╋ 	         ^
    ┃ Note : 
    ┃  --> main.yr:(4,15)
    ┃  4  ┃ 	let dmut x = "Try to make me mutable !?";
    ┃     ╋ 	             ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

## Memory borrowing

When you want to make a copy of a value whose type is aliasable, you
must tell the compiler how you want to make the copy. There are four
ways to move or reference memory, which are provided with the four
keywords `ref`, `alias`, `copy` and `dcopy`. The following chapters
presents these keywords, and the semantic associated to them.

