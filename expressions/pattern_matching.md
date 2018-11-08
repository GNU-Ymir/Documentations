# Pattern matching

Pattern matching is a special control structure that allows you to
decompose values in order to easily verify a condition set with a very
expressive and quite intuitive syntax.

## Simple patterns 

You can use literals directly as in a classic `switch` case`.

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

println (x); // 21
```

## Ignoring the pattern 

The `_` token allows you to define that you are not interested in the value and that therefore all values are accepted by this pattern.

```ymir
let x = Point {1, 2};

match x {
	Point {_, _} => println ("Any point");
	_ => println ("Anything");
} // This prints 'Any point'
```

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
    
    println (z); // main.SquareS(main.PointS(1, 8), 54)
    
}
```
