
# Functions 

We have seen in the chapter [Basic programming concepts]() how
functions are written. In this chapter we will see more advanced
function systems, named function pointer and closure.

## Function pointer

A function pointer is a value that contains a function. It can be used
to pass function as argument to other functions. The type of the
function pointer is written using the keyword `fn`, and have the same
syntax as a function prototype, but without a name.

```ymir
import std::io

def foo (f : fn (i32)-> i32) -> i32 {
	f (41)
}

def addOne (x : i32)-> i32
	x + 1


def main () {
	let x = foo (&addOne);
	println (x);
}
```

In the above example, we have specified that the function `foo` take
as parameter a function pointer, that takes an `i32` and return a
`i32`.

### Function pointer using reference

Function pointer can take reference parameters as normal functions.

```ymir
import std::io

def foo (f : fn (ref mut i32)-> i32) -> i32 {
	let ref mut x = 41;
	f (ref x);
	x
}

def mutAddOne (ref mut x : i32) {
	x = x + 1;
}

def main () {
	let x = foo (&mutAddOne);
	println (x);
}
```

## Lambda function 

Lambda function are anonymous function that have the same behavior as
normal function, but don't have a name. They are declared using the
token `|` surrounding the parameters instead of parentheses in order
to dinstinguish them from tuple. 

```ymir
import std::io

def main () {
	let x = |x : i32, y : i32|-> i32 { 
		x + y
	};
	println (x (1, 2));
}
```

As you may have noticed, there is no conflict between the variable `x`
declared in the function main, and the first parameter of the lambda
also named `x`. In many cases the type of the parameters and return
type can be infered, and are therefore optional. The above example can
then be rewritten into :

```ymir
import std::io

def main () {
	let x = |x, y| x + y;	
	println (x (1, 2));
	
		
	// The types are not given, then you can also write 
	println (x (1.3, 2.9));	
}
```

The token `=>` can be added after the prototype de make the lambda a
bit more readable. It is just syntaxic and has no impact on the
behavior of the lambda.

```ymir
import std::io

def main () {
	let x = |x, y| => x + y;	
	println (x (1, 2));
	
		
	// The types are not given, then you can also write 
	println (x (1.3, 2.9));	
}
```

Lambda function can evidently be used as function argument, like
normal functions.


```ymir
import std::io

def foo (f : fn (i32, i32)-> i32, x : i32, y : i32) -> i32 {
    f (x, y) + f (y, x)
}

def main () {
    let x = (|x, y|=> x * y).foo (3, 7);
	// Dotcall syntax, you can of course write it as follows : 
	// foo (|x, y| x*y, 3, 7);
    println (x);
}
```

Lambda function that are not typed are special element, that have no
value. If it is not possible to infer the type of the lambda, and you
try to use it as a value, then you will get an error. **Ymir** allows
to put an untyped lambda inside an immutable var, to ease its usage,
but the lambda still does not have any value.  With the following
code, you should get an error.
```ymir
def main () {
	let x = |x| x + 1;
	let mut y = x;
}
```

```
Error : type mut fn (any)-> any is not complete
 --> main.yr:(4,13)
    | 
 4  |     let x = |x| x + 1;
    |             ^
Note : 
 --> main.yr:(5,13)
    | 
 5  |     let mut y = x;
    |             ^

ymir1: fatal error: 
compilation terminated.
```

When you want to return a lambda function as a function value, you can
have the same error.  To avoid this, you can use the keyword "return",
which will impose the type of the function return and allow an
implicit deduction of the lambda type. For example, the following code : 

```ymir
import std::io

def foo () -> fn (i32)-> i32 {
	return |x| => x + 12
//  ^^^^^^
// Try to remove the return here
}

def main () {
	let x = foo ();
	println (x (30));
}
```

## Closure

Lambda function have no access on the scope of the function that
declare them. If you try to compile the following program, you should
get an error.

```ymir
import std::io

def main () {
	let i = 12;
	let x = | | {
		println (i);
	};
	x ();
}
```

The variable `i` does not exist in the scope of the lambda function.

```
Error : undefined symbol i
 --> main.yr:(6,11)
    | 
 6  | 	println (i);
    | 	         ^

ymir1: fatal error: 
compilation terminated.
```

Closure are a function pointer that capture the environment of the
function that has declared them. There is two type of closure,
reference closure and move closure.

### Move closure 

A move closure, declared by the keyword "move" followed by a lambda
function, has access to the parent environment by value. All included
values are immutable, and there is no way to make them mutable. A move
closure is safe to use, and in most cases totally sufficient, and is
preferable to the reference closure.

Unlike function pointer, the closure type is created with the keyword
`dg` for delegate. A delegate is a function pointer with an
environment, and is the general case of a closure.

```ymir
import std::io

def foo (f : dg (i32)-> i32) -> i32 {
	f (12)
}

def main () {
	let i = 30;
	let x = foo (move |x|=> x + i);
	println (x);
}
```

Move closures can be returned safely, since the closure is done by
value, there is no problem with the lifetime of the variables that are
enclosed.


```ymir
import std::io

def foo ()-> dg (i32)-> i32 {
	let mut i = 30;
	return move |x : i32| x + i;
}

def main () {
	let z = foo ();
	println (z (12));
}
```
 
