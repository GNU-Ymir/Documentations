# Functions

Functions are a widely accepted concept for dividing a program into
small parts. A ymir program starts with the `main` function that you
have already seen in previous chapters.

All functions are declared using the keyword **`def`**. And are called
using parameters separated by commas in parentheses.


```ymir 
import std::io 

def main () {
	foo ();
}

def foo () {
	println ("Foo");
	
	bar ();
}

def bar () {
	println ("Bar");
}
```

The declaration of a function can be done anywhere in the program, the
order is not important for the compiler, so even if `foo` is declared
after the `main` function, it can be called without any problem.

You can also call a function using dotcall syntax, by placing the
first parameter of the function on the left. This syntax is used to
perform continuous data processing and to make the source code easier
to read.

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

## Parameters 

The parameters of a function are declared after its name, and the
syntax is similar to the declaration of a variable, but the keyword
**`let`** is omitted because it is obvious.

```ymir 
import std::io 

def foo (x : i32) {
	println ("The value of x is : ", x);
}

def bar (x : i32, y : i32) {
	println ("The value of x + y : ", x + y);
}

def main () {
	foo (5);
	bar (3, 4);
}
```

The values can be specified on a function parameter. If a parameter
has a value, the value is used by default, so it is optional to
specify the value when calling the function for that particular
parameter. If you still want to specify a value, you will need to use
a named expression that is formed using the **`->`** token.

```ymir 
import std::io

def foo (x : i32 = 8) {
	println ("The value of x is : ", x);
}

def main () {
	foo ();
	foo (x-> 7);
}
```

The named expression can also be used for parameters that do not have
a default value. A named expression will allow you to specify the
parameter in any order you want. The algorithm, which determines which
parameter an argument refers to, is presented bellow and we will
illustrate it by the following example :

```ymir
def foo (x : i32, y : i32 = 9, z : i32) {
	println (x, " ", y, " ", z);
}

def main () {
	foo (8, y-> 1, x-> 2);
}
```

The algorithm is the following : 

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

In this example, the result of each step will be : 

```
1, x : [x-> 2]
2, y : [x-> 2, y-> 1]
3, z : [x-> 2, y-> 1, 8]
```

You can use a complex expression for the default expression of a
parameter, such as the creation of a class, a function call, and even
a code block. However, you cannot refer to the other parameters of the
function. In the next section, we will talk about function bodies, but
the explanations presented there are valid for any type of expression.

```ymir
import std::io

def foo (x : i32) -> i32 
	x + 1
	
def bar (x : i32) -> i32
	x + 2
	
def test (a : i32, b : i32 = {bar (1) + foo (2)}) {
	//                             ^
	//                       Try to replace by a
	println (a);
	println (b);
}

def main () {
	test (12);
}
```

## Function body

The body of a function is an expression. Everything in ymir is an
expression, but each expression does not always have a value, and can
be `empty`. An empty expression has the type `void`.

A simple `add` function can be written as follows: 

```ymir
def add (x : i32, y : i32)-> i32 
	x + y
```

Or by using a more complex expression, such as block, which is an
expression containing a set of statements. A block is surrounded by
the `{}` tokens, and the last expression in a block is its value.

```ymir
def main () {
	let x = {
		let y = 9;
		y + 1
	}
}
```

The `;` token is a way of specifying that an expression ends, and that
the value of the block is the expression that follows. If no
expression follows the expression, the block value is evaluated to
nothing and its type is **`void`**. For example, if we write the
following code :

```ymir
def foo () -> i32 
    9


def main () {
    let x = {
        foo ();
    }
}
```

You should get the following error from the compiler : 

```
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

The keyword `return` is used to end a function prematurely.

```ymir
def isDivisable (x : i32, z : i32) -> bool {
	if (z == 0) return false;
	
	(x % z) == 0
}
```

If the type of the value of the function body is not equivalent to the
type of the function, and if it is possible that the function may
never encounter a return declaration, an error is returned by the
compiler. For example, with the following code :

```ymir
import std::io

def add_one (x : i32)-> i32 {
	x + 1;
}

def main () {
	let x = add_one (5);
	println ("The value of x : ", x);
}
```

You should get the following error : 

```
Error : incompatible types i32 and void
 --> main.yr:(3,29)
    | 
 3  | def add_one (x : i32)-> i32 {
    |                             ^
Note : 
 --> main.yr:(5,1)
    | 
 5  | }
    | ^

ymir1: fatal error: 
compilation terminated.
```

But if you change the last expression by a return statement, for example : 

```ymir
import std::io

def add_one (x : i32)-> i32 {
    if (x == 12) {
        return x + 1
    } else {
        return x + 2
    }
}

def main () {
    let x = add_one (5);
    println ("The value of x : ", x);
}
```

The compiler won't return any error.

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
function. The function is not a module Cf. [Modules]()
