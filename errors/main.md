# Error handling

This section will introduce error handling in the **Ymir**
language. As with many languages, we have opted for error handling by
throwing exceptions. Error recovery is done in a localized way at the
scope thanks to a system called scope guard.

The keyword `throw` is used to throw an exception when an error occurs
in the program. An exception is a class that inherits the core class
`core::exception::Exception`. 

Exception are followed by the compiler, that will not allow you to
forget the possibility that they may occur, and will force you to
handle them. There are two possibilities for error handling, either
you rethrow it in the function level by using the `throws` keyword,
either you catch it with the keyword `catch`.

## Rethrowing 

The error rethrowing is a way of defining that a function may throw an
exception, and that this exception must be taking into account by a
caller function. It is a system relativelly similar to error
rethrowing in Java, apart that the specific name of the exception
must be written in the possible rethrowed exception. That is to say,
you can't write that you want to rethrow any kind of exception, by
writting `throws Exception`. 

Thanks to that, the compiler will always be able to check each kind of
exceptions, and force the user to handle them.

```ymir
import std::io

def foo (i : i32) 
	throws AssertError
{
	assert (i < 10, "i is not lower than ten");
	println (i);
}

def main () 
	throws AssertError
//  ^^^^^^^^^^^^^^^^^^
// Try to remove this above line
{
	foo (10);
}
```

As previously stated, the name of the exceptions specified in the
prototype function must be the actual name of the exception, not the
name of an ancestor.

```ymir

class ParentException over Exception {
	pub self () {}
}

class ChildException over Exception {
	pub self () {}
}

def foo () 
	throws ChildException
//         ^^^^^
// Try to replace by Parent, or to remove just Exception
{
	throws ChildException::new ()
}


def main () 
	throws ChildException
//         ^^^^^
//  Try to do the same here
{
	foo ()
}
```

This system assure that, if a function is not marked as a throwing
function, it is safe, and the program won't crash when calling
it. Therefore, if the `main` function of a program is safe, then the
program can't crash.

## Catching exception

The keyword `catch` define a catching block. It must follow a scope
defined by `{}`, and must catch all the exception that may occur in
that scope. The syntax of catching exception is similar to the pattern
matching.

```ymir
import std::io

def foo () 
	throws AssertError
{
	assert (false);
}

def main () {
	foo ();
} catch {
	_ : AssertError => {
		println ("Assert occured");
	}
}
```

There are no implicit rethrowing of exception in a catch block, it is
up to the user to force the rethrowing.

```ymir
import std::io

def foo (i : i32) 
    throws AssertError
{
    
    assert (i < 10);
}

def bar () -> i32
    throws OutOfArray
{
    let i = [1];
    i [9]
}

def main () 
    throws OutOfArray
{
    foo (8);
    bar ();
} catch {
    _ : AssertError => {
		println ("Assert occured");
    }
    x : OutOfArray => {
		throw x;
    }
	// Try to remove this second pattern match
}
```

### Recovering with catch 

In **Ymir** everything has a values, that is not different for a catch
block. When an error occurs, you may wan't to provide a default value,
that will help to recover from an error. The value of a catch block is
the value of the pattern matching it contains, and must have the same
type as the value of the block to which it is attached.

```ymir
import std::io

def foo ()-> i32 {
	let i = [1];
	i [9]
} catch {
	_ : OutOfArray => {
		println ("Out of array !")
		42
	}
}

def main () {
	let x = foo (); // Call foo is safe
	println (x);
}
```

## Mixin with type option

The standard library provide an option type, in `std::option`. An
option type is a monadic type, that may contain a value, or not. This
is mainly used to handle errors when a computation might fail and
return nothing.

```ymir
import std::io

def foo (i : i32) -> Option!i32 {
	if (i < 10) {
		Some::new (42)
	} else None!(i32)::new ()
}

def main () {
	println (foo (7));
}
```

In **Ymir** you can easily transform an exception into an option type,
by returning a `None` value, when an error occured. The function
`toOption` defined in the module `std::option` takes a function as
template argument, and transform the result of this function into a
option type. If the function throws an exception, the value `None` is
returned.

```ymir
import std::option
import std::io
    
def foo (i : i32) -> i32 
    throws AssertError 
{
    assert (i < 10);
    42
}

def main () {
    let x = toOption!foo (12);
    println (x);
}
```

Throwing function are unsafe function, therefore they cannot be used
as function pointer. In addition closure function (or lambda
functions) must be safe, and the compiler won't allow you to define a
function pointer that may throw an exception. For example, with the
following example, you should get an error :

```ymir
def main () {
	let x = |i : i32| => {
		assert (i < 10);
		42
	};	
}
```

```
Error : lambda functions must be safe, but there are exceptions that are not caught
 --> main.yr:(2,13)
    | 
 2  |     let x = |i : i32| => {
    |             ^
    | Note : core::exception::AssertError
    |  --> main.yr:(3,2)
    |     | 
    |  3  | 	assert (i < 10);
    |     | 	^
    |------------------------------ 

ymir1: fatal error: 
compilation terminated.
```

For the same reason, the following code will also result in a
compilation error :

```ymir
import std::option
import std::io
    
def foo (i : i32) -> i32 
    throws AssertError 
{
    assert (i < 10);
    42
}

def main () {
    let ptr = &foo;
    println (ptr (12));
}
```

```
Error : can't create a function pointer from function main::foo (i : i32)-> i32 that might throw exception
 --> main.yr:(12,15)
    | 
12  |     let ptr = &foo;
    |               ^
    | Note : throws core::exception::AssertError
    |------------------------------ 

Error : undefined symbol ptr
 --> main.yr:(13,14)
    | 
13  |     println (ptr (12));
    |              ^^^

ymir1: fatal error: 
compilation terminated.
```

Thanksfully, the standard function `toOption`, allows you to avoid
that error, and transform the function into a safe one that will return
an option type.

```ymir
import std::option
import std::io
    
def foo (i : i32) -> i32 
    throws AssertError 
{
    assert (i < 10);
    42
}

def main () {
    let ptr = &toOption!(foo);
    println (ptr (12));
}
```

