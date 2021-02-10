# Template specialization

We have seen in the last chapter, how to create simple template
function, that can be call with any type. Sometimes, you may want to
be more precize in the kind of type that can be used in a
function. For example, when you want to sort an array, you don't wan't
to be able to call the function with just a `i32`, but only with
arrays.

Those kind of specialization can be achieved thanks to template
specifiers.

## Of specifier 

The *Of* specifier declared with the keyword `of`, is used to tell to
the compiler that the type that will be used must fit to a specific
pattern. It can be either a type, or a more specific template.

```ymir
import std::io;

/**
 * This function will only be callable, with a i32 as T
 */
def foo (T of i32) (_ : T) {
    println ("First ??");
}

/**
 * This function will only be callable, with a type that fit the Z pattern
 * That is to say every type
 */
def foo (T of Z, Z) (_ : T) {
    println ("Second ?");
}

/**
 * This function will be only callable, with an array of Z, where Z can be anything
 */
def foo (T of [Z], Z) (_ : T) {
    println ("Third !");
}

def main () {
    foo ([1, 2]);
}
```

In the above example, you may have noticed that, two functions can be
called by the expression `foo ([1, 2])`. The second and third
ones. The template definition that match the best the types, will be
used. Here, this is the third one, so the ouput of the program will be : 

```
Third !
```

## Struct and Class specifier 

The keywords `struct` and `class` can be used to specify that the
accepted template argument must be respecitvely a structure or a
class type.

```ymir
import std::io

struct 
| x : i32
-> X;

class A {
	self () {}
}

def foo (class T) () {
	println ("Class !");
}

def foo (struct T) () {
	println ("Struct !");
}

def main () {
	foo!(A) ();
	foo!(X) ();
}
```

## Implement specialization

The keyword `impl` can be used to check that the used type implement a
defined trait, for example :

```ymir
import std::io;

trait Getter (T) {
    def get (self)-> T;
}

class A {

    self () {}
    
    impl Getter!i32 {
        over get (self)-> i32 {
            12
        }
    }

}

def foo (T impl Getter!X, X) (a : T) -> X {
    a.get ()
}

def main () {
    let a = A::new ();
    println (foo (a));
}
```

## Variadic templates

Variadic templates are special templates, that takes an arbitrary
number of template arguments. They are defined using the token `...`.
The parameters will be put in a tuple, and will be considered exaclty
as if they were really a tuple. 

```ymir
import std::io

def foo (T...) (a : T) {
	println (a.0, expand a);
}

def main () {
	foo (1, 2, 3, 4, 5);
}
```

As you may have guessed by now, the `println` function is a variadic
template function. Variadic template can also be used on every
template symbol, like structures. 

```ymir
import std::io

struct 
| foo : fn (T)-> i32 
 -> X (T...);
 
def add (x : i32, y : i32)-> i32
	x + y
 
def main () {
	let x = X!(i32, i32) (&add);
	println (x.foo (12, 30));
}
```
