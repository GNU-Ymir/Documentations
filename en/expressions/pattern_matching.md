# Pattern matching

Pattern matching is a special control structure that allows you to
decompose values in order to easily verify a condition set with a very
expressive and quite intuitive syntax.

## Simple patterns 

You can use literals directly as in a classical C language `switch` `case`.

```ymir
let x = 2;

match x {
	1 => println ("One");
	2 => println ("Two"); 
	3 => println ("Three");
	_ => println ("Any other case");
} // this prints 'Two'
```

## Multiple patterns, and range 

The operator `|` allows to check several values in the same case.

```ymir
let x = 2;

match x {
	1 | 2 => println ("one or two");
	3 => println ("three");
} // this prints 'one or two'
```

It is also possible to create a range to check that a value is present in an interval.

```ymir
let x = 2;


match x {
	1 ... 3 => println ("between 1 and 3");
	_ => println ("Any other case"); 
} // This prints 'between 1 and 3'
```

## Destructuring 

The pattern matching allows to destructure values in order to retrieve the attributes and test them.
For example if you have the following structure : 

```ymir
struct 
| x : i32
| y : i32
 -> Point;
```

The following test allows to deconstruct this type.

```ymir
let z = Point {1, 2};

match z {
	Point {1, 2} => println ("I am a point with the value 1, and 2");
}```

Destructuring can also be applied to tuple.

## Binding

Values can be passed in a variable to test their type and recover their value.

```ymir
let x = 1; 

match x {
	y : i32 => println (y); // any value of type i32
	z => println (z); // any value of any type
}```

Binding only works on undeclared variable names, in other cases the value of the variable is used, for example : 

```ymir

let x = 1;
let c = 12;

match c {
	x => println (x); // the test is (x == c), meaning is c equals to 1 ?
} // This prints nothing```

## Reference binding

The binding can be done by reference in order to modify the associated variable.


```ymir
let x = 1;

match x {
	ref y : i32 => {
		println (y); // 1
		y = 21;
	}
}

println (x); // 21```

## Ignoring the pattern 

The `_` token allows you to define that you are not interested in the value and that therefore all values are accepted by this pattern.

```ymir
let x = Point {1, 2};

match x {
	Point {_, _} => println ("Any point");
	_ {_, _} => println ("Any structure with at least 2 fields");
	_ => println ("Anything");
} // This prints 'Any point'
```

## Named binding

It can sometimes be interesting to test the value of an attribute of a structure without having to test the value of all the attributes that precede it. To do this, it is possible to name a binding, in order to specify the element to which we refer.

```ymir
let x = Point {1, 2};

match x {
	Point { y -> 12 } => println ("The value y is equal to 12");
	Point { y -> ref y : i32 } => { // No shadowing, y does not exists before 
		println (y);
		y = 78;
	}
}
println (x); // main.Point(1, 78)
```

## Object matching

Matching on objects is also possible. It allows you to test two things: 
- The attribute values
- The type in the case of a polymorphic type object

It is mandatory to use named binding to test the value of attributes.

```ymir
type A impl (i32, i32) {
	let a : self.0;
	let b : self.1;
	
	self (x, y) {
		self.a = x;
		self.b = y;
	}
	
}

let a = A::init (1, 2);
match a {
	A { b -> 2, a -> 3 } => println ("A (3, 2)");
	A { b -> 3 } => println ("A (_, 3)");
	A { b -> ref x : i32, a -> 1 } => println ("A (1, ", x, ")");
}```

As mentioned above, pattern matching can be used to test the type of an object.

```ymir
type A impl (i32, i32) { /* ... */ }
type B over A { /* ... */ }
type C over A { /* ... */ }

def foo (i) -> A {
	if i == 0 { return B :: init (); }
	else return C :: init ();
}

let a = foo (0);
assert (is (a : A)); 

match a {
	B {} => println ("Returned a B object");
	C {} => println ("Returned a C object"); 
	A {} => println ("Returned a A object"); // Work for A, B and C
}
```

This program will print `Returned a B object`.

## Guards

Works in progress !! 

## Mixing all that 

```ymir
struct
| entry : Point
| len : i32
 -> Square;

struct
| x : i32
| y : i32
 -> Point;

def main () {
    let z = Square {Point {1, 2}, 23};

    match z {
        Square { Point { 1 | 3, ref y : i32 }, ref len : i32 } => {
            y = 8;
            len = 54;
        }
    }
    
    println (z); // main.Square(main.Point(1, 8), 54)    
}
```
