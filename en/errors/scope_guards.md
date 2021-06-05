# Scope guards

Scope guards are expressions attached to a scope (block of code), that
are executed on specific cases in the scope that is guarded. There are
four different scope guards, **`exit`**, **`failure`**, **`success`**
and **`catch`**. This chapter does not discuss the *catch* scope
guard, that will be discussed in the next chapter.


The syntax of *exit*, *success* and *failure* scope guards is the following: 

```grammar
guarded_scope := '{' expression ((';')? expression)* (';')? '}' guards
guards := (Guard expression)* ('catch' catching_expression)? (Guard expression)*
Guard := 'exit' | 'success' | 'failure'
```

## Success guard

Scope guards are associate with expressions, that are executed when a
specific events occurs in the scope that is guarded. In the case of
*success* scope guard, the event that triggers the guard expression,
is when no error occured (nothing was thrown in the scope). 

```ymir
import std::io;

def foo (i : i32)
	throws &AssertError
{
	println ("I : ", i);
	assert (i < 10, "i must be lower than 10");
} success {
	println ("Nothing was thrown !!");
}

def main () 
	throws &AssertError
{
	foo (1);
	foo (20);
}
```

<br>
Results: 

```
I : 1
Nothing was thrown !!
I : 20
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
│     ╘═> /home/emile/Documents/test/ymir/main.yr:8
╞═ bt ╕ #5 in function main (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #6
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #7 in function main
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #8
│     ╘═> /lib/x86_64-linux-gnu/libc.so.6:??
╞═ bt ═ #9 in function _start
╰
Aborted (core dumped)
```

<br>

This scope guard can be used on scope that never throw exceptions, in
that case it is always executed. This goal of this scope guard is to
execute operation at the end of a scope, only when the operation
succeded (e.g. writting logs, sending acknolegement, etc.). It can be
coupled with other scope guards, to perform different operation when
the scope didn't succeded.

## Failure guard

The *failure* scope guard does the opposite of the *success* scope
guard, meaning that the associated expression is only executed when an
exception was thrown in the scope that is guarded. This scope guard is
really useful to perform operation without recovering from the
error. Indeed, the *failure* guard is not a *catch* guard, and the
execption that is thrown in the guarded scope continue its journey,
but the expression in the scope guard are guaranteed to be executed
(e.g. logging the error, closing a socket, unlocking a mutex, etc.).

```ymir
import std::io;

def foo (i : i32)
	throws &AssertError
{
	println ("I : ", i);
	assert (i < 10, "i must be lower than 10");
} failure {
	println ("Well there was an error...");
}

def main () 
	throws &AssertError
{
	foo (1);
	foo (20);
}
```

<br>
Results:
```
I : 1
I : 20
Well there was an error...
Unhandled exception
Exception in file "/home/emile/ymir/Runtime/midgard/core/exception.yr", at line 84, in function "core::exception::abort", of type core::exception::AssertError.
╭  Stack trace :
╞═ bt ╕ #1
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #2
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #3
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #4 in function main::foo (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:8
╞═ bt ╕ #5 in function main (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #6
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #7 in function main
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #8
│     ╘═> /lib/x86_64-linux-gnu/libc.so.6:??
╞═ bt ═ #9 in function _start
╰
Aborted (core dumped)
```


## Exit guard

The *exit* scope guard is the combination of the *success* and
*failure* guards. The operation contained in the guards are always
executed, no matter what happened in the scope that is guarded. It can
be seen as a shortcut for the *success* and *failure* guards doing the
same operations, but avoiding code repetition.


```ymir
import std::io;

def foo (i : i32)
	throws &AssertError
{
	println ("I : ", i);
	assert (i < 10, "i must be lower than 10");
} exit {
	println ("The scope is exited, with an error or not, who knows");
}

def main () 
	throws &AssertError
{
	foo (1);
	foo (20);
}
```

<br>

Results:
```
I : 1
The scope is exited, with an error or not, who knows
I : 20
The scope is exited, with an error or not, who knows
Unhandled exception
Exception in file "/home/emile/ymir/Runtime/midgard/core/exception.yr", at line 84, in function "core::exception::abort", of type core::exception::AssertError.
╭  Stack trace :
╞═ bt ╕ #1
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #2
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #3
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #4 in function main::foo (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:8
╞═ bt ╕ #5 in function main (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #6
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #7 in function main
│     ╘═> /home/emile/Documents/test/ymir/main.yr:12
╞═ bt ╕ #8
│     ╘═> /lib/x86_64-linux-gnu/libc.so.6:??
╞═ bt ═ #9 in function _start
╰
Aborted (core dumped)
```

## Scope guard priority

It is possible to use multiple scope guards for the same scope. In
that case, the order of execution of the scopes is the following :

- 1) for the scope guards of same nature (e.g. two *failure* guards),
  the execution is done is the order they are written.
  
```ymir
import std::io;

def main () 
{
    {
        println ("Scope operation");
    } exit {
        println ("Exit 1"); 
    } exit {
        println ("Exit 2");
    }
}
```

<br>
Results: 
```
Scope operation
Exit 1
Exit 2
```

<br>

- 2) If there is an *exit* guard and a *success* or a *failure* guard,
  then the *success* and *failure* guards are executed first.
  
```ymir
import std::io;

def main () 
{
    {
        println ("Scope operation");
    } success {
        println ("Success");
    } exit {
        println ("Exit 1"); 
    } exit {
        println ("Exit 2");
    } success {
        println ("Success 2");
    } 
}
```

<br>
Results: 

```
Scope operation
Success
Success 2
Exit 1
Exit 2
```

<br>

- 3) The priority between *failure* and *success* is not defined, they
  simply cannot happen at the same time.
