# Template values

In the previous chapter, we saw that some values can be known at the
time of compilation. These values can be used for the compiler to
decide which part of the code should be compiled and which part should
not, using branching operations.

## Compile time condition

The keyword **`cte`** is used to inform the compiler that a value can
be known at compile time, and must be evaluated during the
compilation. It is not the default behavior of the compiler, as the
compilation would be extremely long, if every values had to be
checked. This keyword can be used on *if expression* to execute the
condition at compile time, and evaluate compile only a part of the
source code. In the following example, an *if expression* is used to
check if the template value that is passed to the **`foo`** function
was lower than **`10`**. Because it is the case only the scope of the
*if expression* is compiled (not the scope of the *else*), that is why
even if the scope of the *else* part has no sense in term of types,
the compiler does not return any error.

```ymir
import std::io;

def foo {X : i32} () {
	cte if X < 10 {
		println ("X is < 10 : ", X);
	} else {
		println (X + "foo");
	}
}

def main () {
	foo!{2} ();
}
```

<br>
Results: 

```
X is < 10 : 2
```

<br> As normal *if expression*, *cte if expression* can be chained,
however the keyword *cte* must be repeated before each *if expression*
otherwise the compiler consideres that they are execution time *if
expression*.

```ymir
import std::io;

def foo {X : i32} () {
	cte if X < 10 {
		println ("X is < 10 : ", X);
	} else cte if X < 25 {
		println ("X is < 25 : ", X);
	} else {
		println ("X is > 25 : ", X);
	}
}

def main () {
	foo!{2} ();
	foo!{14} ();
	foo!{38} ();
}
```

<br>

```
X is < 10 : 2
X is < 25 : 14
X is > 25 : 38
```

## Is expression

The *is expression* (that must not be confused with the *is operator*
applicable only on pointers) is used to check template specialization,
and gives a *cte bool value*. The syntax of the *is expression* is
similar to the syntax of a template call, following by template
parameters, as presented in the following code block. The template
parameters are used to create a specialization from the template
arguments.

```grammar
is_expression := 'is' '!' (single_arg | multiple_args) '{' (template_parameter (',' template_parameter)*)? '}'
```

<br>

In the following example, the **`foo`** function accepts any kind of
type as template parameter, and a *cte if expression* is used to apply
a different behavior depending on the type of **`X`**. The first test
at line **`1`** works if the **`X`** is a **`i32`**, the second at
line **`2`** works if **`X`** is a slice of anything.

```ymir
import std::io;

def foo {X} () {
	cte if is!{X} {T of i32} {
		println ("Is a i32");
	} else cte if is!{X} {T of [U], U} {
		println ("Is a slice");
	} else cte if is!{X} {T of [U; N], U, N : usize} {
		println ("Is a static array");
	} else {
		println ("I don't know ...");
	}
}

def main () {
	foo!i32 ();
	foo![i32] ();
	foo![i32 ; 4us] ();
	foo!f32 ();
}
```

<br>
Results: 
```
Is a i32
Is a slice
Is a static array
I don't know ...
```

## Condition on template definition

Every template symbol can have a complex condition that is executed at
compilation time. This condition is executed when all the template
parameter have been infered, and can be used to add further test on
the template parameters that cannot be done by the syntax provided by
*Ymir* (for example accept either a **`i32`** or a **`i64`**). The
test is defined using the **`if`** keyword followed by an expression,
the value of the expression must be known at compilation time. In this
expression the template parameters can be used. The **`if`** keyword
always followes the keyword that is used to declare the symbol
(**`def`** for function, **`class`** for classes, etc.), unlike the
template parameters that always follow the identifier of the symbol.

```ymir
class if (is!T {U of i32}) A {T} {
    let value : T;

    pub self if (is!U {J of T}) {U} (v : U) with value = v {}
}

struct if (is!T {U of f64})
| x : T
-> S {T};
 
enum if (is!T {U of f64})
| X = cast!T (12)
-> F {T};

mod if (is!T {U of f64}) Inner {T} {
    pub def foo (a : T) {
        println (a);
    }
}

trait if (is!T {U of f64}) Z {T} {
    pub def foo (self, a : T)-> T;
}

aka if (is!T {U of f64}) X {T} = cast!T (12);
```

<br>

In the following example, the function **`foo`** have a simple
template specialization, but only accepts **`i32`** or **`i64`**
types, thanks to the condition test. Because **`u64`** is not
accepted, the compiler throws an error due to line **`10`**.

```ymir
import std::io;

def if (is!{X}{T of i32} || is!{X}{T of i64}) foo {X} (x : X) {
	println (x);
}

def main () {
	foo (12);
	foo (12i64);
	foo (34u64);
}
```

<br>
Errors:
```error
Error : the call operator is not defined for foo {X}(x : X)-> void and {u64}
 --> main.yr:(10,6)
10  ┃ 	foo (34u64);
    ╋ 	    ^     ^
    ┃ Note : candidate foo --> main.yr:(3,47) : foo {X}(x : X)-> void
    ┃     ┃ Error : the test of the template failed with {X -> u64} specialization
    ┃     ┃  --> main.yr:(3,26)
    ┃     ┃  3  ┃ def if (is!{X}{T of i32} || is!{X}{T of i64}) foo {X} (x : X) {
    ┃     ┃     ╋                          ^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

Template symbol with condition have a the same score than template
with the same template specialization but without a condition. For
that reason, in the following example, the call of **`foo`** at line
**`12`** create an error by the compiler. To avoid this error, the
reverse test must be added to the function **`foo`** defined at line
**`7`**.


```ymir
import std::io;

def if (is!{X}{T of i32} || is!{X}{T of i64}) foo {X} (x : X) {
	println ("First : ", x);
}

def foo {X} (x : X) {
    println ("Second : ", x);
}

def main () {
	foo (12);
}
```

<br>
Errors:
```error
Error : {foo {X}(x : X)-> void, foo {X}(x : X)-> void} x 2 called with {i32} work with both
 --> main.yr:(12,6)
12  ┃ 	foo (12);
    ╋ 	    ^
    ┃ Note : candidate foo --> main.yr:(3,47) : main::foo(i32)::foo (x : i32)-> void
    ┃ Note : candidate foo --> main.yr:(7,5) : main::foo(i32)::foo (x : i32)-> void
    ┗━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

## Common tests

The module **`std::traits`** of the standard library defines some
*cte* function that can be used to add more complex test of the type
in template condition. 

| Function | Result |
| --- | --- | 
| **`isFloating`** | true for **`f32`** and **`f64`** |
| **`isIntegral`** | true for any integral types (signed and unsigned) |
| **`isSigned`** | true for any integral types that are signed |
| **`isUnsigned`** | true for any integral types that are unsigned |
| **`isChar`** | true for **`c8`** and **`c32`** |
| **`isTuple`** | true for any tuple type |

```ymir
import std::io, std::traits;

def if (isIntegral!{T} ()) foo {T} () {
	println ("Accept any integral type");
}

def if (isFloating!{T} ()) foo {T} () {
	println ("Accept any floating type");
}

def main () {
	foo!i32 ();
	foo!u64 ();
	foo!f32 ();
}
```

<br>
Results:
```
Accept any integral type
Accept any integral type
Accept any floating type
```
