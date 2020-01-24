# Variables and Mutability

The variable are declared with the keyword **`let`**, the type of the
variable is inferred from the value associated to it. The type can be
forced with the token `:`, but it must be compatible with the value. 

If a variable is declared immutable, once a value is bound to it, it
cannot change. In addition a variable must have an initial value, and
cannot be declared without it.

To illustrate the variable declaration, you can try to run the following code. 

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

You should get the following error from the compiler : 

```
Error : left operand of type i32 is immutable
 --> main.yr:(7,5)
    | 
 7  |     x = 3;
    |     ^

ymir1: fatal error: 
compilation terminated.
```

In Ymir, the variable mutability and furthermore the type mutability
guarantee by static verifications, that when you state that the value
of a variable won't change it really won't change. Even if it can be a
bit frustrating for the user sometimes.

A variable is immutable by default, but sometime it can be useful to
make it mutable. To do so, you can use the keyword **`mut`** and
**`dmut`**.  Mutability is applicable on types, and not only on
variables. The difference between these two keyword, is that
**`dmut`** means the type of the variable is deeply mutable. The
immutability of a type is transitive, but this transitivity and what
it implies will be explained in details in another chapter, since it
is an advanced knowledge of the language **Ymir**.

If we take the same example as above, but with adding the keyword `mut` to the variable `x`.

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

This time, you will not get any error, and the following output should
appear when you run the program.

```
X is equal to : 2
X is equal to : 3
```

The mutability of variable can be very useful, but sometimes a bit
hard to tackle when dealing with complex types. **Ymir** introduce
**aliases** types, that are explained in details in the chapter
[Alias and References]()

## Global variables

Global variable are variables that are declared outside a function,
they can be used for multiple reasons. Those kind of variable are
declared using the keyword `static`. 

As for every variables, those one can be either mutable or not, but
are immutable by default.

```ymir
import std::io

static pi = 3.14159265359

def main () {
	println ("Pi value is : ", pi);
}
```

## Shadowing and scope

All the variable that are not global, have a lifetime that is defined
by their scope. A scope is a segment of code, that have a begin and an
end, in which statement are made. More informations about scope will
be given in the chapter about function bodies, in
[Functions](primitives/functions.md). 

Two variable with the same name cannot be declared in colliding
scopes, that is to say, if a variable is declared with a name of a
variable currently alive in the current scope, a shadowing error will
be raised.

To illustrate that, copy and run the following program. 

```ymir
import std::io

def main () {
	let x = 9;
	
	let x = 12;
}
```

You should get the following error, when compiling.

```
Error : declaration of x shadow another declaration
 --> main.yr:(6,9)
    | 
 6  |     let x = 12;
    |         ^
Note : 
 --> main.yr:(4,9)
    | 
 4  |     let x = 9;
    |         ^

ymir1: fatal error: 
compilation terminated.
```
