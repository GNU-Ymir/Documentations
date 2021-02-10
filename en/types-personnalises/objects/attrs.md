# Objects attributes 

As mentioned above, objects are built from a
predefined type.  This type will be used as a basis for the construction of the
new object type, and therefore this predefined type will be used to
define the data fields of the type.

This data can be accessed as one would access the elements of a tuple, with the operator `.`.
These attributes are private and can only be accessed from the type.

```ymir
struct 
| x : i32
| y : i32
 -> Point; 


type MyType impl Point {

	self () { // type constructor
		self.0.x = 10;
		self.0.y = 2;
	}

}

let a = MyType::init (); // Construct the type
a.0.x = 20; // Error, fields are private
```

Since only one field has an `x` attribute, it can be accessed directly.

```ymir
// ...
	self () {
		self.x = 10; // Ok
	}
// ... 
```

In the case where several fields have the same field name, this kind of fast access is not possible and an error would be returned.

## Aliases of data fields

Since it can be complicated to write a data access, and since the
naming of attribute variables is an important point for the
readability of the source code, the alias of data fields allows to
name the accesses to these data.

```ymir

type Square impl (u64, Point) {

	let len : self.0;
	let x : self.1.x;
	let y : self.1.y;
	
	self (x : i32, y : i32) {
		self.x = x;
		self.y = y;
		self.len = 1;
	}
	
}

let sq = Square::init (1, 2);
println (sq.x, " ", sq.y, " ", sq.len); // Ok, by default aliases are public

```

It is possible to specify data protection, using the keyword `private`
and `protected`.  By default the protection is considered public and
therefore the fields are accessible from outside the type.  The
keyword `private` specifies that access is exclusive to the type, and
`protects` that access is exclusive to the type and its heirs.


```ymir

type Square impl (u64, Point) {

	private let _len : self.0; // To comply with the naming convention recommended in ymir, the private fields must be preceded by a _
	
	private {// Multiple line private block
		let _x : self.1.x;
		let _y : self.1.y;
	}
	
	self (x : i32, y : i32) {
		self._x = x;
		self._y = y;
		self._len = 1;
	}
	
}

let sq = Square::init (1, 2);
println (sq._x, " ", sq._y, " ", sq._len); // Error, fields are private

```

## Union implementation

Union types can be implemented without any problems. Moreover, it sometimes happens, for heritage reasons (which will be explained later), that we need a type to be of several different types without wanting to create a union type.

To do this, it is possible with the `||' token to create a tuple union, and implement it.

```ymir

type MySpecialInteger impl (i8 | i16 | i32 | i64, u8 | u16 | u32 | u64) {
	
	private let _signed : self.0;
	private let _unsigned : self.1;
	
	self () {
		self._signed.3 = 8L;
		self._unsigned.0 = 8B;
	}
	
	def print (self) { // A method
		println (self._signed.0); 
	}
	
}

def main () {
	let a = MySpecialInteger::init ();
	a.print (); // 8
}

```

Of course tuple unions can be used in other contexts, the section
[Tuples](../../expressions/tuples.md) presents in detail their use.
