# Inheritance

One of the most important point of the object oriented programming
paradigm is the possibility for a class to be derived from a base
class. This capability enables type polymorphism. In *Ymir* the
keyword `over` is used for class derivation, and overriding. A class
can have only one ancestor. We will see in the chapter about traits,
that multiple inheritance can be in some way achieved in another way.

```ymir
class Shape {
}

/**
 * A circle is a shape
 */
class Circle over Shape {
	let _center : i32 = 0;
	let _radius : i32 = 1;
}
```

## Fields

The fields of an ancestor cannot be redeclared by an heir class. Even
if they are hidden to the heir class (private fields). This choice was
made to avoid miscomprehension, as two different variables would be
named the same way.

```ymir
import std::io;
		
class Shape {
	let _x : i32 = 0;
	
	pub self () {}
}

class Circle over Shape {
	let _x : i32;
	
	pub self () {
		println (self._x);
	}	
}
```

<br>

Error:
```error
Error : when validating main::Circle
 --> main.yr:(9,7)
 9  ┃ class Circle over Shape {
    ╋       ^^^^^^
    ┃ Error : declaration of _x shadows another declaration
    ┃  --> main.yr:(4,13)
    ┃  4  ┃     prv let _x : i32 = 0;
    ┃     ╋             ^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(10,9)
    ┃     ┃ 10  ┃     let _x : i32;
    ┃     ┃     ╋         ^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Parent class construction

All object instances must be constructed. This means that when a class
override a base class, the constructor of the base class must be
called inside the constructor of the heir class. This call can be made
implicitly if the constructor of the parent class takes no
arguments. However, if no constructor in the parent class takes no
arguments, then the call must be made explicitly. This explicit call
is made inside the with statement.

```ymir
class Shape {	
	let _x = 0;
	pub self () {}
	
	pub self (x : i32) with _x = x {}
}

class Circle over Shape {
	let _radius : f32;
	
	// Same as : with super ()
	pub self () with _radius = 1.0f {} 
	
	// call the second parent constructor, at line 5
	pub self (x : i32) with super (x), _radius = 1.0f {} 
}
```

<br>

The call of the parent constructor is the first thing performed inside
a constructor. Meaning, that the construction of the fields of the
heir class are made afterward. To illustrate this point, the following
example presents a base class **`Foo`** with a constructor printing
**`foo`**, and a heir class **`Bar`**, calling the function **`bar`***
(printing the value **`bar`**) to initialize its field **`_x`**.

```ymir
import std::io;

def bar () -> i32 {
    println( "Bar");
    42
}

class Foo {    
    pub self () {
        println ("Foo");
    }
}

class Bar over Foo {
    let _x : i32;

    pub self () with _x = bar () {}
}

def main () {
    let _ = Bar::new ();
}
```

<br>
Results: 
```
Foo
Bar
```

<br> 

However, because constructor redirection does not call parent
constructor, and let that work to the called constructor, to which
they are redirected, the following program has a different
behavior. The arguments of the redirection are computed first, then
the call to the parent constructor, and finally the construction of
the fields of the heir class.

```ymir
import std::io;

def bar () -> i32 {
    println( "Bar");
    29
}

def baz () -> i32 {
    println( "Baz");
    13
}

class Foo {
    pub self () {
        println ("Foo");
    }
}

class Bar over Foo {
    let _x : i32;

    /**
     * Call parent constructor at line 14, and then bar
     */
    pub self (x : i32) with _x = bar () + x {}

    /**
     * Call baz first, then self at line 25
     */
    pub self () with self (baz ()) {} 
}

def main () {
    let _ = Bar::new ();
}
```

<br>
Results:
```ymir
Baz
Foo
Bar
```

<br> The construction order is perfectly predictible, but should not
have an impact on the program behavior. So it is probably not a good
idea to rely on it.


## Parent class destruction

In contrast to construction, the parent destructor is the last
operation of the destruction of a heir class. The parent destructor is
always called, there is no way to avoid it (aside exiting the
program). 

```ymir
import std::io;

class Foo {    
    pub self () {}
    __dtor (mut self) {
        println ("Destroying Foo");
        println ("====");
    }
}

class Bar over Foo {
    pub self () {}

    __dtor (mut self) {
        println ("====");
        println ("Destroying Bar");
		return {} // desperately trying to avoid parent destruction
    }
}

def foo () {
    let _ = Bar::new ();
}

def main () {
    loop {
        foo ();
    }
}
```

<br>
Results:
```
====
Destroying Bar
Destroying Foo
====
====
Destroying Bar
Destroying Foo
====
====
Destroying Bar
Destroying Foo
====
...
```

## Method overriding

The keyword `over` is used to override a method. Methods **cannot** be
 implicitly overriden by omitting the `over` keyword and using the
 `def` keyword. The signature of the method must be strictly identical
 to the one of the ancestor method, including privacy, and argument
 mutability. Of course, private methods cannot be overriden, because
 hidden to heir classes, but protected and public methods can be
 overriden. In the following example, a class **`Shape`** define the
 method **`area`**. This method is public, and then can be overriden
 by heir classes. The class **`Circle`** and **`Rectangle`** overrides
 the methods.


```ymir
import std::io
    
class Shape {
    pub self () {}
    
    pub def area (self) -> f64 
	0.0
}

class Circle over Shape {
    let _radius : f64;
    pub self (radius : f64) with _radius = radius {}
    
    pub over area (self) -> f64 {
	import std::math;
	math::PI * (self._radius * self._radius)
    }
}

class Square over Shape {
    let _side : f64;
    pub self (side : f64) with _side = side {}
    
    pub over area (self) -> f64 {
	self._side * self._side
    }
    
}

def main () {
    let mut s : &Shape = Circle::new (12.0);
    println (s.area ());
    
    s = Square::new (3.0);
    println (s.area ());	
}
```

<br>
Results:
```
452.389342
9.000000
```

### Override mutable method

The mutability of the method must be respected in the heir class. This
means that mutable method must be mutable in the heir, and immutable
methods must be immutable in the heir.

### Final methods

A base class can flag its method to avoid overriding. This flag is
placed as a *custom modifier* before the name of the method.


```ymir
class Foo {
    pub self () {}
    
    pub def @final foo (self) {}
}

class Bar over Foo {
    pub self () {}

    pub over foo (self) {}
}
```

<br>

Errors:
```error
Error : when validating main::Bar
 --> main.yr:(7,7)
 7  ┃ class Bar over Foo {
    ╋       ^^^
    ┃ Error : cannot override final method (const self) => main::Foo::foo ()-> void
    ┃  --> main.yr:(10,14)
    ┃ 10  ┃     pub over foo (self) {}
    ┃     ╋              ^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(4,20)
    ┃     ┃  4  ┃     pub def @final foo (self) {}
    ┃     ┃     ╋                    ^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br> 

This flag can also be used on an overriden method inside a heir
class to avoid further overriding. 

```ymir
class Foo {
    pub self () {}
    
    pub def foo (self) {}
}

class Bar over Foo {
    pub self () {}

    pub over @final foo (self) {}
}

class Baz over Bar {
    pub self () {}

    pub over foo (self) {}
}
```

<br>
Errors:

```error
Error : when validating main::Baz
 --> main.yr:(13,7)
13  ┃ class Baz over Bar {
    ╋       ^^^
    ┃ Error : cannot override final method (const self) => main::Bar::foo ()-> void
    ┃  --> main.yr:(16,14)
    ┃ 16  ┃     pub over foo (self) {}
    ┃     ╋              ^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(10,21)
    ┃     ┃ 10  ┃     pub over @final foo (self) {}
    ┃     ┃     ╋                     ^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```


## Abstract class

A class can be abstract, this means that the class cannot be
instantiated even if it has a constructor. An abstract class can
declare methods without body, these methods must be overriden by heir
classes. An abstract must have a constructor to be heritable, this
constructor being called by the heir classes. Not that an abstract
class can have no public constructors, but that a class that have no
public constructors is not necessarily abstract.

```ymir
class @abstract Shape {
	prot self () {} // need a constructor to be inheritable
	
	pub def area (self)-> f64; // Method does not need a body
}

class Circle over Shape {
	let _radius : f64;
	pub self (radius : f64) with _radius = radius {}
	
	pub over area (self) -> f64 {
		import std::math;
		math::PI * (self._radius * self._radius)
	}
}

def main () {
	let s : Shape = Circle::new (12);
	println (s.area ());
}
```

### Method with no body

A method of an abstract class can have a body, and thus behave as any
method of any class. It can also have no body, but in that case heir
class must override this method. Otherwise the class is
incomplete. Abstract class can be heir class, in that case they don't
need to override the methods without body.

```ymir
class @abstract Foo {
    pub self () {}
    
    pub def foo (self);
}

class @abstract Bar over Foo {
    pub self () {}
}

class Baz over Bar {
    pub self () {}
}
```

<br>
Error:
```error
Error : when validating main::Baz
 --> main.yr:(11,7)
11  ┃ class Baz over Bar {
    ╋       ^^^
    ┃ Error : the class main::Baz is not abstract, but does not override the empty parent method (const self) => main::Foo::foo ()-> void
    ┃  --> main.yr:(11,7)
    ┃ 11  ┃ class Baz over Bar {
    ┃     ╋       ^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(4,13)
    ┃     ┃  4  ┃     pub def foo (self);
    ┃     ┃     ╋             ^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Final class

Final classes declared with the custom attributes `@final` defines
classes that cannot have heirs. A final class, can be an heir class,
or a base class. If the class is a base class, strong optimization can
be made by the compiler, (no vtable required, and call of the methods
are direct and way faster). For that reason, it is a good practice to
flag classes for which we are certain they cannot be inheritable. This
optimization is also done on final methods (if they are not overriden,
i.e. final when define for the first time), thus this is a good
practice to flag methods for which we are certain they won't be
overriden. This optimization cannot be done if the class is not a base
class.

```ymir
class @final Foo {
	pub self () {}
	
	pub def foo (self) {}
}

class Bar over Foo {
	pub self () {}
}
```

<br>
Error:
```error
Error : the base class main::Foo is marked as final
 --> main.yr:(7,16)
 7  ┃ class Bar over Foo {
    ╋                ^^^


ymir1: fatal error: 
compilation terminated.
```

<br>

*Contribution*: It is possible to have an abstract and final class. I
didn't find any use case for that, maybe that is completely useless,
and must be prohibited.
