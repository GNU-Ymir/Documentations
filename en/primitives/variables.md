# Variables and Mutability

Variables are declared with the keyword **`let`**, the type of the
variable is deduced from the value associated with it. The type can be
forced with the `:` token, but it must be compatible with the value.

If a variable is declared immutable, once a value is bound to it, it
can no longer change. In addition, a variable must have an initial
value and cannot be declared without it.

To illustrate the declaration of variables, you can try to execute the
following code.

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

You should get the following compiler error: 

```
Error : left operand of type i32 is immutable
 --> main.yr:(7,5)
    | 
 7  |     x = 3;
    |     ^

ymir1: fatal error: 
compilation terminated.
```

In Ymir, variable mutability and, in addition, type mutability ensure,
through static checks, that when one declares that the value of a
variable will not change, it will not really change. Although this can
sometimes be a little frustrating for the user.

A variable is immutable by default, but it can sometimes be useful to
make it mutable. To do this, you can use the keywords **`mut`** and
**`dmut`**.  Mutability applies to types, not just variables. The
difference between these two keywords is that **`dmut`** means that
the type of the variable is deeply mutable. The immutability of a type
is transitive, but this transitivity and what it implies will be
explained in detail in another chapter, since it is an advanced
knowledge of the language **Ymir**.


If we take the same example as above, except that we add the keyword
`mut` to the variable `x`.

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

This time you won't get any errors, and the next output should appear
when you run the program.

```
X is equal to : 2
X is equal to : 3
```

Variable mutability can be very useful, but sometimes a little
difficult to address when dealing with complex types. **Ymir**
introduces the **aliasable** types, which are explained in detail in the
chapter [Aliases and references](https://gnu-ymir.github.io/Documentations/advanced/).

## Global variables

Global variables are variables that are declared outside of a
function, they can be used for multiple reasons. These types of
variables are declared using the keyword `static`.

As with all variables, these may or may not be mutable, but are
immutable by default.

```ymir
import std::io

static pi = 3.14159265359

def main () {
	println ("Pi value is : ", pi);
}
```

## Shadowing and scope

All variables that are not global, have a life time that is defined by
their scope. A scope is a code segment, which has a beginning and an
end, in which statements are made. Further information on scope will
be provided in the chapter on function bodies in [Functions](https://gnu-ymir.github.io/Documentations/primitives/functions.html).

Two variables with the same name cannot be declared in colliding
scopes, i.e. if a variable is declared with the name of a currently
living variable in the current scope, a shadowing error will occur.

To illustrate this, copy and execute the following program. 

```ymir
import std::io

def main () {
	let x = 9;
	
	let x = 12;
}
```
You should get the following error when compiling.

```
Error : declaration of x shadows another declaration
 --> main.yr:(6,9)
    | 
 6  |     let x = 12;
    |         ^
    | Note : 
    |  --> main.yr:(4,9)
    |     | 
    |  4  |     let x = 9;
    |     |         ^
    |------------------------------ 

ymir1: fatal error: 
compilation terminated.
```
