# Error handling

This section will introduce error handling in the *Ymir* language. As
with many languages, error are managed by throwing
exceptions. Exception can be recovered thanks to scope guards that
manage the errors in different manners. The keyword `throw` is used to
throw an exception when an error occurs in the program. An exception
is a class that inherits the core class `core::exception::Exception`.
Exceptions are always recoverable, and must be managed by the user,
who cannot simply ignore them. *Ymir* does not allow the possibility
to ignore that an exception is thrown in a function, and may cause the
function to exit prematurely. To avoid this possibility, excpetion
must be written in the definition of the function, or managed
directly.


```ymir
// Exception is defined in a core module, so does not need import 
class MyError over Exception {
	pub self () {}
}

def main () 
	throws &MyError
{
	throw MyError::new ();
}
```

## Assert 

We have seen in previous section the *assert* expression. This simple
expression throws an **`&AssertError`** value when the condition is
not valid. **`AssertError`** is a common exception defined in a core
file (that does not need to be imported).

```ymir
def main () 
	throws &AssertError
{
	let i = 11;
	assert (i < 10, "i must be lower than 10")
}
```

## Rethrowing 

The error rethrowing is a way of defining that a function could throw
an exception, and that this exception must be taking into account by
the caller functions. It is a system relatively close to error
rethrowing of the Java language, apart that the specific name of the
exception must be written in the possible rethrowed exceptions. That
is to say, it is impossible to write that a function throws a parent
class of the actually thrown exception (e.g. **`&Exception`**, when
the function actually throws **`&AssertError`**). Thanks to that, the
compiler is always able to check the type of the exceptions, and can
force the user to handle them.

In the following example, the function **`foo`** is an unsafe function
that can throw the exception **`&AssertError`**. This exception is
thrown by the function **`assert`** at line **`6`**, and is not
managed by the function **`foo`**. Because the **`main`** function
calls the **`foo`** function, it is also unsafe, and also throws the
exception **`&AssertError`**. In this example, the program stops,
because of an unhandled exception. 

```ymir
import std::io

def foo (i : i32) 
	throws &AssertError
{
	assert (i < 10, "i is not lower than ten");
	println (i);
}

def main () 
	throws &AssertError
{
	foo (10);
}
```

<br>

Results (in debug mode, *-g* option): 

```
Unhandled exception
Exception in file "/home/emile/ymir/Runtime/midgard/core/exception.yr", at line 84, in function "core::exception::abort", of type core::exception::AssertError.
╭  Stack trace :
╞═ bt ╕ #1
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #2
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #3 in function core::exception::abort (...)
│     ╘═> /home/emile/ymir/Runtime/midgard/core/exception.yr:84
╞═ bt ╕ #4 in function main::foo (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:7
╞═ bt ╕ #5 in function main (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:10
╞═ bt ╕ #6
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #7 in function main
│     ╘═> /home/emile/Documents/test/ymir/main.yr:10
╞═ bt ╕ #8
│     ╘═> /lib/x86_64-linux-gnu/libc.so.6:??
╞═ bt ═ #9 in function _start
╰
Aborted (core dumped)
```

<br>

The compiler does not allow to forget the possibility of a error
throwing, and requires the user to write it down. In the following
example, the function **`foo`** call the function **`assert`** that
could throw an **`&AssertError`** if the test fails. In that case the
function **`foo`** can also throw an error, and that must be written
in the prototype of the function. Otherwise the compiler gives an
error.

```ymir
import std::io

def foo (i : i32) 
{
	assert (i < 10, "i is not lower than ten");
	println (i);
}
```

<br>

Errors: 

```error
Error : the function main::foo might throw an exception of type &(core::exception::AssertError), but that is not declared in its prototype
 --> main.yr:(3,5)
 3  ┃ def foo (i : i32) 
    ╋     ^^^
    ┃ Note : 
    ┃  --> main.yr:(5,2)
    ┃  5  ┃ 	assert (i < 10, "i is not lower than ten");
    ┃     ╋ 	^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

As previously stated, the name of the exceptions specified in the
prototype function must be the actual name of the exception, not the
name of an ancestor. In the following example, the class
**`ParentException`** and **`ChildException`** are two throwable
class. The function **`foo`** throws an object of type
**`ChildException`**, but the prototype declares that the function
throws a **`ParentException`** object. To avoid losing accuracy, the
*Ymir* language does not allow that. This is however still possible to
perform this kind of behavior (necessary when the function throw
multiple kind of errors, all deriving from **`ParentException`** for
example), by using a **`cast`**, that we have seen in chapter [Cast
and Dynamic
typing](https://ymir-lang.org/cast/). That way,
there is a loss of accuracy, but properly defined and intended by the
user.

```ymir

class ParentException over Exception {
	pub self () {}
}

class ChildException over Exception {
	pub self () {}
}

def foo () 
	throws &ParentException
{
	throw ChildException::new ()
}
```

<br>

Errors: 

```error
Error : the function main::foo might throw an exception of type &(main::ChildException), but that is not declared in its prototype
 --> main.yr:(9,5)
 9  ┃ def foo () 
    ╋     ^^^
    ┃ Note : 
    ┃  --> main.yr:(12,5)
    ┃ 12  ┃     throw ChildException::new ()
    ┃     ╋     ^^^^^
    ┗━━━━━┻━ 

Error : the function main::foo prototype informs about a possible throw of an exception of type &(main::ParentException), but this is not true
 --> main.yr:(9,5)
 9  ┃ def foo () 
    ╋     ^^^
    ┃ Note : 
    ┃  --> main.yr:(10,12)
    ┃ 10  ┃     throws &ParentException
    ┃     ╋            ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```


