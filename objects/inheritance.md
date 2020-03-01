# Inheritance

A class can be derived from a base class. You can use the keyword
`over` to perform inheritance between two classes. A class can have
only one ancestor.

```ymir
class Shape {
}

class Circle over Shape {
	let _center : i32 = 0;
	let _radius : i32 = 1;
}
```

## Attributes

The attributes of an ancestor cannot be redeclared by an heir
class. All attributes are protected by default, so the heir can access
the attribute of an ancestor. You can use the `prv` keyword to make
them private and then inaccessible to the heirs.

```ymir
class Shape {
	    let _x : i32 = 0;
//  ^^^
// Try to add prv
	
	pub self () {}
}

class Circle over Shape {
	// Try to add the following line 
	// let _x : i32;
	
	pub self () {
		import std::io;
		println (self._x);
	}	
}
```

## Constructor

The constructor of the parent class must be called, when constructing
a heir class. The `with` syntax is used to perform that.


```ymir
class Shape {	
	pub self () {}
	
	pub self (x : i32) {
		println (x);
	}
}

class Circle over Shape {
	// ... attributes 
	
	pub self () {} // Same as : with super ()
	
	pub self (x : i32) with super (x) {}
}
```

## Method overriding

The keyword `over` is used to override a method. You cannot implicitly
override a method by omitting the `over` keyword and using the `def`
keyword. The signature of the method must be strictly identical to
that of the ancestor's method, including privacy. Of course,
you cannot override private methods, but you can override protected
and public methods.

```ymir
import std::io
	
class Shape {
	// ... attributes and constructors
	
	pub def area (self) -> i32 
		0
}

class Circle over Shape {
	// ... attributes and constructors
	
	pub over area (self) -> i32 {
		import std::math;
		Math::PI * (self._radius * self._radius)
	}
}

class Square over Shape {
	// ... attributes and constructors
		
	pub over area (self) -> i32 {
		self._side * self._side
	}
	
}

def main () {
	let mut s : Shape = Circle::new (12);
	println (s.area ());
	
	s = Square::new (3);
	println (s.area ());	
}
```

## Abstract class

A class can be abstract, this means that the class cannot be
instantiated even if it has a constructor. An abstract class can declare
methods without body, these methods must be overriden by heir
classes. In the above example, there is no reason why we can
instantiate a `Shape`, so just mark the class as abstract.

```ymir
class @abstract Shape {
	pub self () {} // need a constructor to be heritable
	
	pub def area (self)-> i32; // Method has no body
}

class Circle over Shape {
	// ... attributes and constructors
	
	// Try to remove this method definition
	pub over area (self) -> i32 {
		import std::math;
		Math::PI * (self._radius * self._radius)
	}
}

def main () {
	let s : Shape = Circle::new (12);
	//              ^^^^^^
	// Try to replace by shape
}
```


## Final class

Final classes declared with the custom attributes `@final` defines
classes that cannot have heirs. The custom attributes `@final` can
also be used on method to avoid overload from heir class.

```ymir
import std::io;

class @abstract Shape {	
    pub self () {}
    
    pub def area (self) -> i32;	
}

class Rectangle over Shape {

    let _length : i32;
    let _width : i32;
    
    pub self (l : i32, w : i32) with _length = l, _width = w {}
    
    pub over @final area (self) -> i32 {
		self._length * self._width
    }
    
}

class @final Square over Rectangle {	
    pub self (l : i32) with super (l, l) {}

    // Try to add this method
    // pub over area (self) -> i32 {
    //     self._length * self._width
    // }
}

def main () {
    let s : Shape = Square::new (9);
    println (s.area ());
}
```
