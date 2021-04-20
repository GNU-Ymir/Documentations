# Functions

Function is a widely accepted concept for dividing a program into
small parts. A **`Ymir`** program starts with the `main` function that
you have already seen in previous chapters. All functions are declared
using the keyword **`def`** followed by a identifier, and a list of
parameters. A function is called by using its identifier followed by a
list of parameters separated by commas between parentheses.

```ymir 
import std::io 

/** 
 * The main function is the entry point of the program
 * It can have no parameters, and return an i32, or void
 */
def main () {
    foo ();
}


/** 
 * Declaration of a function named 'foo' with no parameters 
 */
def foo () {
    println ("Foo");
    	
    bar (); 
}


/**
 * Declaration of a function named 'bar' with one parameter 'x' of type 'i32'
*/
def bar (x : i32) {
    println ("Bar ", x);
}
```

<br>

The grammar of a function is defined in the following code block.

```grammar
function := template_function | simple_function
simple_function := 'def' identifier parameters ('->' type)? expression
template_function := 'def' ('if' expression) identifier templates ('->' type)? expression

parameters := '(' (var_decl (',' var_decl)*)? ')'
var_decl := identifier ':' type ('=' expression)?

identifier := ('_')* [A-z] ([A-z0-9_])*
```

<br>

The order of declaration of the symbol has no impact on the
compilation. The symbols are defined by the compiler before being
validated, thus contrary to C-like languages, even if the `foo`
function is defined after the `main` function, it's symbol is
accessible, and hence callable by the `main` function. Further
information about symbol declarations, and accesses are presented in
chapter
[Modules](https://gnu-ymir.github.io/Documentations/en/modules/).

## Parameters 

The parameters of a function are declared after its identifier between
parentheses. The syntax of declaration of a parameter is similar to
the syntax of declaration of a variable, except that the keyword
**`let`** is omitted. However, unlike variable declaration, a
parameter must have a type, and its value is optional.

```ymir 
import std::io 

/**
 * Declaration of a function 'foo' with one parameter 'x' of type 'i32'
 */
def foo (x : i32) {
	println ("The value of x is : ", x);
}

/**
 * Declaration of a function 'bar' with two parameters 'x' and 'y' whose respective types are 'i32' and 'i32'
 */
def bar (x : i32, y : i32) {
	println ("The value of x + y : ", x + y);
}

def main () {
	foo (5); // Call the function 'foo' with 'x' set to '5'
	bar (3, 4); // Call the function 'bar' with 'x' set to '3' and 'y' set to '4'
}
```

<br>

### Default value

A function parameter can have a value, that is used by default when
calling the function. Therefore it is optional to specify the value of
a function parameter that have a default value, when calling it. To
change the value of a parameter with a default value, the *named
expression* syntax is used. This expression, whose grammar is
presented in the following code block, consists in naming a value.

```
named_expression: Identifier '->' expression
```

<br>

The following source code presents an example of function with a
parameter with a default value, and the usage of a *named expression* to
call this function.

```ymir 
import std::io


// Function 'foo' can be called without specifying a value for parameter 'x'
// '8' will be used as a default value for 'x'
//
def foo (x : i32 = 8) {
    println ("The value of x is : ", x);
}

def main () {
    foo (); // call 'foo' with 'x' set to '8'
    foo (x-> 7); // call 'foo' with 'x' set to '7'
}
```

<br>

The *named expression* can also be used for parameters without any
default value. Thanks to that *named expression*, it is possible to
specify the parameter in any order.

```ymir
import std::io


/**
 * Parameters with default values, does not need to be last parameters
 * This function can be called with only two parameters (x, z), or using named expression syntax
 */
def foo (x : i32, y : i32 = 9, z : i32) {
    println (x, " ", y, " ", z);
}

def main () {
    // Call the 'foo' function with 'x' = 2, 'y' = 1 and 'z' = 8 
    foo (8, y-> 1, x-> 2);
    foo (1, 8); // call the function 'foo' with 'x' = 1 and y = '9' and z = '8'
}
```

Results:
```
2 1 8
1 9 8
```

<br>

Any complex expression for the default value of a function parameter
can be used. The creation of an object, a call of a function, a code
block, etc. The only limitation is that, you cannot refer to the other
parameters of the function. Indeed, they are not considered declared
in the scope of the default value.

```ymir
def foo (x : i32) -> i32 { ... }
def bar (x : i32) -> i32 { ... }

/**
 * Declaration of a 'baz' function, where 'b' = bar(1) + foo(2), as a default value
 */
def baz (a : i32, b : i32 = {bar (1) + foo (2)}) {
 // ...
}

def main () {
	baz (12);
}
```

<br>

The symbols used in the default value of a parameters must be
accessible in the context of the function declaration. In the last
example, that means that the function `baz` must know the function
`bar` and the function `foo`, however, there is no need for the
function that calls it (here the function `main`) to know these
symbols. Further explanation on symbol declarations and accesses are
presented in chapter
[Modules](https://gnu-ymir.github.io/Documentations/en/modules/).

### Recursive default value

<br>

Recursivity of default parameter is prohibited. To illustrate this
point, the following code example will not be accepted by the
compiler.

```ymir
import std::io;

def foo (foo_a : i32 = bar ()) -> i32 {
                    // ^^^ here there is a recursive call 
	foo_a
}

def bar (bar_a : i32 = foo ()) -> i32 {
                    // ^^^ recursivity problem
					 
	println ("Bar ", bar_a);
	foo (foo_a-> bar_a + 11) 
}

def main () {
	println ("Main ", bar ()); // no need to set bar_a
}
```

Errors:
```error
Error : the call operator is not defined for main::bar and {}
 --> main.yr:(3,28)
 3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ╋                            ^^
    ┃ Note : candidate bar --> main.yr:(8,5) : main::bar (bar_a : i32)-> i32
    ┃ Note : 
    ┃  --> main.yr:(3,10)
    ┃  3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ┃     ╋          ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(8,24)
    ┃  8  ┃ def bar (bar_a : i32 = foo ()) -> i32 {
    ┃     ╋                        ^^^
    ┃ Note : 
    ┃  --> main.yr:(8,10)
    ┃  8  ┃ def bar (bar_a : i32 = foo ()) -> i32 {
    ┃     ╋          ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(3,24)
    ┃  3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ┃     ╋                        ^^^
    ┗━━━━━┻━
```

<br>

This recursivity problem can be easily resolved by setting a value to
the parameter **`bar_a`** when called in the default value of
**`foo_a`**.

```ymir
def foo (foo_a : i32 = bar (bar_a-> 20)) -> i32 {
                    //      ^^^^^ resolve the recursive problem 
	foo_a
}

// no need to do the same in bar, the recursivity does not exists anymore
```
Results:
```
Bar 20
Bar 31
Main 42
```

### Main function parameters

The **`main`** function can have a parameter. This parameter is of
type **`[[c8]]`**, and is the list of arguments passed to the program
in the command line when called. 

```ymir
import std::io;

def main (args : [[c8]]) {
	println (args);
}
```
Results: 
```bash
$ ./a.out foo bar 1
[./a.out, foo, bar, 1]
```

The std provides an argument parser in **`std::args`**, that will not
be presented here, but worth mentioning.

## Function body

The body of a function is an expression. Every expression in Ymir are
typed, but that does not mean that every expression have a value, as
they can be typed as `void` expression. A simple **`add`** function
can be written as follows:

```ymir
def add (x : i32, y : i32)-> i32 
	x + y
```

<br>

Or by using a more complex expression, such as scope, which is an
expression containing a list of expression. A scope is surrounded by
the curly brackets, and was presented in the section regarding
lifetime of local variables. The last expression in the list of
expression of a scope, is taken as the value of the scope. 

```ymir

def add (x : i32, y : i32) -> i32 { // start of a block
    x + y // last expression of the block is the value of the block
} // end of a block

def main () {
    let x = {
    	let y = add (1, 2);
    	y + 8 
    }   
}
```

<br>

The semi-colon token `;` is a way of specifying that an expression
ends inside a scope, and that its value must be ignored. If the last
expression of a scope is terminated by a semi-colon, an empty
expression is added to the scope. This empty expression has no value,
giving to the scope an empty value of type **`void`** as well.

```ymir

// The value of foo is '9'
//
def foo () -> i32 
    9


def main () {
    let x = {
         foo (); // Call foo, but its value is ignored
    } // The value of the scope is 'void'
}
```

<br>

Because it is impossible to declare a variable with a void type, that
contains no value, the above example is no accepted by the
language. The compiler returns the error depicted below. One can note,
that it is however possible the declare a variable without value, but
its type must be an empty tuple, defined by the literal **`()`**.

```error
Error : cannot declare var of type void
 --> main.yr:(6,9)
    | 
 6  |     let x = {
    |         ^

ymir1: fatal error: 
compilation terminated.
```

## Function return type

When the value of the body of a function is not of type **`void`**,
the function has as well a value with a type. This type must be
defined in the prototype of the function, to be visible from the other
function that can call it. This type declaration is made with the
single arrow token **`->`** after the declarations of the parameter of
the function. The return type of a function can be omitted if the
value of its body is of type **`void`**, but must be specified
otherwise.

```ymir
def foo (x : i32)-> i32 
	x + 1
	
def bar (x : i32, y : i32) -> i32 {
	let z = x + y;
	println ("The value of z : ", z);
	foo (z)
}
```

<br>

It is not always convinient to define a body of a function in a way
that leads to return the right value, when many branches are
possible. To avoid verbosity, and return function prematuraly, the
keyword **`return`**, close a function and return the value of the
expression associated with it. This **`return`** statement can also be
used in a **`void`** function, if its expression is of type
**`void`**. The type of the value of the expression associated to the
*return statement* must be the same as the function return type
defined in its prototype.

```ymir
def isDivisable (x : i32, z : i32) -> bool {
	if (z == 0) return false; 
	
	(x % z) == 0
}
```

<br>

The compiler checks that every branches leads to a return statement or
to a value of the right type. If a function body has a type different
to the return type of the function, and it can happen that no return
statement is encountered, then the compiler returns an error.

```ymir
import std::io

def add_one (x : i32)-> i32 {
    x + 1; // the value of the block is void, due to the ';'
}

def main () {
    let x = add_one (5); 
    println ("The value of x : ", x);
}
```

<br>

In the above source code, the function add_one has a body of type
**`void`**, when the function prototype claims that the function
returns a **`i32`**, and no return statement can be encountered inside
the function, thus the compiler returns the following error.  

```error
Error : incompatible types i32 and void
 --> main.yr:(3,29)
 3  ┃ def add_one (x : i32)-> i32 {
    ╋                             ^
    ┃ Note : 
    ┃  --> main.yr:(5,1)
    ┃  5  ┃ }
    ┃     ╋ ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Scope declaration

A scope is also the opening of a local module, in which declaration
can be made. These declarations can be other functions, structures,
classes, enumeration, etc. The declarations made inside a scope have
no access to the local variables defined in the function. Such access
is possible with the use of closures (*cf.* [Function
advanced](https://gnu-ymir.github.io/Documentations/en/functions)),
but this is not be presented inside this chapter.

```ymir
def foo () {
	import std::io;	 // importation is local to foo
	let x = 12;
	{
		def bar () -> i32 {
			// Try to add the following line 
			// println (x);
			12
		}
		println (x + bar ());
	}
	
	// bar is no longer accessible
	// bar (); // will not compile
}

def main () {
	foo ();
	
	// Try to add the following lines : 
	// bar ();
	// println ("In the main function !");
}
```

<br>

In the above example, the **`bar`** function is available in the scope
opened at line **4**, until its end at line **11**. For that reason,
it is also not available inside the **`main`** function. Moreover, the
*import statement* made at line **2** (importing the **`println`**
function) is only available in the scope opened at line **1**, and for
that reason not available in the **`main`** function. Functions are
not modules, this way of defining is used to define private symbols
only, in a future chapter we will see a way to define public symbols
available for other functions, and foreign modules (*cf.*
[Modules](https://gnu-ymir.github.io/Documentations/en/modules/)).

## Uniform call syntax

The *uniform call syntax* is a syntax that allows to call a function
with the dot operator **`.`**. The *uniform call syntax* place the
first parameter of the function as the left operand of the dot
operation, and the rest of the parameters of the function after the
right operand as a list of expression separated by comas enclosed
inside parentheses. 

```grammar
ufc := expression '.' expression '(' (expression (',' expression)*)? ')'
```

This syntax is used to perform continuous data processing and to make
the source code easier to read. This syntax is named *uniform call
syntax* because it is similar to the the syntax used to call methods
on class objects
(cf. [Objects](https://gnu-ymir.github.io/Documentations/en/objects/));

```ymir
import std::io

def plusOne (i : i32) -> i32 
	i + 1

def plusTwo (i : i32) -> i32
	i + 2
	
def main () {
	let x = 12;
	x.plusOne ()
	 .plusTwo ()
	 .println ();	 	 
}	
```

<br>

The *uniform call syntax* can also be useful to define equivalent of
methods on structures. 


