# Variables and Mutability

Variables are declared with the keyword **`let`**, the type of the
variable is deduced from the value associated with it. The type of the
variable can be forced with the **`:`** token, but it must be
compatible with the value.

If a variable is declared immutable, once a value is bound to it, it
can no longer change. In addition, a variable must have an initial
value and cannot be declared without it, in order to garanty that a
variable is always initialized. You will see in the [Control
flow](https://gnu-ymir.github.io/Documentations/en/primitives/control.html)
section, that a variable can still be intialized conditionnaly.

The following source code present a declaration of a variable **`x`**,
of type **`i32`**.

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

The compiler should return the following error: 

```
Error : left operand of type i32 is immutable
 --> main.yr:(7,2)
    ┃ 
 7  ┃ 	x = 3; 
    ┃ 	^


ymir1: fatal error: 
compilation terminated.
```

<br>
In Ymir, variable mutability and, type mutability ensure, through
static checks, that when one declares that the value of a variable
will not change, it will really never change. Although this can
sometimes be a little frustrating for the user.

A variable is immutable by default, but it can sometimes be useful to
make it mutable. To do this, you can use the keywords **`mut`** and
**`dmut`**.  Mutability applies to types, not just variables. The
difference between these two keywords is that **`dmut`** means that
the type of the variable is deeply mutable. The immutability of a type
is transitive, but this transitivity and what it implies will be
explained in detail in another chapter, since it is an advanced
knowledge of the language **Ymir** (cf. [Alias and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)).


If we take the same example as above, except that we add the keyword
**`mut`** to the declaration of the variable **`x`**.

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

<br>
This time the compiler will not return any errors, and the next output should appear
when running the program.

```
X is equal to : 2
X is equal to : 3
```

<br>

Variable mutability can be very useful, but sometimes a little
difficult to address when dealing with complex types. The **Ymir**
language has **aliasable** types, that borrows data from different
segment of memory, with strong mutability semantics. Those types are
explained in detail in the chapter [Aliases and
references](https://gnu-ymir.github.io/Documentations/advanced/).


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

### Shadowing

All variables that are not global, have a life time that is defined by
their scope. A scope is a code segment, which has a beginning and an
end, in which statements are made. Further information on scope will
be provided in the chapter on function bodies in
[Functions](https://gnu-ymir.github.io/Documentations/primitives/functions.html).

Two variables with the same name cannot be declared in colliding
scopes, i.e. if a variable is declared with the name of a currently
living variable in the current scope, a shadowing error will occur.

The following source code illustrates this point, where two variable
are declared in the same scope with the same name **`x`**.

```ymir
import std::io

def main () {
	let x = 9;
	
	let x = 12;
}
```

<br>
With this source code the compiler will return the following error.

```
Error : declaration of x shadows another declaration
 --> main.yr:(6,6)
    ┃ 
 6  ┃ 	let x = 12;
    ┃ 	    ^
    ┃ Note : 
    ┃  --> main.yr:(4,6)
    ┃     ┃ 
    ┃  4  ┃ 	let x = 9;
    ┃     ┃ 	    ^
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```
<br>

Unlike some other programming languages, the shadowing of a variable
is also not permitted in sub scopes, thus the following source code
should also return an error.

```ymir
def main () {
    let x = 9;
    { // entering a scope
	let x = 12; 
    }   
}
```

### Lifetime

As explained earlier the lifetime of a variable is the lifetime of the
scope in which a variable was declared. For example, compiling the
following source code will return an error, as the variable **`x`** no
longer exists when trying to print it.

```ymir
import std::io;

def main () {
    {
	let x = 12;
    } // x does not exists past this scope end
    println (x);
}
```

<br>

If a variable is declared inside a scope and is never used during its
lifetime the compiler will return an error. To avoid this error, the
variable can be named **`_`**. This seems useless to declare a
variable that is not used, but it can be useful sometimes (for example
when declaring function parameters in a overriden function, cf. [Class
inheritence](https://gnu-ymir.github.io/Documentations/en/objects/inheritance.html)).

A variable, whose name is **`_`** is anonymus, then there is no way to
retreive the value of this variable.

```ymir
import std::io;

def main () {
    let _ = 12; // declare a anonymus variable
}
```