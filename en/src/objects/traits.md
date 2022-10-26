# Trait

Traits are used to define as their name suggest traits that can be
implemented by a class. To define them, the keyword **`trait`** is
used. A *trait* is not a type, and can only be implemented by class,
for that reason, a variable or a value cannot be of a *trait* type.

An example of a trait, is presented in the following source block. The
idea of this trait, is to ensure that every class, implementing it,
have a public method named **`print`** that can be called without
parameters.

```ymir
trait Printable {
	pub def print (self);	
}
```

<br>

When a class implements a trait, all the method declared in the trait
are added in the definition of the class. If the class is not abstract
all the method of the traits must have a body. For example, if a non
abstract class implement the trait **`Printable`**, thus it must
override the method **`print`** to add a body to it.

```ymir
import std::io

class Point {
	// ... Constructors and attributes
	
	impl Printable {
		// Try to remove the following definition
		pub over print (self) {
			print ("Point {", self._x, ", ", self._y, "}");
		}
	}	
}
```

<br>

A trait can provide a default behavior for the method it defines. The
body of the method is validated for each implementation. In the
following example, the method **`print`** defined in the trait
**`Printable`**, prints the typeid of the class that implement the
traits. One can note, that the behavior of this function is different
for each class that implements it, that is why it is only validated
when a class implement the trait.

```ymir
mod main; 

trait Printable {
	pub def print (self) {
		import std::io;
		print (typeof (self)::typeid);
		// Here we don't know the type yet
	}
}

class Point {
	// ... Constructors and attributes

	impl Printable;  // 'print' method prints ("main::Point")
}

class Line {
	// ... Constructors and attributes

	impl Printable;  // 'print' method prints ("main::Line")
}
```

<br>

**Warning**: If a trait is never implemented by any class, and have
methods with default behavior, then it is never validated. Thus errors
can be present in this trait, but still pass the compilation. One can
see the trait as a kind of template, this problem being present in
template symbol as well (*cf.*
[Templates](https://gnu-ymir.github.io/Documentations/en/templates/)).

## Inherit a Class implementing a Trait

The methods of a trait can be overriden by heir classes. In order to
do this, heir classes must reimplement the trait, and override the
methods. 

### Simple reimplementation

In the following example, the class **`Shape`** implements
the trait **`Printable`**, this trait has a method **`print`** with a
default behavior. The class **`Circle`** does not reimplement the
trait, thus when calling the method print of a **`Circle`** value, the
value **`main::Shape`** is printed on the stdout. On the other hand,
the class **`Rectange`** reimplement the traits, thus the value
**`main::Rectangle`** is printed.

```ymir
mod main;

trait Printable {
	pub def print (self) {
		import std::io;
		println (typeof (self)::typeid);
	}
}

class @abstract Shape {
	self () {}
	
	impl Printable;
}

class Circle over Shape {
	pub self () {}
}

class Rectangle over Shape {
	pub self () {}
	
	impl Printable; // reimplement the method print with typeof (self) being main::Rectangle
}

def main () {
	let c = Circle::new ();
	c.print ();
	
	let r = Rectangle::new ();
	r.print ();
}
```
<br>
Results: 
```
main::Shape
main::Rectangle
```

### Override implemented method

Implemented method cannot be overriden without reimplementing the
trait. In the following example, a class **`Shape`** implement the
trait **`Printable`**, and the class **`Circle`** inherits
**`Shape`**, and tries to override the method **`print`**. 

```ymir
mod main;
import std::io;

trait Printable {
	pub def print (self);
}

class @abstract Shape {
	self () {}
	
    impl Printable {
        pub over print (self) {
            println ("main::Shape");
        }
    }
}

class Circle over Shape {
    pub self () {}
    
    pub over print (self) {}
}
```

<br>
Errors: 

```error
Error : when validating main::Circle
 --> main.yr:(18,7)
18  ┃ class Circle over Shape {
    ╋       ^^^^^^
    ┃ Error : cannot override the trait method (const self) => main::Shape::print ()-> void outside the implementation of the trait
    ┃  --> main.yr:(21,14)
    ┃ 21  ┃     pub over print (self) {}
    ┃     ╋              ^^^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(12,18)
    ┃     ┃ 12  ┃         pub over print (self) {
    ┃     ┃     ╋                  ^^^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

To prevent the previous error, the class **`Circle`** have to
reimplement the trait **`Printable`**. When reimplementing a trait in
a heir class, the parent overriding is not taken into account, and the
method of the trait is used. In the following example, the class
**`Shape`** implement the trait **`Printable`**, that have a method
**`print`** with no default behavior. The class **`Circle`** tries to
reimplement the trait, but without overriding the **`print`**
method. This source code is rejected by the compiler, the class
**`Circle`** is not abstract, but has a method with no body.

```ymir
mod main;
import std::io;

trait Printable {
	pub def print (self);
}

class @abstract Shape {
	self () {}
	
    impl Printable {
        pub over print (self) {
            println ("main::Shape");
        }
    }
}

class Circle over Shape {
    pub self () {}
    
    impl Printable;
}
```

<br>
Errors: 
```error
Error : when validating main::Circle
 --> main.yr:(18,7)
18  ┃ class Circle over Shape {
    ╋       ^^^^^^
    ┃ Error : the class main::Circle is not abstract, but does not override the empty parent method (const self) => main::Printable::print ()-> void
    ┃  --> main.yr:(18,7)
    ┃ 18  ┃ class Circle over Shape {
    ┃     ╋       ^^^^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(5,10)
    ┃     ┃  5  ┃ 	pub def print (self);
    ┃     ┃     ╋ 	        ^^^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

To resolve that problem, the class **`Circle`** must add a body to the
method **`print`**. It can happen that a trait defines multiple
methods, and that only some have to be reimplemented by the heir
class. In that case, there is no magical solution, **maybe a
contribution can enhance that**, but every methods must be
reimplemented. In order to mimic the behavior of the parent
implementation, the **`super`** keyword can be used.

```ymir
class Circle over Shape {
	pub self () {}	

	impl Printable {
	
		pub over print (self)-> void { 
			self::super.print (); // call the print method of the super class 		
		}
	}	
}
```

<br>

## Trait privacy

Trait implementation is always public. For that reason, privacy
specifier (**`pub`**, **`prot`** and **`prv`**) have no meaning on
implementation. 

On the other hand, the trait methods implementation follows the same
rule as the overriding of a parent method. That is to say, the privacy
defined inside the trait must be the same as the privacy defined
inside the implementation.


## Trait usage

As said in the beginning of this chapter, traits do not define
types, thus they cannot be used to define the type of a variable. For
example, the following source code has no meaning, **`Printable`**
does not define a type.

```ymir
mod main;
import std::io;

trait Printable {
    pub def print (self);
}

def foo  (a : Printable) {
    a.print ();
}
```

<br>

Errors: 
```error
Error : expression used as a type
 --> main.yr:(8,15)
 8  ┃ def foo  (a : Printable) {
    ╋               ^^^^^^^^^


ymir1: fatal error: 
compilation terminated.
```

<br>

If the previous example, is not a valid *ymir* code, the behavior can
still be implemented in the language. Traits gain interest when
coupled with templates, and a template test can be used to check that
a class implement a trait. More complete information, and example
about templates, and traits specialization are presented in chapter
[Templates](https://gnu-ymir.github.io/Documentations/en/templates/),
but a brief example is presented in the following source code. In this
example, two classes **`U`** and **`V`** implement the trait
**`Printable`**. The function **`foo`** takes a parameter whose type
is not specified but must implement the trait **`Printable`**. Thus
the function is callable with both **`U`** or **`V`** as argument.

```ymir
mod main;
import std::io;

trait Printable {
    pub def print (self) {
        println (typeof (self)::typeid);
    }
}

class U {
    pub self () {}
    impl Printable;
}

class V {
    pub self () {}
    impl Printable;
}

/**
 * Accept every type, that implements the trait Printable 
 */
def foo {I impl Printable} (a : I) {
    a.print ();
}

def main () {
    foo (U::new ());
    foo (V::new ());
}
```

<br>
Results: 
```
main::U
main::V
```
