# Template values

In *Ymir*, templates are seen as compilation time execution
parameters. These parameters can be either types or values. When
dealing with values, as with any values, decisions and program
branching can be made, but because these values are known at
compilation time, the decisions can also be made at compilation
time. This system is called *compilation time execution* or *cte* for
short. The keyword **`cte`** is used to ensure that a part of the code
is executed at compilation time, and generates a value (that can be
**`void`**) at compilation as well, to save time at execution time and
have a better optimized executable.

## Compilation time values

Basically, every values can be known at compilation time as long as
they do not implies variable, or dynamic branching. For example, the
value of the **`foo`** function in the following source code can be
knwon at compilation time. Indeed, it implies only constants, that can
be computed by the compiler directly. The **`main`** function uses the
keyword **`cte`** to force the compiler to call the function **`foo`**
during the compilation. If the keyword is omitted then the function
**`foo`** is called at execution time.

```ymir
import std::io;

def foo () -> i32 {
	bar () + baz ()
}
	
def bar () -> i32 
	12
	
def baz () -> i32
	30
	
def main () {
	let z = cte foo ();
	println (z);
}
```

<br> To verify that the *compilation time execution* effectively
happened, the option **`-fdump-tree-gimple`** can be used. This option
creates alternative files, that give information about the
compilation, and can be used to see what the frontend of the *Ymir*
compiler gave to the **gcc** compiler (source code close the *C
language*). The following block of code presents a part of the content
of this file. One can note that the **`main`** function does not call
the **`foo`** function, but only the **`println`** function with the
value **`42`**.

```
main ()
{
  {
    signed int z;

    z = 42;
    _Y3std2io11printlnNi327printlnFi32Zv (z);
  }
}
```

## Values as template parameter

We have seen in the previous chapter that templates parameters are
used to accept types. They also can be used to accept values, in that
case the syntax - described in the following code block - is a bit
different. The syntax for template values is close to variable
declaration, using the token **`:`**, or by using directly the literal
that is accepted.

```grammar
template_value := literal | Identifier ':' (Identifier | type) ('=' literal)?
```

### Template literal

A literal that can be known at compilation time can be used to make a
template specialization. The types that can be knwon at compilation
time are the following :

- string ([c8] or [c32])
- char (c8 or c32)
- integer (signed or unsigned)
- float

**Contribution**: tuple, and struct are not compilation time knowable,
but this seems possible if they only contains *cte* values, same for
slice that are not strings.

In the following example, there are three different definition of the
function **`foo`**. The first one at line **`3`** can be called using
a the *cte* value **`3`**, the second one at line **`8`** using the
value **`2`**, and so on. The **`main`** function calls the function
**`foo`** using the value **`5 - 2`**, so the first definition at line
**`3`** is used.

```ymir
import std::io;

def foo {3} () {
    println ("3");
    foo!2 ();
}

def foo {2} () {
    println ("2");
    foo!1 ();
}

def foo {1} () {
    println ("1");
    foo!0 ();
}

def foo {0} () {
    println ("Go !");
}

def main () {
    foo!{5 - 2} ();
} 
```

<br>
Results: 

```
3
2
1
Go !
```

<br>

Literal string can also be used as template parameter. We will see in
a forthcoming chapter that those are used for operator overloading
(*cf*. [Operator
overloading](https://gnu-ymir.github.io/Documentations/en/templates/operators.html)). A
simple example is presented in the following source code, where the
**`foo`** function accepts the literal **`Hi I'm foo !`**, and is called
by the **`main`** function using different ways.


```ymir
import std::io;

def foo {"Hi I'm foo !"} () {
	println ("Yes that's true !");
}

def bar () -> [c32] {
	"I'm foo !"
}

def main () {
	foo!"Hi I'm foo !" ();
	foo!{"Hi " ~ bar ()} (); 
}
```

<br>
Results: 

```
Yes that's true !
Yes that's true !
```

### Template variable

Because it would be utterly exhausting to write every definitions of
the template function with every possible literals (and even
impossible when dealing with infinite types such as slice), we
introduced the possibilty of writing template variables. Unlike real
variables those are evaluated at compilation time, and can be defined
only inside template parameters. The definition syntax of template
variable is close to the definition of a standard parameter, with the
difference that the type can be a template type (containing root
identifiers, foundable inside the template parameters). The following
example presents the definition of a function that make a countdown to
**`0`** (the generalization of the function **`foo`** presented in the
first example of the previous section). For the recursivity to stop,
the definition of a final case is mandatory, here it is achieved by
the function **`foo`** at line **`8`**.

```ymir
import std::io;

def foo {n : i32} () {
	println (n);
	foo!{n - 1} ();
}

def foo {0} () {
	println ("Go !");
}

def main () {
	foo!12 ();
}
```

<br>
Results:

```
12
11
10
9
8
7
6
5
4
3
2
1
Go !
```

<br>

**Limitation**: to avoid infinite loops, the compiler uses a very
simple verification. It is impossible to make more that **`300`**
recursive call. For that reason, make the following call **`foo!300
()`** is impossible and generate a compilation error :

```error
Error : undefined template operator for foo and {300}
 --> main.yr:(13,5)
13  ┃ 	foo!300 ();
    ╋ 	   ^
    ┃ Error : undefined template operator for foo and {300}
    ┃  --> main.yr:(13,5)
    ┃ 13  ┃ 	foo!300 ();
    ┃     ╋ 	   ^
    ┃     ┃ Note : in template specialization
    ┃     ┃  --> main.yr:(13,5)
    ┃     ┃ 13  ┃ 	foo!300 ();
    ┃     ┃     ╋ 	   ^
    ┃     ┃ Note : foo --> main.yr:(3,5) -> foo
    ┃     ┃ Error : undefined template operator for foo and {299}
    ┃     ┃  --> main.yr:(5,5)
    ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃ Error : undefined template operator for foo and {299}
    ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃      : ...
    ┃     ┃     ┃     ┃ Note : there are other errors, use option -v to show them
    ┃     ┃     ┃     ┃ Error : undefined template operator for foo and {2}
    ┃     ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃     ┃ Note : in template specialization
    ┃     ┃     ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃     ┃ Note : foo --> main.yr:(3,5) -> foo
    ┃     ┃     ┃     ┃     ┃ Error : undefined template operator for foo and {1}
    ┃     ┃     ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃     ┃     ┃ Error : undefined template operator for foo and {1}
    ┃     ┃     ┃     ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃     ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃     ┃     ┃     ┃ Note : in template specialization
    ┃     ┃     ┃     ┃     ┃     ┃     ┃  --> main.yr:(5,5)
    ┃     ┃     ┃     ┃     ┃     ┃     ┃  5  ┃ 	foo!{n - 1} ();
    ┃     ┃     ┃     ┃     ┃     ┃     ┃     ╋ 	   ^
    ┃     ┃     ┃     ┃     ┃     ┃     ┃ Note : foo --> main.yr:(3,5) -> foo
    ┃     ┃     ┃     ┃     ┃     ┃     ┃ Error : limit of template recursion reached 300
    ┃     ┃     ┃     ┃     ┃     ┃     ┃  --> main.yr:(3,5)
    ┃     ┃     ┃     ┃     ┃     ┃     ┃  3  ┃ def foo {n : i32} () {
    ┃     ┃     ┃     ┃     ┃     ┃     ┃     ╋     ^^^
    ┃     ┃     ┃     ┃     ┃     ┃     ┗━━━━━┻━ 
    ┃     ┃     ┃     ┃     ┃     ┗━━━━━┻━ 
    ┃     ┃     ┃     ┃     ┗━━━━━┻━ 
    ┃     ┃     ┃     ┗━━━━━┻━ 
    ┃     ┃     ┗━━━━━┻━ 
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br> **Contribution**: add an option to the compiler to change this
value of **`300`**.

### Template type for template variable

The type of a *cte* variable can be a template. In that case the used
template identifiers must be roots of the template parameters (exactly
the same behavior as the *of filter*). In the following example, the
function **`foo`** takes a value as template parameter, the type of
this value can be anything as long as it can be known at compile time.

```ymir
import std::io;

def foo {N : T, T} () {
    println (T::typeid, "(", N, ")");
}

def main () {
    foo!42 ();
    foo!"Hi !" ();
}
```

<br>
Results: 

```
i32(42)
[c32](Hi !)
```

<br> Compilation time values, can also be used to get the size of a
static array at compilation time, and make a template function that
accepts arrays of any size. This evidently works only on static
arrays, and not on slice, because the size of the array has to be
knwon at compilation time. However, this would not be necessary when
using slice, because function accepting slice as parameter already
accepts slices of any size.

```ymir
import std::io

def foo {ARRAY of [T; N], T, N : usize} (a : ARRAY) {
    println ("Got an array of ", T::typeid, " of size : ", N);
    println (a);
}

def main () {
    let array = [0; 10u64];
    foo (array);
}
```

<br>
Results: 

```
Got an array of i32 of size : 10
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

## Function pointers

Lambda functions and function pointers can be compile time knwon
values. This is not the case for closure, and method delegates. Unlike
function pointers, template function are statically written in the
generated executable, thus more efficient (even if we are talking of
marginal gain). To accept a function pointer, a template variable must
be defined in the template parameters. In the following example, the
function **`foo`** accepts a function pointer, that takes two
parameters, and return a value of the same type of the
parameters. This type seems to be unknown and is not inferable from
the lambda function that is passed to the function at line **`13`**,
but is infered from the execution time parameters passed to the
function. At line **`14`**, one can note that a standard function can
be used as a template variable.

```ymir
import std::io;


def foo {F : fn (X, X)-> X, X} (a : X, b : X) {
	println ("Foo : ", F (a, b));
}

def bar (a : i32, b : i32) -> i32 {
	a * b
}

def main () {
	foo!{|x, y| => x + y} (11, 31);
	foo!bar (6, 7);
}
```

<br>
Results

```
Foo : 42
Foo : 42
```

<br> In the following example, the function pointer this time return a
different type from the type of the parameters it takes. This function
**`foo`** applies this function pointer to all element of the slice it
takes as parameters.

```ymir
import std::io;

def foo {F : fn (X)-> Y, X, Y} (a : [X]) {
	for i in a {
		println ("Foo : ", F (i));
	}
}

def main () {
	foo!{|x| => cast!i64 (x) + 12i64} ([1, 2, 3]);
}
```

<br>
Results:

```
Foo : 13
Foo : 14
Foo : 15
```
