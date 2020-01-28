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
class. All attributes are private by default, so the heir cannot
access the attribute of an ancestor. You can use the `prot` keyword to
make them protected and then accessible to the heirs, but not
globally.

```
class Shape {
	prot let _x : i32 = 0;
//  ^^^^
// Try to remove prot
	
	self () {}
}

class Circle over Shape {
	// Try to add the following line 
	// let _x : i32;
	
	self () {
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
	self () {}
	
	self (x : i32) {
		println (x);
	}
}

class Circle over Shape {
	// ... attributes 
	
	self () {} // Same as : with super ()
	
	self (x : i32) with super (x) {}
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
	
	def area (self) -> i32 
		0
}

class Circle over Shape {
	// ... attributes and constructors
	
	over area (self) -> i32 {
		import std::math;
		Math::PI * (self._radius * self._radius)
	}
}

class Square over Shape {
	// ... attributes and constructors
		
	over area (self) -> i32 {
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
	self () {} // need a constructor to be heritable
	
	def area (self)-> i32; // Method has no body
}

class Circle over Shape {
	// ... attributes and constructors
	
	// Try to remove this method definition
	over area (self) -> i32 {
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


