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

## Memory borrowing

When you want to make a copy of a value whose type is aliasable, you
must tell the compiler how you want to make the copy. There are four
ways of moving memory, or referencing memory, which are provided with
the four keywords `ref`, `alias`, `copy` and `dcopy`.

