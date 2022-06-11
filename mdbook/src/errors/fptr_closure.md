# Function pointer and closure

It is impossible to create a function pointer or closure from a
function that can throw exceptions. Indeed, because funtion pointers
type definition does not include the possibility to throw exception
(and will not for verbosity, and annoyance reason), the *Ymir*
language does not allow them to throw exception, in order to keep the
guarantee of safety introduced by exception rethrowing. For that
reason, the following example is not accepted by the compiler.


```ymir
import std::io;


def main () {
    let x = |i : i32| => {
        assert (i < 10, "i must be lower than 10");
        println (i);
    };
        
     x (10);
}
```

<br>
Errors: 

```error
Error : a lambda function must be safe, but there are exceptions that are not caught
 --> main.yr:(5,13)
 5  ┃     let x = |i : i32| => {
    ╋             ^
    ┃ Note : &(core::exception::AssertError)
    ┃  --> main.yr:(6,9)
    ┃  6  ┃         assert (i < 10, "i must be lower than 10");
    ┃     ╋         ^
    ┗━━━━━┻━ 

Error : undefined symbol x
 --> main.yr:(10,6)
10  ┃      x (10);
    ╋      ^


ymir1: fatal error: 
compilation terminated.
```

<br> 

To avoid that problem, every exception must be caught inside the lambda function.

## Create function pointer from unsafe function

Sometimes it can be usefull to create function pointer from functions
that are not safe (for example the function **`foo`** in the following
example). To do that, the core modules, define a template function
(*cf*. [Templates](https://ymir-lang.org/templates/),
named **`toOption`** that transform a function symbol, into another
function symbol that returns an option value. This other function
symbol can be used to create a function pointer, using the ampersand
(**`&`**) unary operator.

```ymir
import std::io;

def foo (i : i32)-> void
    throws &AssertError
{
    assert (i < 10, "i must be lower than 10");
    println (i);
}


def main () {
    let x = & (toOption!foo);
	println (x (10));
	println (x (3));
}
```

<br>

Results: 

```
Err(core::exception::AssertError (i must be lower than 10))
3
Ok()
```

<br>


*Contribution* This is not possible for method delegate. 
