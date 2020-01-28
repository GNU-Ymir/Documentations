# Alias and References

Alias and reference is one of the most important feature of the
language **Ymir**, that enable it to make guarantees on the data
mutability, and explicit memory movement. It is important to
understand how memory works in **Ymir**, in order to understand the
error message, you could get when trying to move data from one
variable to another.

## Standard and Aliasable types

In **Ymir**, there are two kinds of types, standard types and
aliasable types. The standard type, can be copied without explicitly
informing the compiler. These types, are all primitive types, except
the slices. On the other hand, aliasable types, are types that have
borrowed data, which will not be copied, if not explicitly written
into the code, to avoid performance loss.

To understand how data is represented in a program, you need to know
the difference between heap and stack. The stack is a space allocated
by the program when entering a function, which is released when the
function is exited. On the other hand, the heap is a space that is
allocated when certain instructions in the program require it, such as
creating a new array, creating a new object instance, and so on.

When an array is created, all its data is stored in the heap, and the
address of this data is stored in the stack, where the variables are
located. The following figure shows the data representation for this
program:

```ymir
def foo () {
	let x = [1, 2, 3];
}
```

![Image](https://gnu-ymir.github.io/Documentations/advanced/memory_x_foo.png)

## Mutability level 

We define the mutability level, as the deeper level in the type that
is mutable. An example of mutability level is presented in the
following table : 

| Type | Level |
| --- | --- |
| mut [i32] | 1 |
| [i32] | 0 |
| mut [mut i32] | 2 |
| dmut [[[i32]]] | 4 |

This is mainly used to ensure that borrowed data is not modified by
another variable, in external part of the program. The user has the
complete control on the data he created. The example bellow shows an
utilisation of the mutability level, to ensure that the content of an
array is never modified.

```ymir
import std::io

def main () {
	let mut x = [1, 2, 3];
	x = [2, 3, 4];
	// Try to add the following line : 
	// x [0] = 8;
}
```

The type of `x` in the previous example is `mut [i32]`, we did not
specify mutability for the inner part of the array, so the compiler
assumed that you don't want it to be mutable, for safety reasons. If
you have done the previous exercise, you should have got the following
error:

```
Error : left operand of type i32 is immutable
 --> main.yr:(7,7)
    | 
 7  |     x [0] = 8;
    |       ^

ymir1: fatal error: 
compilation terminated.
```
It means that the data borrowed by **`x`** (and in this case are
located in the Heap) are not mutable. 

### Deep mutability

Earlier we have introduce the keyword `dmut`, this keyword is used to
avoid very verbose type declaration, and tell that every sub type from
this point will be mutable. This keyword is applicable on every type,
but will have only effect on arrays and tuple. The following table
shows example of that, on an array type :

| Type | Verbose equivalent |
| --- | --- |
| dmut [i32] | mut [mut i32] |
| dmut [[[i32]]] | mut [mut [mut [mut i32]]] |

If we modify the example given above, and change the `mut` keyword by
a `dmut` keyword, the type of `x` become `mut [mut i32]`, and
therefore `x[0] = 8` is valid statement.

### String literal 

String literal unlike array literal are located in the text. It means
that the type of a string literal is `[c32]` (or `[c8]` if the suffix
`s8` is specified), when the type of an array literal (of `i32` for
example) is `mut [mut i32]`. So, if you write the following code : 

```ymir
import std::io

def main () {
	let dmut x = "Try to make me mutable !?";
}
```

You should get the following error : 

```
Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
 --> main.yr:(4,11)
    | 
 4  | 	let dmut x = "Try to make me mutable !?";
    | 	         ^
Note : 
 --> main.yr:(4,15)
    | 
 4  | 	let dmut x = "Try to make me mutable !?";
    | 	             ^

ymir1: fatal error: 
compilation terminated.
```

## Memory borrowing

When you want to make a copy of a value whose type is aliasable, you
must tell the compiler how you want to make the copy. There are four
ways of moving memory, or referencing memory, which are provided with
the four keywords `ref`, `alias`, `copy` and `dcopy`.

