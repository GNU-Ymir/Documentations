# Alias

All types that contain a pointer to data in the heap are aliasable
type. An aliasable type cannot be implicitly copied, nor can it be
implicitly referenced, for performance and security reasons
respectively. There are mainly two aliasable types, arrays (or slices,
there is no difference in Ymir) and objects. Structures and tuples
that contain aliasable types are also aliasable.

You must use the keyword `alias`, to tell the compiler that you
understand that a new variable will borrow values.

```ymir
import std::io

def main () {
	let mut x : [mut i32] = [1, 2, 3];
	let mut y : [mut i32] = alias x;
	//                      ^^^^^
	// Try to remove the alias
	println (y);
}
```

This source code can be represented in memory by the following figure.

<img src="https://gnu-ymir.github.io/Documentations/advanced/memory_x_alias_main.png" alt="drawing" width="700"/>

The alias keyword is only mandatory when the variable that will borrow
the data is mutable and may impact the value. It is obvious that one
cannot borrow immutable data from a variable that is mutable. For
example, the compiler must return an error on the following code.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let mut y : [mut i32] = alias x;
	//                      ^^^^^
	// Try to remove the alias
	println (y);
}
```

```
Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
 --> main.yr:(5,13)
    | 
 5  |     let mut y : [mut i32] = alias x;
    |             ^
    | Note : 
    |  --> main.yr:(5,29)
    |     | 
    |  5  |     let mut y : [mut i32] = alias x;
    |     |                             ^^^^^
    |------------------------------ 

Error : undefined symbol y
 --> main.yr:(8,14)
    | 
 8  |     println (y);
    |              ^

ymir1: fatal error: 
compilation terminated.
```

However, if the variable that will borrow the data is not mutable,
there is no need to add the keyword `alias`, and the compiler will
create an implicit alias, which will have no consequences.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let y = x; 
	println (y);
}
```

In the last example, **`y`** can be mutable, as long as its internal
value is immutable, i.e. its type is `mut [i32]`, you can change the
value of `y`, but not the value it borrows. There is no problem, the
values of `x` will not be changed, no matter what you do with `y`.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let mut y = x; 
	// y [0] = 9;
	// Try to add the above line 
	
	y = [7, 8, 9];
	println (y);
}
```

You may have noticed that even though the literal is actually the
element that creates the data, we do not consider it to be the owner
of the data, so the keyword `alias` is implied when it is literal. We
consider the data to have an owner only once it has been assigned to a
variable.

There are other kinds of `alias` that are implicitly allowed, such
as code blocks or function returns. Those are implicit because
the alias is already made within the value of these elements.

```ymir
import std::io

def foo () -> dmut [i32] {
	let dmut x = [1, 2, 3];
	alias x // alias is done here and mandatory
}

def main () {
	let x = foo (); // no need to alias
	println (x); // [1, 2, 3];
}
```

## Alias a function parameter

As you have noticed, the keyword `alias`, unlike the keyword `ref`,
does not characterize a variable. The type of a variable will indicate
whether the type should be passed by alias or not, so there is no
change in the definition of the function. When the type of a parameter
is an aliasable type, this parameter can be mutable without being a
reference.

```ymir 
import std::io

def foo (mut x : [mut i32]) {
	x [0] = x [1];
}

def main () {
	let dmut x = [1, 2, 3];
	foo (alias x);
	//   ^^^^^
	// Try to remove the alias
}
```

As with the variable, if the function parameter cannot affect the
values that are borrowed, the alias keyword is not required.

```ymir 
import std::io

def foo (x : [i32]) {
	println (x);
}

def main () {
	let dmut x = [1, 2, 3];
	foo (x);
}
```

## Special case of struct and tuple

In the chapter [Structure]() you will learn how to create a structure
containing several fields of different types. You have already learned
how to make tuples. These types are sometimes aliasable, depending on
the internal type they have. If a tuple, or a structure, has a field
whose type is aliasable, then the tuple or structure is also
aliasable.

The table bellow present some example of aliasable tuple : 

| Type | Aliasable |
| --- | --- |
| (i32, i32) | false |
| ([i32],) | true |
| ([i32], f64) | true |
| (([i32], i32), f64) | true |




