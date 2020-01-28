# Class

An object is an instance of a class. A class is declared using the
keyword `class`. 

```ymir
class Foo {
}
```

## Attributs 

A class can contain attributes, which are equivalent to fields for a
structure.  An attribute is declared as a variable, using the keyword
`let`. You must give at least the type to the declaration, but the
value is not mandatory.

```ymir
class Point {
	let _x : i32;
	let _y = 0;
}
```

All attributes are private by default, i.e. only the methods declared
in the class will have access to them. You can use the `pub` keyword
to make them public and usable everywhere.

## Constructor 

To be instancible, a class must declare a minimum on the
constructor. The constructor is always named `self`, and takes
parameters to build the object. The constructor must give a value to
all the attributes of the class, the attributes are initialized using
the `with` keyword.

```ymir
class Point {
	let _x : i32;
	let _y = 0;
	
	// _y is already initialized
	// it is not mandatory to add it in the with initialization
	self () with _x = 12 {
		// Try to print the attribute _x 
		// You will need to use self 
	}
	
	self (x : i32, y : i32) with _x = x, _y = y {
	}
}
```

Once the class has constructors, you can call them using the following
syntax :

```ymir
let p : Point = Point::new (); 
let p2 : Point = Point::new (1, 2);
// Try to add the following line : 
// let p3 : Point = null;
```

Constructors, like methods are public by default, you can use the
keyword `prv` to make them private.

A class is not a pointer, you can't make it `null`, that has no sense
in **Ymir**.

You can call another constructor with the syntax `with`. When you call
another constructor, all fields are already initialized, so you cannot
initialize them again.

```ymir
class Point {
	// ... attributes
	
	self () with self (0, 0) {}
	
	self (x : i32, y : i32) with _x = x, _y = y {}
}
```

## Methods

Methods of a class are functions that are applicable to an object
instance. The methods are declared like function, but take the `self`
as first parameter. The `self` type is not specified because it is
obvious.

```ymir
class Point {
	// ... the same declaration as above
	
	def vector (self, other : Point) -> Point {
		Point::new (other._x - self._x, other._y - self._y)
	}
	
}

def main () {
	let p1 = Point::new (1, 2), p2 = Point::new (2, 3);
	let v = p1.vector (p2);
}
```

The `self` instance is an `alias` of the object (Cf. [Aliases]()),
that is immutable by default. You can make it mutable by using the
keyword `mut`. As for structure, the attributes mutability is defined
when declaring them. If an attribute is mutable, its mutability
depends on the mutability of the object instance that posses it.

```ymir
class Point {
	let mut _x : i32, mut _y = 0;

	// ... the same constructors as above

	def addOne (mut self) {
	//          ^^^
	// Try to remove the mut 
	
		self._x += 1;
		self._y += 1;
	}
}

def main () {
	let mut p = Point::new (1, 2);
	//  ^^^
	// Try to remove the mut
	(alias p).addOne ();
//	 ^^^^^
// Try to remove the alias
}
```

As you have guessed an object borrow data that are stored in the Heap,
and is therefore a aliasable type. Everything that is applicable to
aliasable type [Aliases]() is applicable to objects.

## Destructors

There is no destructor in **Ymir**, the object instances are destroyed
by the garbage collector.


