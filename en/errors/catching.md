# Catching exceptions

The main idea of exception is the possibility to recover from a
failing program state. In order to do that, another scope guard exits
in *Ymir*, this scope guard is named *catch*. The syntax of this scope
guard is relatively close to the other scope guard, and to the pattern
matching. Indeed, this scope guard does not execute an expression but
match over an exception that has been caught. The following code block
present the grammar of the *catch* scope guard. The
*pattern_expression* used in this code block are those defined in the
chapter [Pattern
matching](https://gnu-ymir.github.io/Documentations/en/pattern/).
 
```grammar
guarded_scope := '{' expression ((';')? expression)* (';')? '}' guards
guards := (Guard expression)* ('catch' catching_expression)? (Guard expression)*
Guard := 'exit' | 'success' | 'failure'

catching_expression := pattern_var | pattern_call | '_'

pattern_var := (Identifier | '_') ':' (type | '_') ('=' pattern_expression)?
pattern_call := (type | '_') '(' (pattern_argument (',' pattern_argument)*)? ')'
pattern_arguments := (Identifier '->')? pattern_expression
```

## Catch everything

*Catch* scope guard can be used to catch any exception and continue
the execution of the program. In the following example, the **`main`**
function calls the **`foo`** function, that throws an
**`&AssertError`**. The call is guarded by a catch expression, that
catch every kind of **`Exception`** (using the **`_`** token). Because
the exception of the **`foo`** function is caught the **`main`**
function is considered safe, and thus cannot throw an exception, this
is why nothing is declared in its prototype. In this example, the
program ends normaly, after exiting the **`main`** function.

```ymir
import std::io;

def foo (i : i32) 
	throws &AssertError
{
	assert (i < 10, "i must be lower than 10");
	println (i);
}

def main () {
	println ("Before foo");
	{ 
		foo (10); 
	} catch {
		_ => {
			println ("Foo failed");
		}
	}
	println ("After foo");
}
```

<br>

Results: 

```
Before foo
Foo failed
After foo
```

<br>

A variable pattern can also be used to get the value of the
exception. There is no much change in the following example, in
comparison to the previous one, except that the **`main`** function
prints the exception that has been throw by the **`foo`** function. In
*debug* mode (*-g* option of the compiler), when throwing an
exception, the stack trace is accessible and printed, when printing an
exception. This stack trace (for efficiency reasons) is not created in
*release* mode.

```ymir
import std::io;

def foo (i : i32) 
	throws &AssertError
{
	assert (i < 10, "i must be lower than 10");
	println (i);
}

def main () {
	println ("Before foo");
	{ 
		foo (10); 
	} catch {
		err : _ => {
			println ("Foo failed : ", err);
		}
	}
	println ("After foo");
}
```

<br>

Results: 
```
Before foo
Foo failed : core::exception::AssertError (i must be lower than 10):
╭  Stack trace :
╞═ bt ╕ #1 in function core::exception::AssertError::self (...)
│     ╘═> /home/emile/ymir/Runtime/midgard/core/exception.yr:49
╞═ bt ╕ #2 in function core::exception::abort (...)
│     ╘═> /home/emile/ymir/Runtime/midgard/core/exception.yr:84
╞═ bt ╕ #3 in function main::foo (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:7
╞═ bt ╕ #4 in function main (...)
│     ╘═> /home/emile/Documents/test/ymir/main.yr:14
╞═ bt ╕ #5
│     ╘═> /lib/libgyruntime.so:??
╞═ bt ╕ #6 in function main
│     ╘═> /home/emile/Documents/test/ymir/main.yr:10
╞═ bt ╕ #7
│     ╘═> /lib/x86_64-linux-gnu/libc.so.6:??
╞═ bt ═ #8 in function _start
╰
After foo
```

## Catch a specific exception

The content of a *catch* scope guard is a list of patterns, that can
be used to get a different behavior for different kind of
exception. In the following example, the **`foo`** function, can throw
two different kind of exception, **`&AssertError`** and
**`&OutOfArray`**. The *catch* of the **`main`** function has a
different behavior if the exception that is thrown is a
**`&AssertError`** or a **`&OutOfArray`**, (by using a variable pattern
for **`&AssertError`**, and a call pattern for **`&OutOfArray`**).

```ymir
import std::io;

def foo (i : [i32]) 
	throws &AssertError, &OutOfArray
{
	assert (i [0] < 10, "i[0] must be lower than 10");
	println (i);
}

def main () {
	println ("Before foo");
	{ 
		foo ([]); 
	} catch {
	    err : &AssertError => {
			println ("Foo failed : ", err);
	    }
		OutOfArray () => {
			println ("Foo failed, the slice was empty");
		}
	}
	println ("After foo");
}
```

<br>

Results: 

```
Before foo
Foo failed, the slice was empty
After foo
```

<br>

## Rethrowing exceptions

*Catch* scope guard must catch every exceptions that are thrown by the
scope that is guarded. For example, if the **`main`** function of the
previous example, was defined as presented in the next code block, the
compiler would have returned an error. Indeed, in this example, the
**`&OutOfArray`** exception is not managed by the *catch* guard.

```ymir
def main () {
	println ("Before foo");
	{ 
		foo ([]); 
	} catch {
	    err : &AssertError => {
			println ("Foo failed : ", err);
	    }
	}
	println ("After foo");
}
```

<br>

Errors:
```error
Error : the exception &(core::array::OutOfArray) might be thrown but is not caught
 --> main.yr:(13,7)
13  ┃ 		foo ([]); 
    ╋ 		    ^
    ┃ Note : 
    ┃  --> main.yr:(14,4)
    ┃ 14  ┃ 	} catch {
    ┃     ╋ 	  ^^^^^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

The **`OutOfArray`** exception can be rethrown inside the *catch*
scope guard to remove this error. In that case the stack trace is
still correct, as it is created by the constructor of the
**`Exception`** class.

```ymir
def main () 
	throws &OutOfArray
{
	println ("Before foo");
	{ 
		foo ([]); 
	} catch {
	    err : &AssertError => {
			println ("Foo failed : ", err);
	    }
		x : &OutOfArray => throw x;
	}
	println ("After foo");
}
```

## Catch as a value

In some cases (many cases), a scope is used to compute a value. In
that circumstance, if an error occurs inside the scope, the value of
the scope is not set, and cannot be used. For example, in the
following source code, the **`main`** function tries to initialize a
variable from the value of the **`foo`** function. This function is
not safe, and might return no value at all. In order to guarantee,
that the variable **`x`** is initialized, and usable no matter what
happened in the **`foo`** function, the *catch* scope guard can be
used as the default value. This is presented as well at line **`21`**
to initialize the variable **`y`**.


```ymir
import std::io;

def foo (i : i32) 
	throws &AssertError
{
    assert (i < 10, "i[0] must be lower than 10");
    i + 12
}

def main ()
{
    {
        let x = foo (10); 
		println (x);
    } catch {
        _ => {
            println ("Foo failed");
        }
    }

    let y = {
        foo (10)
    } catch {
        _ => {
            42
        }
    }

    println (y);
}
```

<br>

Results: 

```
Foo failed
42
```

<br>

Because, the *catch* scope guard is a pattern matching, multiple
branch can be entered. In that case, every branch of the *catch* guard
must share the same type. In the following example, the value **`y`**
is set conditionaly, depending on the type of exception that is thrown
by the **`foo`** function, or if the function **`foo`** succeeds. In
this example, the **`foo`** function throws a **`&OutOfArray`**
exception, thus the variable **`y`** is set to **`42`** (value
computed at line **`19`**).

```ymir
import std::io;

def foo (i : [i32]) -> i32
	throws &AssertError, &OutOfArray
{
    assert (i[0] < 10, "i[0] must be lower than 10");
    i[0] + 12
}

def main ()
{
    let y = {
        foo ([])
    } catch {
        AssertError () => {
            11
        }
        OutOfArray () => {
            42
        }
    }

    println (y);
}
```

<br>

Results: 

```
42
```

## Catch along other scope guards

*Catch* scope guards can be used along other scope guards, (*success*,
*failure* and *exit*), but there can be only one *catch* scope guard
per scope . In that case the priority is the following: 1) *failure*,
2) *catch*, 3) *exit*. If there is a *success* scope guard that is
executed, then the *catch* scope guard cannot be executed, so the
priority over these two guards is not defined.

```ymir
import std::io;

def foo (i : [i32]) 
	throws &AssertError, &OutOfArray
{
	assert (i [0] < 10, "i[0] must be lower than 10");
	println (i);
}

def main ()
{
	println ("Before foo");
	{ 
		foo ([]); 
	} catch {
		err : &AssertError => {
			println ("Foo failed : ", err);
	    }
		_ : &OutOfArray => {
			println ("Out");
		}
	} success {
		println ("Succ");
	} failure {
		println ("Fails");
	} exit {
		println ("Exit");
	}
	println ("After foo");
}
```

<br>

Results:

```
Before foo
Fails
Out
Exit
After foo
```

<br>

The behavior is exactly the same when *catch* scope guard has a value.

```ymir
import std::io;

def foo (i : [i32]) -> i32
	throws &AssertError, &OutOfArray
{
    assert (i[0] < 10, "i[0] must be lower than 10");
    i[0] + 12
}

def main ()
{
    let y = {
        foo ([])
    } catch {
        AssertError () => {
            println ("Assert");
            11
        }
        OutOfArray () => {
            println ("Out");
            42
        }
    } failure {
        println ("Fails");
    } exit {
        println ("Exit");
    }

    println (y);
}
```

<br>

Results: 

```
Fails
Out
Exit
42
```
