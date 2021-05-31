# Pattern matching

The pattern matching is an important part of the *Ymir* language. It
allows to make test over values and moreover on types, especially when
it comes to objects. The pattern matching syntax always start with the
keyword `match` followed by an expression, and then a list of patterns
enclosed between `{}`.

The syntax of the pattern matching is described in the following code block.

```grammar
match := 'match' expression '{' pattern* '}'
pattern := pattern_expression '=>' expression (';')?

pattern_expression :=   pattern_tuple 
                      | pattern_option 
					  | pattern_range 
					  | pattern_var 
					  | pattern_call
					  | expression
					  
pattern_tuple := '(' (pattern_expression (',' pattern_expression)*)? ')'
pattern_option := pattern_expression ('|' pattern_expression)*
pattern_range := pattern_expression ('..' | '...') pattern_expression 
pattern_var := (Identifier | '_') ':' (type | '_') ('=' pattern_expression)?
pattern_call := (type | '_') pattern_tuple 
```

<br>

Match is a kind of control flow, relatively close to *if*
expressions. As *if* expressions, a *match* expression can have a
value. In that case, every branch of the *match* must share the same
type, and there must be a guarantee that at least one test of the
*match* succeed, and thus that a branch is entered. For example, in
the following example, all the branch of the *match* share the same
type **`i32`**, however it is possible (and even inevitable in that
specific case), that no branch of the *match* were entered. So the
compiler throws an error, as the variable **`x`** might be unset,
which is prohibited by the language. In the following example, simple
tests are made on the value, so the first pattern is equal to an *if*
expression, where the test is **`12 == 1`**.

```ymir
def main () {
	let x = match (12) {
		1 => 8
		2 => 7
		3 => 6
	};
}
```

<br>
Errors : 

```error
Error : match of type i32 has no default match case
 --> main.yr:(2,10)
 2  ┃ 	let x = match (12) {
    ╋ 	        ^^^^^


ymir1: fatal error: 
compilation terminated.
```

## Matching on everything

The token **`_`** declares a pattern test that is always valid. It can
be placed at different level of the pattern test, as we will see in
the rest of this chapter.

```ymir
import std::io;

def main () {
	match 42 {
		_ => { println ("Always true"); }
	}
}
```

<br>

## Matching over a range of values

Pattern matching aims to be more expressive than *if* expressions, and
therefore to allow faster writting of complex test. For example, to
check wether a value is included in an interval of values, writing the
interval in the test of the pattern is sufficient. In the following
example, the first pattern can be rewritten as the following *if*
expression : **`1 <= 42 && 10 > 42`**, the second into : **`10 <= 42
&& 40 >= 42`**, and the third one into : **`42 == 41 || 42 == 42 || 42
== 43`**.

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

<br>

The pattern are tested in the order they are written in the source
code, thus if two pattern are valid, only the first one is
entered. For example, in the following source code, only the pattern
at line **`5`** is entered, and the pattern at line **`6`**, even if
it is valid, is simply ignored.

```ymir
import std::io;

def main () {
	match 42 {
		1 .. 100 => { println ("Between 1 and 100"); }
		10 .. 100 => { println ("Between 10 and 100"); }
	}
}
```

## Variable pattern

A variable declaration can be used to store a value during the pattern
matching. The variable is declared like a standard variable
declaration but with keyword **`let`** ommitted. 

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

<br>

In the above example, every pattern tests are valid, but only the first pattern
is evaluated. 

Results : 

```
It is a i32, but I don't care about the value
```

<br>

One can note that the token **`:`** is important in that case, even if
the type is not mandatory and can be omitted (by replacing it with the
token **`_`**). This is to distinguish a variable declaration to a
simple variable referencing. For example, in the following source
code, a variable **`x`** is declared before the pattern matching, and
its value is compared with the value that is tested in the *match*. A
second pattern declares a variable **`y`**.

```ymir
import std::io;

def main () {
	let x = 42;
	match 42 {
		x => { println ("x == 42"); } // simple test on the variable declare 2 lines above
		y : _ => { println (y); } // declaration of a new variable y that stores the matched value 
	}
	
}
```

<br>
Results: 
```
x == 42
```


<br>

A mutable value can be updated inside a pattern, by using a reference
variable. This works exactly like variable referencing (as presented
in chapter
[References](https://gnu-ymir.github.io/Documentations/en/advanced/references.html)).

```ymir
import std::io

def main () {
	let mut z = 1;
	match ref z {
		// ^^^
		// ref is important here, otherwise the compiler throw an error
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

```ymir
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
		Point () => {
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
	
	pub self () {}
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

It is the only way to check a inheritance in *Ymir*, and this way is
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
