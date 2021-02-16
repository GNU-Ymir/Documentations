# Functions

Functions are a widely accepted concept for dividing a program into
small parts. A **`Ymir`** program starts with the `main` function that
you have already seen in previous chapters. All functions are declared
using the keyword **`def`** followed by a identifier, and a list of
parameters. A function is called by using its identifier and a list of
parameters separated by commas between parentheses. 

```ymir 
import std::io 

// The main function is the entry point of the program
// It can have no parameters, and return an i32, or void
//
def main () {
    foo ();
}


// Declaration of a function named 'foo' with no parameters 
//
def foo () {
    println ("Foo");
    	
    bar (); 
}


// Declaration of a function named 'bar' with one parameter 'x' of type 'i32'
//
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

// Declaration of a function 'foo' with one parameter 'x' of type 'i32'
//
def foo (x : i32) {
	println ("The value of x is : ", x);
}

// Declaration of a function 'bar' with two parameters 'x' and 'y' whose respective types are 'i32' and 'i32'
//
def bar (x : i32, y : i32) {
	println ("The value of x + y : ", x + y);
}

def main () {
	foo (5); // Call the function 'foo' with 'x' set to '5'
	bar (3, 4); // Call the function 'bar' with 'x' set to '3' and 'y' set to '4'
}
```

<br>

A function parameter can have a value, that is used by default when
calling the function. On can therefore note that it is optional to
specify the value of a function parameter that have a default value,
when calling the function. To change the value of a parameter with a
default value, the token **`->`** is used. This syntax is called a
*named expression*, and follows the gramatical rule :

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
default value. Thanks to the *named expression*, it is allowed to
specify the parameter in any order. The algorithm, which
determines which parameter an argument refers to, is presented bellow
and we will illustrate it by the following example :

```ymir
import std::io


// Parameters with default values, does not need to be last parameters
// This function can be called with only two parameters (x, z), or using named expression syntax
//
def foo (x : i32, y : i32 = 9, z : i32) {
    println (x, " ", y, " ", z);
}

def main () {
    // Call the 'foo' function with 'x' = 2, 'y' = 1 and 'z' = 8 
    foo (8, y-> 1, x-> 2);
    foo (1, 8); // call the function 'foo' with 'x' = 1 and y = '9' and z = '8'
}
```

<br>

The pseudo code of the algorithm that assigns the values to the
function parameters is presented below.

```ymir
Let args be the list of arguments ([y-> 1, x-> 2, 8])
Let params be the list of parameters (x, y=9, z)
Let final_args = [], be the list of final arguments
for each p in params :
	for a in args :
	    if p.name == a.name : 
			final_args = final_args ~ [a]
			remove p in params
			remove a in args
			found = true
			break
	if not found : 
		final_args = final_args ~ firstUnamedArg (args)
		remove p in params
		remove firstUnamedArg (args) in args	
```

<br> If we use the example function foo `def foo (x: i32, y : i32 = 9, z : i32)`,
and the call expression `foo (8, x-> 2, y-> 1)`
then the result of the assignement algorithm at each step will be the
following.

```
1, x : [x-> 2]
2, y : [x-> 2, y-> 1]
3, z : [x-> 2, y-> 1, 8]
```

<br>

You can use any complex expression for the default value of a function
parameter, for example the creation of a class, a function call, and
even a code block, etc. The only limitation is that, you cannot refer
to the other parameters of the function, as they are not considered
declared in the scope of the default value.

```ymir
import std::io

def foo (x : i32) -> i32 
	x + 1

def bar (x : i32) -> i32
	x + 2

// Declaration of a 'baz' function, where 'b' = bar(1) + foo(2), as a default value
//
def baz (a : i32, b : i32 = {bar (1) + foo (2)}) {
	//                             ^
	//                       Try to replace by a
	println (a);
	println (b);
}

def main () {
    test (12); 
    test (12, b-> 23);
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

## Function body

The body of a function is an expression. Everything in **`ymir`** is
an expression, and every expression are typed. That does not mean that
every expression have a value, as they can be typed as `void`
expression. A simple **`add`** function can be written as follows: 

```ymir
def add (x : i32, y : i32)-> i32 
	x + y
```

<br>

Or by using a more complex expression, such as block, which is an
expression containing a set of statements. A block is surrounded by
the `{}` tokens, and the last expression in a block is its value.

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

The `;` token is a way of specifying that an expression ends, and that
the value of the block is the expression that follows. If no
expression follows the expression, the block value is evaluated to
nothing and its type is **`void`**. For example, if for the following
source code :

```ymir

// The value of foo is '9'
//
def foo () -> i32 
    9


def main () {
    let x = {
         foo (); // Call foo, but does not store the return value
    } // The value of the block is 'void'
}
```

<br>

The compiler will return the following error : 

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

Sometimes a function can return a value, the type of the value must be
defined at the end of the function definition before the value, using
the token **`->`**. The type of the value of the function must be the
same as the one defined in the prototype.

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

The keyword **`return`** is used to end a function prematurely. 

```ymir
def isDivisable (x : i32, z : i32) -> bool {
	if (z == 0) return false; 
	
	(x % z) == 0
}
```

If the type of the value of the function body is not equivalent to the
type of the function, and if it is possible that the function may
never encounter a **`return`** declaration, an error is returned by the
compiler. For example, with the following code :

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

You should get the following error : 

```error
Error : incompatible types i32 and void
 --> main.yr:(3,29)
    ┃ 
 3  ┃ def add_one (x : i32)-> i32 {
    ┃                             ^
    ┃ Note : 
    ┃  --> main.yr:(5,1)
    ┃     ┃ 
    ┃  5  ┃ }
    ┃     ┃ ^
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

But if you change the last expression by a **`return`** statement, the
compiler won't return any error, for example in the following source
code.

```ymir
import std::io

def add_one (x : i32)-> i32 {
    if x == 12 {
        return x + 1;
    } else {
        return x + 2;
    }
}

def main () {
    let x = add_one (5);
    println ("The value of x : ", x);
}
```
<br>

## Block declaration

You can declare functions, structures, and so on in a function. This
makes it possible to create symbols that are only useful for the
current function. Subfunctions do not cover the scope of the parent
function.

```ymir
def foo () {
	import std::io;	
	let x = 12;
	
	def bar () -> i32 {
		// Try to add the following line 
		// println (x);
		12
	}
	println (x + bar ());
}

def main () {
	foo ();
	
	// Try to add the following lines : 
	// bar ();
	// println ("In the main function !");
}
```

There is no way to retrieve the `bar` symbol outside the `foo`
function. A function is not a module, and thus the declaration made
inside a function are available only for the function. The chapter
[Modules](https://gnu-ymir.github.io/Documentations/en/modules/)
presents another ways to define symbols available for functions.

## Uniform call syntax

The *uniform call syntax* is a syntax that allows to call a function
with another syntax, than the one presented earlier. The *uniform call
syntax* place the first parameter of the function on the left using
the *`.`* operator. This syntax is used to perform continuous data
processing and to make the source code easier to read.

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

This syntax is named *uniform call syntax* because it is similar to
 the the syntax used to call methods on class objects
 (cf. [Objects](https://gnu-ymir.github.io/Documentations/en/objects/));
