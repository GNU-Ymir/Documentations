# Template specialization

We have seen in the last chapter, the declaration of template symbol,
that can be instanciated using any types. Sometimes, it can be usefull
to restrict the set of types that can be used in a given template
symbol (e.g. only slices but of any type, only classes, only
structures, etc.). In order to make this possible, the *Ymir* language
offers some elements to filter the different types that can be used.

The following code block present the complete syntax of a template
parameter.

```grammar
template_parameter := Identifier | of_filter | class_filter | struct_filter | impl_filter | variadic_filter

of_filter := Identifier 'of' type
class_filter := 'class' Identifier
struct_filter := 'struct' Identifier
impl_filter := Identifier impl type
variadic_filter := Identifier '...'
```

<br>

One can note that every template parameters have an Identifier. This
identifier are the root of the specialization tree. For example, in
the following template parameters **`{T of [U], U}`** there are two
roots, **`T`** and **`U`**. The root **`U`** is important, these
template parameters are different to **`{T of [U]}`**. In the first
case, the identifier **`U`** refers to a template type (as it is a
root of the parameters), and in the second case it refers directly to
a type that is named **`U`**, and that has to be declared somewhere.

## Of filter 

The *of filter* is declared using the keyword **`of`**. This filter is
used to specify the form of the type that can be used to instanciate
the template. The form can be any form of type, it can be for example
a slice, an array, a template symbol, etc. In the following example,
the first function **`foo`** declared at line **`6`**, is a template
function that can be instanciated using only **`T=i32`**. The second
function **`foo`** at line **`14`** use the **`of`** filter to inform
that the type **`T`** must have the same form as the type **`Z`**, but
does not filter the type **`Z`**. The third function **`foo`** at line
**`21`**, accepts for the type **`T`** any slice that have as internal
type a template type declared as **`Z`**, there is no filter on
**`Z`**.

```ymir
import std::io;

/**
 * This function will only be callable, with a i32 as T
 */
def foo {T of i32} (_ : T) {
    println ("First ??");
}

/**
 * This function will only be callable, with a type that fit the Z pattern
 * That is to say every type
 */
def foo {T of Z, Z} (_ : T) {
    println ("Second ?");
}

/**
 * This function will be only callable, with a slice of Z, where Z can be anything
 */
def foo {T of [Z], Z} (_ : T) {
    println ("Third !");
}

def main () {
    foo ([1, 2]);
}
```

<br>

In the above example, one can note that, two functions can be called
by the expression `foo ([1, 2])`. The second and third ones. The
template definition that match the best the types, will be used. Here,
this is the third one, the filter is more specific and thus has a
better score.
 
Results: 

```
Third !
```

<br>
	
The *of filter* is a kind of destructuring pattern. They can be
chained, and composed with other filters. Here some other example,
where this time the *of filter* is used to get the template types
parameters of a given class type, and apply some filter on them.
	
	
```ymir
import std::io;

/** A template class, that takes any type as template parameters */
class X {T} {
    let _x : T;
    
    pub self (x : T) with _x = x {}
}

/**
 * This function accepts any X object, as long as its template parameter is a slice
 */
def foo {T of &(X!{U}), U of [Z], Z} (x : T) {
    println ("Slice X : ", x::typeinfo.name);
}

/**
 * Accept all the X objects, that have not been accepted by the first function
 * Indeed, the template is less specific, and is used only if the first one fails
 */
def foo {T of &(X!{U}), U} (x : T) {
    println ("Not a slice X : ", x::typeinfo.name);
}


def main () {
    let a = X::new ([1, 2, 3]);
    let b = X::new ("Test");
    let c = X::new (23.0f);
    
    foo (a);
    foo (b);
    foo (c);
}
```

<br>
Results: 

```
Slice X : main::X([i32])::X
Slice X : main::X([c32])::X
Not a slice X : main::X(f32)::X
```

<br>

As presented in the introduction of this chapter, there is a
difference between identifier that can be found in the roots of the
template parameters and those which are not. In the following example,
the **`foo`** function accept a slice of **`U`** where **`U`** is not
defined, resulting in an error by the compiler. Indeed, the type
**`U`** could have been defined somewhere, and there must be a
distinction between this type and a template parameter.

```ymir
import std::io;

def foo {T of [U]} (a : T) {}

def main () {
	foo ([1, 2]);
}
```

<br>
Errors: 

```error
Error : the call operator is not defined for foo {T of [U]}(a : T)-> void and {mut [mut i32]}
 --> main.yr:(6,6)
 6  ┃ 	foo ([1, 2]);
    ╋ 	    ^      ^
    ┃ Note : candidate foo --> main.yr:(3,5) : foo {T of [U]}(a : T)-> void
    ┃     ┃ Error : undefined type U
    ┃     ┃  --> main.yr:(3,16)
    ┃     ┃  3  ┃ def foo {T of [U]} (a : T) {}
    ┃     ┃     ╋                ^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Struct and Class filters

The keywords `struct` and `class` defines respecitvely the *struct*
and *class filters*. They filter the accepted types of a template
symbol. Unlike *of filter* they cannot be chained, and accept only an
identifier. In the following example, the first **`foo`** function at
line **`11`** is instanciable using a class type, and the second at
line **`15`** only accept struct types. **Warning** *class filter*
accepts a reference class type, and not directly the class type
(**`&A`** not **`A`**).

```ymir
import std::io

struct 
| x : i32
-> X;

class A {
	self () {}
}

def foo {class T} () {
	println ("Class !");
}

def foo {struct T} () {
	println ("Struct !");
}

def main () {
	foo!(&A) ();
	foo!(X) ();
} 
```

<br>
Results:

```
Class !
Struct !
```
<br>

Even if this filters cannot be chained, they can be used as the leaf
of a *of filter*. In the following example, the function **`foo`**
accepts a slice of class objects.

```ymir
import std::io;

class A {
    pub self () {}
    impl Streamable;
}

class B {
    pub self () {}
    impl Streamable;
}

def foo {T of [U], class U} (a : T) {
	println (T::typeid, " = ", a, "");
}

def main () {
    foo ([A::new (), A::new ()]);
    foo ([B::new ()]);
}
```

<br>
Results: 

```
[&(main::A)] = [main::A(), main::A()]
[&(main::B)] = [main::B()]
```

## Implement filter

We have seen in the chapter about traits
(*cf*. [Traits](https://gnu-ymir.github.io/Documentations/en/objects/traits.html)),
that class type can implement a given trait. Implementing a trait
gives specific method to a class type, that can be called. However
traits lose most of their interest if it is impossible to accept a
type that implements the trait without knowning the type itself. This
cannot be done by inheritance, as traits are not types, however
templates have a specific filter to perform this operation. In the
following example, the *impl filter* is used by the **`foo`**
function, that thus accepts any kind of object as long as they impl
the trait **`Getter`**.

```ymir
import std::io;

trait Getter {
    pub def get (self)-> i32;
}

class A {

    pub self () {}
    
    impl Getter {
        pub over get (self)-> i32 {
            12
        }
    }

}

def foo {T impl Getter} (a : T) -> i32 {
    a.get ()
}

def main () {
    let a = A::new ();
    println (foo (a));
}
```

<br>

A trait can be a template symbol. In that case it has some template
parameters, that can be destructured by a template filter. For
example, in the following source code, the trait **`Getter`** is a
template, that is implemented using the type **`i32`** by the class
**`A`**. The first **`foo`** function at line **`1`** accepts any kind
of object as long as they impl the trait **`Getter`**, and filter the
template parameter of this trait to get it under the identifier
**`X`**. The second **`foo`** function only accepts types that
implements the trait but using a slice. Because the second **`foo`**
function is more specific when using **`&B`** object, it is called at
line **`44`**.

```ymir
import std::io;

trait Getter {T} {
    pub def get (self)-> T;
}

class A {

    pub self () {}
    
    impl Getter!{i32} {
        pub over get (self)-> i32 {
            12
        }
    }
}

class B {

    pub self () {}
    
    impl Getter!{[i32]} {
        pub over get (self)-> [i32] {
            [12, 24]
        }
    }
}

def foo {T impl Getter!{X}, X} (a : T) -> X {
    print ("First : ");
    a.get ()
}

def foo {T impl Getter!{X}, X of [U], U} (a : T)-> X {
    print ("Second : ");
    a.get ()
}

def main () {
    let a = A::new ();
    let b = B::new ();
    
    println (foo (a));
    println (foo (b));
}
```

<br>
Results: 

```
First : 12
Second : [12, 24]
```

<br>

## Variadic templates

Variadic templates are special templates, that takes an arbitrary
number of type as arguments. They are defined using an identifier
followed by the token `...`. When the specialization is done, the
identifier of the variadic template, can be used to define a tuple
type. In the following example, the type of the parameter **`a`** of
the **`foo`** function is **`(i32, i32, i32, i32, i32)`**. **Warning**
If only one type is given to the variadic template, then it is not a
tuple, but directly the type that has been given. As you may have
guessed by now, the `println` function is a variadic template
function.

```ymir
import std::io

def foo {T ...} (a : T) {
	println (a.0, expand a);
}

def main () {
	foo (1, 2, 3, 4, 5);
}
```
<br>
Results: 

```
112345
```

<br>

The identifier can also be used to complete another type. For example,
a function pointer type. In the following source code, the structure
**`X`** accepts an arbitrary number of type as template parameters,
and use them to form the type of the field **`foo`**. When
instanciated by the **`main`** function at line **`12`**, the field
**`foo`** takes the type **`fn (i32, f32)-> void`**.

```ymir
import std::io

struct 
| foo : fn (T)-> void
 -> X {T...};
 
def foo (x : i32, y : f32)-> void {
    println ("(", x, ", ", y, ")");
}
 
def main () {
    let x = X!{i32, f32} (&foo);
    x.foo (12, 3.14f);
}
```

<br>
Results: 

```
(12, 3.140000)
```

<br>

To force the type to be a tuple inside another type, the standard
syntax of tuple can be used. For example, the field **`foo`** could
have been defined as follows **`fn ((T,))-> void`**, in that case it
would have been equal to **`fn ((i32, f32))-> void`**, meaning a
function pointer that takes a parameter of type **`(i32, f32)`**, and
returns nothing.

### Recursive variadic template

Variadic template must contain at least one type. To perfom recursive
variadic function, end case functions must be written, this end case
generally contains a standard template parameter. For example, the
following example presents a **`foo`** function that takes variadic
parameters, and prints them. The end case is described at line
**`3`**, where the function takes only one standard template
parameter. The function **`foo`** at line **`8`** takes two template
parameter, a standard one that will be used for the first parameter of
the function, and a variadic one for the rest of the parameters. One
can note from the line **`5`** that even if the type of **`b`** is
**`c8`** and thus not a tuple, the keyword **`expand`** is usable, and
does nothing particular.

```ymir
import std::io;

def foo {F, R...} (a : F, b : R) {
	println ("FST : ", F::typeid, "(", a, ")");
	foo (expand b);
}

def foo {F} (a : F) {
	println ("SCD : ", F::typeid, "(", a, ")");
}

def main () {
	foo (1, 3.f, "Test", 'r'c8);
}
```

<br>

Results: 

```
FST : i32(1)
FST : f32(3.000000)
FST : [c32](Test)
SCD : c8(r)
```
