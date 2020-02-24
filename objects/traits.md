# Trait

Traits are used to define characteristics that can be implemented by a
class. The keyword `trait` is used to create a new Trait. A trait is
not a type, you cannot have variable whose type is a trait. 

```ymir
trait Printable {
	pub def print (self);	
}
```

A class can implement a trait. All the method declared in the traits
will be added in the definition of the class. If the class is not
abstract all the method of the traits must have a body.

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

A trait can provide a default behavior. The function inside a trait
are not checked before being implemented by a class. 

```ymir
trait Printable {
	pub def print (self) {
		import std::io;
		print (typeof (self)::typeid);
		// Here we don't know the type yet
	}
}

class Point {
	// ... Constructors and attributes

	impl Printable; // override the print method is optional
	// The method print is verified and typed here
}
```

## Inheriting an Implementing Class

When inheriting a class implementing a trait, the methods implemented
by the ancestor class are considered to be normal methods, so that the
heir class can override them without any problem.

```ymir
class @abstract Shape {
	// ... Constructors and attributes

	impl Printable;
}

class Circle over Shape {
	// ... Constructors and attributes
	
	pub over print (self) {}
}
```

## Copy trait

Class are aliasable type, but it is not trivial to determine how to
make a copy. It is up to the user to define the copy method, by
implementing the trait `core::duplication::Copiable`. The definition
of this trait is the following :

```ymir
trait Copiable {
    pub def deepCopy (self)-> mut (typeof self);
}
```

There is no need to import anything, since the trait is located in a
core file, that is imported by default. The trait can be overriden as
follows :

```ymir
class Point {
 	// ... Constructors and attributes

	impl Copiable {
		pub over deepCopy (self) -> mut Point {
			Point::new (self._x, self._y)
		}
	}
}

def main () {
	let x = Point::new (1, 2);
	let mut y = dcopy x;
	//          ^^^^^
	// Try to remove the dcopy
}
```

## Printable trait

By default class are not printable, but the module `std::io` export
the trait `Printable`. Once, the trait is implemented an object
instance can be printed.

```ymir
import std::io

class Point {
	// ... Constructors and attributes
	
	impl Printable {
		pub over print (self) {
			print ("Point {", self._x, ", ", self._y, "}");
		}
	}
}

def main () {
	let x = Point::new (1, 2);
	println (x);
}
```

