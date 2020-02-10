# Templates 

The templates system provide the possibility to reuse source code,
that is valid for multiple types. The template system of **Ymir** is
powerful, and allows you to generate code, that will be used
many times for many purpose, by writting minimal source code. 

## Template argument syntax

The template arguments are declared using the token `!`, followed by
one are multiple arguments, enclosed inside parentheses. Template
arguments are elements that must be known by the compiler at compile
time, in order to produce the template specialization and symbol
definition. 

```ymir
foo!i32 (12); // One template argument (i32)
foo!(i32, f64) (12); // Two template arguments
```

When the arguments, are also template, the parentheses are mandatory
even if there is only one parameter, to avoid ambiguity.

```ymir
foo!(foo!i32) (); // Ok
foo!foo!i32 (); // No
```

## Template definition syntax

Multiple symbols in **Ymir** can be templates. Every template symbol
has a name, and the template parameters are following that name. For
example, function can be templates :

```ymir
def foo (T) (a : T) {
}
```

In the above example, we can see two set of parentheses, the first one
define the template parameters, and the second one the parameters of
the function `foo`. Structure, class, enum and internal modules, can
also be templates.

```ymir
class A (T) {
	let value : T;
	// ...
}

struct 
| x : T
-> S (T);

enum 
| X = cast!T (12)
-> F (T);

mod Inner (T) {
	pub def foo (a : T) {
		// ...
	}
}
```

## Template instanciation

When a template symbol is defined, and the syntax of template call is
used, a specialization is performed. The symbol, that match the most
the template arguments to the template parameter is chosen, and
instanciated. 

```ymir
import std::io;

def foo (T) (a : T) {
	println (a);
}
	
def main () {
	foo!(i32) (12);
}
```

When the template symbol is a function, it can happened that the
template parameters can be infered from the parameters of the
function. For example in the above example, there is no need to
specify a template call, and you can write as follows :

```ymir
import std::io;

def foo (T) (a : T) {
	println (a);
}
	
def main () {
	foo (12); // T, will be infered to i32
	foo ("Hi !!"); // T, will be infered to [c32]
}
```

This cannot be done for class, structure or module. However, there is
a work in progress to implement that behavior for structure and class.

When a template call is made on a function that take only one
argument, you can use the DotCall syntax and forget the parameter
parentheses. This can be used to simplify the syntax that is obvious
anyway.

```ymir
def foo (T, X) (_ : X) {
}

def main () {
	(12).foo!i32; 
	// It is exaclty the same as : 
	// (12).foo!(i32) (); 
}
```

You can note that only one argument has been passed to the template
function. The second one is optionnal, since it can be infered from
the function parameter. If the function definition was `foo (X, T)
(_ : X)`, the inference could no more be done, the template call is
checked first, so X will be set to `i32`, and `T` could not be infered
from anything, so you should get the following error :

```
Error : call operator is not defined for type none and {i32}
 --> main.yr:(5,6)
    | 
 5  | 	(12).foo!i32; 
    | 	    ^
    | Note : candidate foo --> main.yr:(1,5) : none
    | Error : unresolved template
    |  --> main.yr:(1,13)
    |     | 
    |  1  | def foo (X, T) (_ : X) {
    |     |             ^
    |------------------------------ 

ymir1: fatal error: 
compilation terminated.
```
