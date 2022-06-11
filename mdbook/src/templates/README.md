# Templates 

The templates system provide the possibility to reuse source code,
that is valid for multiple types. The template system of *Ymir* is
powerful, and allows the generation of code, that will be used many
times for many purpose, by writting minimal source code, and
conditional compilation. Templates is a main part of the *Ymir*
language, and almost everything in the standard library is written
using templates. It is important to understand the template system, to
use the language.

## Template definition syntax

Multiple symbols in *Ymir* can be templates. Every template symbol has
a name, and the template parameters are following that name enclosed
between curly brackets (this time they are always mandatory). For
example, a function can be a template, as it can be seen in the
following example. In this example, the function **`foo`** takes a
type as template parameter, and this type is named **`T`** in the
function symbol, and is used as the type of the first parameter of the
function (i.e. the type of the parameter **`a`**). By convention, the
identifiers of the template parameters are in upper case, however that
is not mandatory.

```ymir
def foo {T} (a : T) {
	println (a);
}
```

<br>

Other symbols can also be templates. These symbols are : 
- Classes
- Structures
- Enumerations
- Local modules
- Traits
- Aka

The templates arguments always follows the name of the symbol. In the
following example, templates are defined for various symbols.

```ymir
class A {T} {
	let value : T;
	
	pub self (v : T) with value = v {}
}

struct 
| x : T
-> S {T};

enum 
| X = cast!T (12)
-> F {T};

mod Inner {T} {
	pub def foo (a : T) {
		println (a);
	}
}

trait Z {T} {
	pub def foo (self, a : T)-> T;
}

aka X {T} = cast!T (12);
```

<br>

## Template argument syntax

The *template call* syntax is declared using the token `!`, followed
by one are multiple arguments, enclosed inside curly
brackets. Template arguments are elements that must be known by the
compiler at compile time, in order to produce a valid template
specialization and create a symbol that can be used and is fully
validated (i.e. where every types are correctly defined). The
following code block present the syntax of the *template
call*. *Template call* is a high priority expression, that has a even
higher level of priority than the **`::`** operator, and unary
operators. Operator priority is presented in the chapter [Operator
priority](https://ymir-lang.org/primitives/operator.html).

```grammar
template_call := expression (single_arg | multiple_args) 
single_arg := '!' expression 
multiple_args := '!' '{' (expression | template_call) (',' (expression | template_call))*)? '}'
```

<br>

And the following code block presents example of *template call* on a
function named **`foo`**.

```ymir
foo!i32 (12); // One template argument (i32)
foo!(i32, f32) (12); // One template tuple (i32, f32)
foo!{i32, f64} (12); // Two template arguments, types i32 and f64
```

<br>

When the arguments, are also template, the curly brackets are
mandatory even if there is only one parameter, to avoid ambiguity.

```ymir
foo!{foo!i32} (); // Ok
foo!foo!i32 (); // No
```

<br>

### Template instanciation

When a template symbol is defined, the *template call* is used to
reference it, and make a specialization. The arguments used in the
*template call* are associated to the template parameters of the
template symbol, in the order they are defined. In the following
example, a function **`foo`** has a template argument, that must be a
type, and is named **`T`**. The **`main`** function use the *template
call* syntax to use that symbol, and associate to **`T`** the type
**`i32`**. The symbol with a **`i32`** is then created by the
compiler, and the **`main`** function calls it using the standard call
syntax using the parentheses operator.

```ymir
import std::io;

def foo {T} (a : T) {
	println (a);
}
	
def main () {
	foo!i32 (42);
}
```

<br>

Results: 

```
42
```

<br>

When the template symbol is a function, it can happened that the
template parameters can be infered from the parameters of the
function. For example in the above example, there is no need to
specify a *template call*, and the *standard call* expression is
sufficient.

```ymir
import std::io;

def foo {T} (a : T) {
	println (a);
}
	
def main () {
	foo (42); // T, is infered as i32
	foo ("Hi !!"); // T, is infered as a [c32]
}
```

<br>
Results: 

```
42
Hi !!
```

<br>

This cannot be done for structure or module. However, this is possible
to do on classes, and this will be presented a little later, in the
following section of the chapter. 

We have seen in the chapter about
function (*cf*.
[Functions](https://ymir-lang.org/primitives/functions.html)),
the *uniform call syntax*. This syntax is also applicable on template
functions. In the following example, a function that takes two types
as template parameters is called in the **`main`** function.

```ymir
import std::io;

def foo {T} (a : T) {
	println (a);
}

def main () {
	(42).foo (); 
}
```

### Multiple template parameters

As said earlier the parameters are specialized using the arguments of
the *template call* syntax in the order they are presented. For
example, in the following example, the *template call* syntax at line
**`1`** creates a symbol where **`T=i32`**, and **`U=f64`**.

```ymir
def foo {T, U} () {}

def main () {
	foo!{i32, f64} ();
}
```

<br>

It is not necessary to put all the argument in the other template
parameters can be infered from the previous template arguments, or by
the parameters of the function. We will see in a next chapter some way
to determine the kind of type that can be used in a template symbol,
but briefly in the following example, the **`foo`** function only
accepts types that are slices of **`U`**, where **`U`** can
be any type. In that case, because **`T`** can be used to infer the
type of **`U`**, there is no need to specify the type of **`U`**
explicitly.

```ymir
import std::io;

def foo {T of [U], U} () {
	println ("T=", T::typeid, " U=", U::typeid);
}

def main () {
	foo![i32] ();
}
```

<br>

Results: 

```
T=[i32] U=i32
```

<br>

The same behavior can be observed when the type can be infered from a
standard parameter of the function. In the following example, the type
**`T`** is defined by the *template call* syntax, but the type **`U`**
is defined by the first argument of the *standard call*. Thus, type
**`T`** is **`i32`**, and type **`U`** is **`f64`**.

```ymir
import std::io;

def foo {T, U} (a : U) {
	println ("T=", T::typeid, " U=", U::typeid, " a=", a, "");
}

def main () {
	foo!i32 (3.14);
}
```

<br>

Results:

```
T=i32 U=f64 a=3.140000
```
<br>

One can note that the type **`T`** cannot be infered from anything
aside the *template call*. Thus it has to be the first template
parameter, otherwise the *template call* would have defined the type
**`U`**. In the following example, the parameter **`T`** and **`U`**
have been reversed, but the call is the same. In that case, the
compiler fails to create a valid symbol and throws an error.

```ymir
import std::io;

def foo {U, T} (a : U) {
	println ("T=", T::typeid, " U=", U::typeid, " a=", a, "");
}

def main () {
	foo!i32 (3.14); // set U to i32, and T cannot be infered
}
```

<br>
Errors (in this error, we can see that **`U`** is set to **`i32`** at line **`10`**, and that the compiler failed to set **`T`**) :

```error
Error : the call operator is not defined for foo {T}(a : U)-> void and {f64}
 --> main.yr:(8,10)
 8  ┃ 	foo!i32 (3.14);
    ╋ 	        ^    ^
    ┃ Note : candidate foo --> main.yr:(3,5) : foo {T}(a : U)-> void
    ┃     ┃ Error : unresolved template
    ┃     ┃  --> main.yr:(3,13)
    ┃     ┃  3  ┃ def foo {U, T} (a : U) {
    ┃     ┃     ╋             ^
    ┃     ┃ Note : for : foo --> main.yr:(3,5) with (U = i32)
    ┃     ┗━━━━━━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

Using the *template call* syntax to set only a part of the template
symbols is named a *two time template validation*. We will see in the
next chapter, that template specialization can be very powerful and
can be used to choose between multiple template symbols. Refering to a
template symbol without using the *template call* syntax can be seen
as a special case of *two time validation*, where the *template call*
is made but with no arguments. 

### Template class instanciation

When a class template is declared, the compiler is sometimes able to
infer the type of the templates from the argument passed to the
constructors. The rule is the same as for function instanciation. In
the following example, the class **`X`** is a template class that
takes two types as template parameters. The **`main`** function
instanciate a **`X`** class at line **`10`** without using the
*template call* syntax. This is possible, because the constructor of
the class at line **`6`** is sufficient to infer the types **`T`** and
**`U`** exactly as it would be done if it was a function
template. Because **`T`** and **`U`** has no restriction any type can
be used.

```ymir
import std::io;

class X {T, U} {
	let x : T, y : U;

	pub self (x : T, y : U) with x = x, y = y {}	
}

def main () {
	let a = X::new (1, 'r');
	let b = X::new ([1, 2], "foo");
	
	println (a::typeinfo.name);
	println (b::typeinfo.name);
}
```

<br>

Results: 

```
main::X(i32,c32)::X
main::X([i32],[c32])::X
```

<br>

A *two time validation* can also be used to set the types of a part of
the template parameters, and let the other be infered by the
constructor call. In the following example, the type **`T`** is set by
the *template call* syntax, and the type **`U`** is infered from the
type of the parameter **`y`** of the constructor (here **`c32`**).

```ymir
import std::io;

class X {T, U} {
	let y : U;

	pub self (y : U) with y = y {}	
}

def main () {
	let x = X!(i32)::new ('r');
	println (x::typeinfo.name);
}
```

<br>

Results: 

```
main::X(i32,c32)::X
```

**Contribution** other template symbols cannot be called without
*template call*. This is normal for modules, traits, and enumeration,
as nothing can be used to infer the types. But structures are called
using arguments, that are used to set the values of the fields, this
is thus possible to infer the templates types in that case. Has to be
done, though.
