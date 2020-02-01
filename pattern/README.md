# Pattern matching

The pattern matching is an important part of the **Ymir** language. It
allows to make test over values and moreover on types, especially when
it comes to objects. The pattern matching syntax always start with the
keyword `match` followed by an expression, and then patterns enclosed
between `{}`.

```ymir
import std::io

def main () {
	match (42) {
		1 => println ("The answer is one");
		2 => println ("The answer is two");
		_ => println ("I don't know, but neither one nor two...")
	}
}
```

Match like every other element of the **Ymir** language are
expression. You can use a match to get a value, but all branch of the
match must have the same type. If the case that the compiler is not
sure that a branch will be entered and will return a value in every
case, you will get an error saying that the pattern matching does not
have a default value.

```ymir
def main () {
	let x = match (12) {
		1 => 8
		2 => 7
		3 => 6
	};
}
```

```
Error : match of type i32 has no default match case
 --> main.yr:(2,13)
    | 
 2  |     let x = match (12) {
    |             ^

ymir1: fatal error: 
compilation terminated.
```

## Matching multiple values

You can check multiple values in one pattern with the token `|`, which
semantic is the same as a or. You can also check interval using the
keyword `..` and `...`.

```ymir
import std::io

def main () {
	match 42 {
		1 .. 10 => {
			println ("The answer is between 1 and 10 not included");
		}
		10 ... 40 {
			println ("The answer is between 10 and 40 included");
		}
		41 | 42 | 43 => {
			println ("The answer is either 41, 42 or 43");
		}
	}
}
```

The pattern are tested in the order they are written, and the matching
never enter two different pattern even if two of them return a valid
match.

## Variable pattern

You can use a variable that will take the value of the element that is
matched. The variable is declared like a standard variable declaration
but with token `let` ommitted. You don't have to specify the name or
the type of the variable, but there must be the token `:` somewhere,
so if you don't wan't to specify the type, you can just use the token
`_`.

```ymir
import std::io

def main () {
	match 13 {
		_ : i32 => {
			println ("It is a i32, but I don't care about the value");
		}
		_ : i32 = 13 => {
			println ("It is a i32, whose value is 13");
		}
		_ : _ = 13 => {
			println ("It is a i32, whose value is 13, but I didn't checked the type");
		}		
		x : i32 => {
			println ("It is a i32, and the value is : ", x);
		}
	}
}
```

In the above example, every test will pass, but only the first pattern
will be evaluated, and the output of this program will only be : `It
is a i32, but I don't care about the value` 

You can pass a value by reference in a pattern matching to modify it
inside a valid pattern.

```ymir
import std::io

def main () {
	let mut z = 1;
	match ref z {
		// ^^^
		// Try to remove the ref
		ref mut x : _ => {
			x = 42;
		}
	}
	
	println (z);
}
```

## Destructuring patterns

There are two types of destructuring patters, for tuple by using
pattern inside parenthese, or for structure and classes by using a
Call syntax. When you want to destructure a tuple, you will just have
to use parentheses that will surround any patterns, that are presented
in this section.

```
import std::io

def main () {
	let tuple = (1, 'x', 3.14)
	
	match tuple {
		(_ : i32 = 1, _, _) => {
			println ("This tuple has an arity of three and its first element is an i32, whose value is 1");
		} 
		(x : _, y : _, z : _) => {
			println ("This tuple has an arity of three, and its values are : (", x, ", ", y, ", ", z, ")");
		}		
	}
}
```

### Destructuring structure

The destructurating of a structure is made like a call of the
structure. But you don't have to secify all the fields, but only those
you want to check.

```ymir
import std::io

struct
| x : i32
| y : i32
 -> Point;
    
def main () {
    let p = Point (1, 2);
    
    match p {
        Point (y-> 1) => {
            println ("Point where y is equal to 1");
        }
		Point (1) => {
			println ("Point where x is equal to 1");
		}
		Point () {
			println ("Any point");
		}
    }
}
```

You can of course with a variable pattern refer to the values later in
the pattern, for both the structure or even its fields. Reference
variable works the same as well.

```ymir
import std::io

struct
| x : i32
| y : i32
 -> Point;
    
def main () {
    let point = Point (1, 2);
    
    match point {
        p : _ = Point (y-> y : i32) => {
            println (p, " is a point, whose y field is equal to ", y);
        }
    }
}
```

### Destructuring class

The syntax for destructuring object is the same as the syntax for
destructuring structure. However, the parameters inside the
parentheses will referes to object attributes that must be public in
the context of the pattern matching.

```ymir
import std::io

class Point {
	pub let x : i32 = 1;
	let y : i32 = 2;
	
	self () {}
}

def main () {
	let p = Point::new ();
	
	match p {
		Point (x-> 1) => {
		//     ^
		// Try to replace with y
			println (p.x, " is a equal to 1");
		}
	}
}
```

Unlike structure destructuring, the type of the object is also
checked. It can be useful when dealing with inheritance. 

```ymir
import std::io

class @abstract Shape {
	self () {}
}

class Rectangle over Shape {
	self () {}
}

class Circle over Shape {
	self () {}
}

def foo () -> Shape {
	Circle::new ()
}

def main () {
	let s = foo ();
	match s {
		Circle () => {
			println ("Foo returned a circle");
		}
		Rectangle () => {
			println ("Foo returned a rectangle");
		}
	}
}
```

It is the only way to check a inheritance in **Ymir**, and this way is
safe. In many language like Java, D or C++, you will have the right to
use the casting system, that will have a undefined behavior in C++,
and make a program crash in Java, and will return the value `null` in
D. Those three behavior are not acceptable since they are not
safe. The pattern matching will allow you to specify the behavior when
the cast has failed, for example, if you want to get the center of
circle :

```ymir
import std::io

import std::io

class @abstract Shape {
	self () {}
}

class Rectangle over Shape {
	self () {}
}

class Circle over Shape {
	pub let center : i32 ;

	self (center : i32) with center = center {}
}

/**
 * Don't worry I will return you a circle
*/
def foo () -> Shape {
	Rectangle::new ()
}

def main () {
	let circle = foo ();
	let center = match circle {
		Circle (center-> center : _) => center
		_ => {
			println ("That's not a circle, foo lied!");
			0 // No need to have confidence in foo 
		}
	};
	println ("The center of the circle is : ", center);
}
```
