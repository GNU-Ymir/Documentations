# Scope guards

In the last section we have seen the `catch` keyword that create a
scope guard to catch exception that make occur in a specific scope. In
this section, we will introduce three different scope guards,
`success`, `failure` and `exit`.

As for the `catch` scope guard those are attached to a scope defined
by `{}`. But unlike, the catch scope guard, they do not have impact on
the value of the scope to which they are attached.

## Success scope guard

The success scope guard is the simplest scope guard that exists, it is
just a way to perform operation at the end of a scope if everything
went as wanted, and no exception has been thrown.

```ymir
import std::io

def bar () -> i32 {
	println ("In bar");
	42
}

def foo () -> i32 {
	println ("In foo");
	bar ()
} success {
	println ("Exiting foo");
}

def main () {
	foo (); 
}
```

The scope success is the last thing executed in the block, so the
result will be the following.

```
In foo
In bar
Exiting foo
```

## Failure scope guard

The failure scope guard is the exact opposite of the success scope
guard. It will only be triggered when an error occured in the scope to
which it is attached. Failure scope guard does not catch exception,
they are just there to perform statements, when an exception has been
thrown. 

```ymir
import std::io

def foo (i : i32) -> i32
    throws AssertError
{
    assert (i < 10);
    42
} failure {
    println ("Error in foo");
}

def main ()
    throws AssertError
{
    foo (12); 
}
```

The assertion will failed, and the output will be the following : 

```
Error in foo
Unhandled exception
Exception in file "/home/emile/Documents/ymir/yruntime/midgard/core/exception.yr", at line 38, in function "core::exception::abort", of type core::exception::AssertError.
Aborted (core dumped)
```

A failure scope guard can evidently be attached only to scope that may
throw errors.

```ymir
import std::io

def foo (i : i32) -> i32 {
    42
} failure {
    println ("Error in foo");
}

def main () {
    foo (12); 
}
```

```
Error : failure scope guard will never be triggered
 --> main.yr:(5,3)
    | 
 5  | } failure {
    |   ^^^^^^^

ymir1: fatal error: 
compilation terminated.
```

## Exit scope

The exit scope is a shortcut for both `success` and `failure` scope
guards. It guarantee that an operation will be treated at the end of a
scope, no matter what happened in the scope.  It is very useful for
release tokens or handle at the end of a scope.


```ymir
import std::io
import std::concurrency::sync;

static m = Mutex::new ()

def foo (i : i32) {
	{
		m.lock ();
		assert (i < 10);
	} catch {
	    x : _ => {
			println ("catch : ", x);
		}
	} exit { // even if no assertion occured this will be triggered
		println ("Unlock : ", i);
		m.unlock ();
	} 
}

def main () {
	foo (90);
	foo (1);
}
```

Result : 
```
Unlock : 90
catch : AssertError ()
Unlock : 1
```

