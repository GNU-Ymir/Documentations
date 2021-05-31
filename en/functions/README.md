
# Functions 

We have seen in the chapter [Basic programming
concepts](https://gnu-ymir.github.io/Documentations/en/primitives/functions.html)
how functions are written. *Ymir* can be used as a functional
language, thus functions can also be considered as values. In this
chapter we will see more advanced function systems, named function
pointer and closure.

## Function pointer

A function pointer is a value that contains a function. It can be used
for example, to pass a function, as an argument to other
functions. The type of a function pointer is written using the keyword
**`fn`**, and have nearly the same syntax as a function prototype, but
without a name, and without naming the parameters.

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

<br>

In the above example, we have specified that the function **`foo`**
takes a function pointer as first parameter. This function pointer, is
a function that takes an **`i32`** value and return another **`i32`** value.
In the main function, the ampersand (**`&`**) unary operator is used
to transform the function symbol **`addOne`** into a function
pointer. This function pointer is then passed to the function
**`foo`**, which calls it and return its value. 

Results: 

```
42
```

### Function pointer using reference

We have seen that references is not a type, in the chapter [Alias and
References](https://gnu-ymir.github.io/Documentations/en/advanced/references.html). However,
function prototype sometimes takes reference value as parameter. This
must be replicated in the prototype of the function pointer. For that
reason, the **`ref`** keyword can be used in the prototype of a
function pointer type. 

In the following example, the function **`mutAddOne`** change the
value of a reference variable **`x`**, and add one to it. The function
**`foo`** takes a function pointer as first parameter, and calls it on
a mutable local variable **`x`** by reference (it is important). 

```ymir
import std::io

def foo (f : fn (ref mut i32)-> void) -> i32 {
	let mut x = 41;
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

<br>

Results: 

```
42
```

<br>

The prototype of the function pointer must be strictly respected, for
obvious reasons. And as for normal functions, alias and references
must be strictly respected as well. For example, in the follow
example, the function **`foo`** tries to call the function pointer
that takes a reference argument, using a simple value. And the
**`main`** function tries to call the **`foo`** function, with a
function pointer that does not take a reference parameter.

```ymir
import std::io

def foo (f : fn (ref mut i32)-> void) -> i32 {
    let mut x = 41;
    f (x);
    x
}

def mutAddOne (x : i32) {
    println (x);
}

def main () {
    let x = foo (&mutAddOne);
    println (x);
}
```

<br>

We have two errors, first the compiler does not allow an implicit
referencing of the variable **`x`** at line **`5`**, and second the
compiler does not allow an implicit cast of a value of type **`fn
(i32)-> void`** to **`fn (ref mut i32)-> void`**.

```error
Error : the call operator is not defined for &fn(ref mut i32)-> void and {mut i32}
 --> main.yr:(5,7)
 5  ┃     f (x);
    ╋       ^ ^
    ┃ Error : implicit referencing of type mut i32 is not allowed
    ┃  --> main.yr:(5,8)
    ┃  5  ┃     f (x);
    ┃     ╋        ^
    ┃ Note : for parameter i32 --> main.yr:(3,26) of f
    ┗━━━━━━ 

Error : the call operator is not defined for main::foo and {&fn(i32)-> void}
 --> main.yr:(14,17)
14  ┃     let x = foo (&mutAddOne);
    ╋                 ^          ^
    ┃ Note : candidate foo --> main.yr:(3,5) : main::foo (f : &fn(ref mut i32)-> void)-> i32
    ┃     ┃ Error : incompatible types &fn(ref mut i32)-> void and &fn(i32)-> void
    ┃     ┃  --> main.yr:(14,18)
    ┃     ┃ 14  ┃     let x = foo (&mutAddOne);
    ┃     ┃     ╋                  ^
    ┃     ┃ Note : for parameter f --> main.yr:(3,10) of main::foo (f : &fn(ref mut i32)-> void)-> i32
    ┃     ┗━━━━━━ 
    ┗━━━━━┻━ 

Error : undefined symbol x
 --> main.yr:(15,14)
15  ┃     println (x);
    ╋              ^


ymir1: fatal error: 
compilation terminated.
```

## Lambda function 

Lambda functions are anonymous functions that have the same behavior
as normal function, but don't have a name. They are declared using the
token `|` surrounding the parameters instead of parentheses in order
to dinstinguish them from tuple. The following code block presents the
syntax of the lambda functions.


```grammar
lambda_func := '|' (var_decl (',' var_decl)*)? '|' ('->' type)? ('=>')? expression
var_decl := Identifier (':' type)?
```

<br>

The following example shows a simple usage of a lambda function. This
function declared at line **`4`**, and stored in the variable **`x`**,
takes two parameters **`x`** and **`y`** of type **`i32`**, and return
their sum.

```ymir
import std::io

def main () {
	let x = |x : i32, y : i32|-> i32 { 
		x + y
	};
	println (x (1, 2));
}
```
<br>

As one can note, there is no conflict between the variable **`x`**
declared in the function **`main`**, and the first parameter of the
lambda function also named **`x`**. This is due to the fact that the
lambda function does not enclose the context of the function that have
created it. In other words, lambda functions behave as normal local
function, accessible only inside the function that have declared them
(*cf.*  [Scope
declaration](https://gnu-ymir.github.io/Documentations/en/primitives/functions.html#scope-declaration)).

In many cases the type of the parameters and return type can be
infered, and are therefore optional. The above example can then be
rewritten into the following example. In this next example, the lambda
function can be called with any values, as long as the binary addition
(**`+`**) operator is defined between the two values.

```ymir
import std::io

def main () {
	let x = |x, y| x + y;	
	println (x (1, 2));
	
		
	// The types are not given, then you can also write 
	println (x (1.3, 2.9));	
}
```

<br>

The token `=>` can be added after the prototype of the lambda, to make
it a bit more readable. It is just syntaxic and has no impact on the
behavior of the lambda.

```ymir
import std::io

def main () {
	let x = |x, y| => x + y;	
	println (x (1, 2));
}
```

<br>

Lambda functions are directly function pointers, and then can be used
as such without needing the unary ampersand (**`&`**) operator. In the
following example, the function **`foo`** takes a function pointer as
first parameter, and two **`i32`** values as second and third
parameters. This function calls the function pointer twice, and add
the result. A lambda function is used in the **`main`** function as
the first argument for the **`foo`** function.

```ymir
import std::io

def foo (f : fn (i32, i32)-> i32, x : i32, y : i32) -> i32 {
    f (x, y) + f (y, x)
}

def main () {
    let x = (|x, y|=> x * y).foo (3, 7);
	
	// uniform call syntax is used, but you can of course write it as follows : 
	// foo (|x, y| x*y, 3, 7);
    println (x);
}
```

Results: 
```
42
```

<br>

Lambda function that are not typed are special element, that does not
really have a value at runtime, and are closer to *compile time
values* (presented in a future chapter [Compile time
execution](https://gnu-ymir.github.io/Documentations/en/templates/cte.html)).
When the whole type of a lambda cannot be infered by the compiler
(types of the parameters, and the type of the return type), then the
value cannot be passed to a mutable variable. *Ymir* allows to put an
untyped lambda inside an immutable var, to ease its usage, but the
lambda still does not have any value. For that reason, the second line
of the following example is possible, but not the third.

```ymir
def main () {
	let x = |x| x + 1;
	let mut y = x;
}
```

<br>
Errors: 

```
Error : the type mut fn (any)-> any is not complete
 --> main.yr:(2,10)
 2  ┃ 	let x = |x| x + 1;
    ╋ 	        ^
    ┃ Note : 
    ┃  --> main.yr:(3,10)
    ┃  3  ┃ 	let mut y = x;
    ┃     ╋ 	        ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

The same problem happens when an uncomplete lambda function is used as
the value of a function. To resolve the problem, and because the
return type of a function is always complete when the function is
validated (or there were other previous errors), the keyword
**`return`** can be used. Thanks to that statement, the compiler has
additional knowledge, and can infer the type of the lambda function
from the return type of the function.

```ymir
import std::io

def foo () -> fn (i32)-> i32 {
	return |x| => x + 12 // the compiler tries to transform the lambda function into a function pointer fn (i32)-> i32
}

def main () {
	let x = foo ();
	println (x (30));
}
```

**Contribution**: Resolve that problem when it seems obvious, for
example in the previous example, maybe the type of the block can be
infered directly?

## Closure

As said earlier, a lambda function behave like a local private
function, and thus has no access to the context of the function that
have declared it. In the following example, the lambda function
declared at line **`5`** tries to access the variable **`i`** declared
at line **`4`**. This is impossible, the variable **`i`** exists in a
different context that the lambda function.

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

<br>
Errors:

```
Error : undefined symbol i
 --> main.yr:(6,12)
 6  ┃ 		println (i);
    ╋ 		         ^

Error : undefined symbol x
 --> main.yr:(8,2)
 8  ┃ 	x ();
    ╋ 	^


ymir1: fatal error: 
compilation terminated.
```

<br>


Closure are a function pointer that capture the environment of the
function that has declared them. In *Ymir* there is only one kind of
accepted closure, that is called the move closure.

### Copy closure

A copy closure is a special kind of lambda function, that is declared
by using the keyword **`move`** in front of a lambda literal. The
closure as an immutable access to all the variable declared inside the
scope of the parent function. This closure is called a *copy closure*
because the access of the variable is made by copy (a first level copy
*cf.* [Copy and Deep
copy](https://gnu-ymir.github.io/Documentations/en/advanced/copies.html)).
Because closure captures a context in addition to a function pointer,
the simple function pointer type is no more sufficient, and a new type
is introduced. The syntax of the closure type is created with the
keyword **`dg`** instead of **`fn`** (*dg* stands for delegate). A
delegate is a function pointer with an environment, and is the general
case of a closure (we will see in next section, a case of delegate
that are not closure).


In the following example, the *copy closure* declared at line **`9`**
enclosed the scope of the function **`foo`**, and thus has access to
the variable **`i`**. However, the enclosed variable is immutable (and
is a copy).

```ymir
import std::io

def bar (f : dg (i32)-> i32) -> i32 {
	f (12)
}

def foo () {
	let i = 30;
	let x = bar (move |x|=> x + i);
	println (x);
}

def main () {
	foo ();
}
```

<br>

The above source code in the context of the **`foo`** function, can be
illustrated by the following figure.

<br>

<img src="https://gnu-ymir.github.io/Documentations/en/functions/closure.png" alt="drawing" height="500", style="display: block; margin-left: auto;  margin-right: auto;">

<br>

As one can note, the variable **`i`** enclosed in the closure is not
the same as the variable **`i`** of the **`main`** function. This has
two impact: 

- a) *copy closure* can be returned safely from functions,
indeed even when the variable **`i`** does not exist anymore as the
function **`foo`** is exited, a copy of it is still accessible in the
heap (note that this is the same for aliasable types, that are in the
heap in any case). For example: 

```ymir
import std::io;

def foo ()-> dg ()-> i32 {
	let i = 30;
	return (move || => i + 12);
}

def main () {
	let x = foo ();
	println (x ()); // enclosed i does not exists, but thats not a problem
}
```
<br>

Results:

```
42
```

<br>

- b) the value of the enclosed **`i`** is independant
from the value of the variable **`i`** in the **`foo`** function,
meaning that there is no way for the **`foo`** function to change the
value of the variable **`i`** inside the closure after its creation. For example : 

```ymir
import std::io;

def main () {
    let mut i = 30;
    let x = move || => i + 12;
    i = 11; // no impact on the closure of x
    println (x ());    
	
	let y = move || => i + 12;
	println (y ());
}
```

<br>
Results: 

```
42
23
```
<br>

By using aliasable types, this limitation can be bypassed, for example
a slice can be used to enclosed the value of i, and access it from the
closure, without removing the guarantees of the *copy closure*, this
is illustrated in the following example. **Warning**: if you might be
tempted to use a pointer on the **`i`** variable, its highly not
recommended. Indeed, pointing to a local variable remove the guarantee
we introduced earlier in the point (a) - (in general using pointer -
not function pointer - to value is a bad idea, and should be
prohibited outside the std).

```ymir
import std::io;

def main ()
    throws &OutOfArray
{
    let dmut i = [12];
    let x = move || => {
        i[0] + 12
    } catch {
        _ => {
            0
        }
    };
        
    i [0] = 30;
    println (x ());
}
```

<br>

In the above example, the *copy closure* access to the first index of
the slice **`i`**. This is a unsafe operation, the slice can be empty,
this is why a catch is made. Information about catch is not presented
here, and will be discussed in a future chapter [Error
handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html). Here
because the slice is not empty when the closure is called, the access
works.

Results: 

```
42
```

### Method delegate

A method is a function pointer associated with a object instance, then
they can be seen as delegate. The name closure is not used here,
because nothing is really enclosed as in *copy closure* over function
context, so the name *delegate* being a more global term is used. A
delegate is a function operating on an object, for which we don't know
the exact type. 

A method can be transformed into a delegate using the unary ampersand
(**`&`**) operator, on a method associated to an object instance. 

```ymir
import std::io;

class Foo {
    pub let mut i = 0;
    
    pub self () {}
    
    pub def foo (self) -> void {
	println (self.i);
    }
}

def main () {
    let dmut a = Foo::new (), dmut b = Foo::new ();
    let x : (dg ()-> void) = &a.foo;
    let y = &b.foo;
    
    a.i = 89;
    b.i = 42;
    
    x ();
    y ();	
}
```

<br>

Results: 

```
89
42
```


<br>

Unlike *copy closure* a method can have a mutable access to the object
associated to it. In that case, an explicit alias must be made on the
object instance, when creating the delegate, otherwise the compiler
throws an error. 

```ymir
import std::io;

class Foo {
    let mut _i = 0;
    
    pub self () {}
    
    pub def foo (mut self) {
        self._i = 42;
    }

    impl Streamable;
}

def main () {
    let dmut a = Foo::new ();

    let x = &(a.foo);

    x ();

    println (a);

}
```

<br>
Errors:

```error
Error : undefined operator & for type (a).foo
 --> main.yr:(18,13)
18  ┃     let x = &(a.foo);
    ╋             ^
    ┃ Note : candidate foo --> main.yr:(8,13) : (mut self) => main::Foo::foo ()-> void
    ┃     ┃ Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
    ┃     ┃  --> main.yr:(18,13)
    ┃     ┃ 18  ┃     let x = &(a.foo);
    ┃     ┃     ╋             ^
    ┃     ┃     ┃ Note : implicit alias of type mut &(mut main::Foo) is not allowed, it will implicitly discard constant qualifier
    ┃     ┃     ┃  --> main.yr:(18,15)
    ┃     ┃     ┃ 18  ┃     let x = &(a.foo);
    ┃     ┃     ┃     ╋               ^
    ┃     ┃     ┗━━━━━┻━ 
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 

Error : undefined symbol x
 --> main.yr:(20,5)
20  ┃     x ();
    ╋     ^


ymir1: fatal error: 
compilation terminated.
```

<br>

This can be easily resolved by aliasing the variable **`a`** when
creating the delegate. Either by using the keyword **`alias`**, or by
using the **`:.`** binary operator.

```ymir
import std::io;

class Foo {
    let mut _i = 0;
    
    pub self () {}
    
    pub def foo (mut self) {
        self._i = 42;
    }

    impl Streamable; // to make the type printable
}

def main () {
    let dmut a = Foo::new ();
    let x = &(a:.foo); // or &((alias a).foo);

    x ();

    println (a);
}
```

<br>

Results:
```
main::Foo(42)
```
