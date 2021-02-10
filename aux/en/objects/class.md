# Class

An object is an instance of a class. A class is declared using the
keyword `class`. 

```ymir
class Foo {
}
```

## Attributes 

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

All attributes are protected by default, i.e. only this class and its
heirs will have access to them. You can use the `pub` keyword to make
them public and usable everywhere.

## Constructor 

To be instancible, a class must declare at least one constructor. The
constructor is always named `self`, and takes parameters to build the
object. The constructor must give a value to all the attributes of the
class, the attributes are initialized using the `with` keyword.

```ymir
class Point {
	let _x : i32;
	let _y = 0;
	
	// _y is already initialized
	// it is not mandatory to add it in the with initialization
	pub self () with _x = 12 {
		// Try to print the attribute _x 
		// You will need to use self 
	}
	
	pub self (x : i32, y : i32) with _x = x, _y = y {
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

Constructors, like methods are protected by default, you can use the
keyword `pub` to make them public and `prv` to make them private.

A class is not a pointer, you can't make it `null`, that has no sense
in **Ymir**.

You can call another constructor with the syntax `with`. When you call
another constructor, all fields are already initialized, so you cannot
initialize them again.

```ymir
class Point {
	// ... attributes
	
	pub self () with self (0, 0) {}
	
	pub self (x : i32, y : i32) with _x = x, _y = y {}
}
```

## Methods

Methods of a class are functions that are applicable to an object
instance. The methods are declared like function, but take the `self`
as first parameter. The type of `self` is not specified because it is
obvious.

```ymir
class Point {
	// ... the same declaration as above
	
	pub def vector (self, other : Point) -> Point {
		Point::new (other._x - self._x, other._y - self._y)
	}
	
}

def main () {
	let p1 = Point::new (1, 2), p2 = Point::new (2, 3);
	let v = p1.vector (p2);
}
```

The `self` instance is an `alias` of the object (Cf. [Alias]()), which
is imutable by default. You can make it mutable by using the `mut`
keyword. As for structures, the mutability of the attributes is
defined when they are declared. If an attribute is mutable, its
mutability depends on the mutability of the instance of the object
that contains it.

```ymir
class Point {
	let mut _x : i32, mut _y = 0;

	// ... the same constructors as above

	pub def addOne (mut self) {
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


