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
pattern_call := (type | '_') '(' (pattern_argument (',' pattern_argument)*)? ')'
pattern_arguments := (Identifier '->')? pattern_expression
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
declaration but with keyword **`let`** ommitted. The variable pattern
can also be used to match over the type of the expression that is
tested, when the type of the variable can be dynamic (e.g. on class
inheritance). In all other cases the test is done during the
compilation, and the type of the newly declared variable must in any
case be fully compatible with the type of the value that is tested. In
the following example, the type of the variable patterns is always
**`i32`**, because it is the only compatible type with the type of the
value.

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
is evaluated, leading to the following result. 

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

### Matching over type

When the type of the value that is tested can be dynamic (i.e. class
inheritance, which is the only possibility), then the type of the
variable in the test can be used to test the type of the value. In the
following example, the class **`Bar`** and **`Baz`** inherit from the
abstract class **`Foo`**. The variable **`x`** declared in the
**`main`** function, is of type **`Foo`** meaning that it can contains
either a **`Bar`** or a **`Baz`** value. The *match* expression then
make a test over the type of the variable **`x`**.

```ymir
import std::io;

class @abstract Foo {
	self () {}
}

class Bar over Foo {
	pub self () {}
}

class Baz over Foo {
	pub self () {}
}

def foo ()-> &Foo {
	Bar::new ()
}

def main () {
	let x = foo ();
	match x {
		_ : &Bar => println ("Contains a Bar");
		_ : &Baz => println ("Contains a Baz");		
	}
}
```

<br>

Results: 

```
Contains a Bar
```

<br>

There is another pattern that can be used to test a dynamic type, that
is presented in a following sub section (*cf*. Destructuring class),
but pattern matching is the only way to cast a value whose type is an
ancestor class to an heir class, and this way is **safe**. In many
language like Java, D or C++, it is possible to use the casting
system, that has a undefined behavior in C++, makes the program crash
in Java, and returns the value `null` in D. These three behaviors are
not acceptable since they are not safe. By using the pattern matching,
the failing case is let to the discretion of the user. And as we have
seen in the introduction of this chapter, because a match can't have a
value if there is a possibility that none of the branch were entered,
then the user has to write a default case when the cast failed if they
want to retreive a value from the matching. This default case can of
course be used to throw an exception (*cf* [Error
handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html)).

### Reference variable

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

Destructuring patterns are patterns that divide the values contained
in a value is type is a compound type. Compound types are 1) tuple, 2)
structures and 3) classes. 


### Destructuring a tuple

To destructure a tuple, parentheses surrounding other patterns are
used. The arity of the destructuring pattern must be the same as the
arity of the tuple that is destructured. In the following example, a
tuple of arity **`3`**, and type **`(i32, c32, f64)`** is
destructured, using two different patterns. The first pattern only
check the first value of the tuple (the other are always true, using
the token **`_`**), by verifying that the value is equals to **`1`**
and putting it in the variable **`i`**. The second pattern does not do
any tests but associate the values of the tuple to the variable
**`x`**, **`y`** and **`z`**. As one can note from that test, any
pattern can be used to test inner values of the tuple, (another
destructuring pattern if the inner value is a compound type, a range
pattern, etc.)

```ymir
import std::io

def main () {
	let tuple = (1, 'x', 3.14)
	
	match tuple {
		(i : i32 = 1, _, _) => {
			println ("This tuple has an arity of three and its first element is an i32, whose value ", i, " == 1");
		} 
		(x : _, y : _, z : _) => {
			println ("This tuple has an arity of three, and its values are : (", x, ", ", y, ", ", z, ")");
		}		
	}
}
```

<br>

Results: 

```
This tuple has an arity of three and its first element is an i32, whose value 1 == 1
```

### Destructuring structure

Destructuring structure is made by using a *call* expression. The
argument of the call expressions are patterns. Unlike tuple
destructuring, there is no need to test all the values of the
structure, but only those which are relevant. The order of the fields
is respected in the destructuring (i.e. the pattern, at line 15 of the
following example, tests the value of the field **`x`**). *Named
expressions* can be used to test specific fields of the structure.

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


<br>

Of course, any kind of pattern can be used inside a structure
destructuring, for example a variable pattern, that refers to the
values later in the content of the pattern. In the following example,
a variable **`p`** is declared to refer to the value contained in the
variable **`point`**, and a variable **`y`** is declared to refer to
the value contained in the field **`point.y`**.

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
destructuring structure. However, only *named expressions* are
admitted, and this expressions refer to object fields that must be
public in the context of the pattern matching. For example, in the
source code below, the field **`x`** of the class **`Point`** is
public from the context of the **`main`** function, for that reason it
is accessible inside the class destructuring pattern. On the other
hand the field **`_y`** is private for the **`main`** function, thus
cannot be used.

```ymir
import std::io

class Point {
	pub let x : i32 = 1;
	let _y : i32 = 2;
	
	pub self () {}
}

def main () {
	let p = Point::new ();
	
	match p {
		Point (x-> 1, _y-> 2) => {
		    println (p.x, " is a equal to 1");
		}
	}
}
```

<br>

Errors: 
```error
Error : undefined field _y for element &(main::Point)
 --> main.yr:(14,17)
14  ┃ 		Point (x-> 1, _y-> 2) => {
    ╋ 		              ^
    ┃ Note : i32 --> main.yr:(5,11) : _y is private within this context
    ┗━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

We have seen in a previous section (*cf*. Matching over type), that
because class types are dynamic when there is inheritance, pattern
matching can be used to test the type of the values. Class
destructuring is an alternative way to check the type of a value,
whose type is a class that have heirs. The following example,
demonstrate the use of the pattern matching to retreive the center of
a **`Shape`** when it is a **`Circle`**. In this example, the
**`foo`** function lied, and returned a **`Rectangle`** instead of a
**`Circle`**, in order to be compilable the source code must manage
that case, otherwise the variable **`center`** declared at line
**`28`** could be unset, and that is prohibited by the language.

```ymir
import std::io

class @abstract Shape {
	self () {}
}

class Rectangle over Shape {
	pub self () {}
}

class Circle over Shape {
	pub let center : i32 ;

	pub self (center : i32) with center = center {}
}

/**
 * Don't worry I will return you a circle
*/
def foo () -> &Shape {
	Rectangle::new ()
}

def main () {
	let circle = foo ();
	let center = match circle {
		Circle (center-> c : _) => c
	};
	println ("The center of the circle is : ", center);
}
```

<br>

Errors: 
```error
Error : match of type i32 has no default match case
 --> main.yr:(28,15)
28  ┃ 	let center = match circle {
    ╋ 	             ^^^^^

Error : undefined symbol center
 --> main.yr:(31,45)
31  ┃ 	println ("The center of the circle is : ", center);
    ╋ 	                                           ^^^^^^


ymir1: fatal error: 
compilation terminated.
```

<br>

This can be corrected by adding a default case to the *match*
expression. The following source codes are two possibilities.

- 1) Setting a default value : 

```ymir
def main () {
	let circle = foo ();
	let center = match circle {
		Circle (center-> c : _) => c
		_ => {
			println ("Foo lied ....");
			0 // center is equal to 0, if foo returned something other than a Circle
		}
	};
	println ("The center of the circle is : ", center);
}
```

- 2) Throwing an error (*cf*. [Error
handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html))

```ymir
def main ()
    throws &AssertError
{
    let circle = foo ();
    let center = match circle {
		Circle (center-> c : _) => c
        _ => {
            throw AssertError::new ("Foo lied...");
        }
    };
    println ("The center of the circle is : ", center);
}
```

<br>

A pattern using an ancestor class, will succeed if the object instance
that is used is a heir class. That is to say, if the pattern tries to
get a **`Shape`** value, when giving a **`Circle`** value to the
pattern, the pattern test succeeds. So the order has to be carefully
set (putting heir class tests first). The phenomenon is the same with
variable patterns. **Contribution** Add verification when a pattern
test cannot be entered because previous test is always valid.

```ymir
def main () {
	let circle : &Shape = Circle::new (); // Important to have a &Shape, and not a &Circle
	match circle {
		Shape () => {
			println ("Shape");
		}
		Circle () => {
			println ("Circle");
		}
	}
}
```

<br>

Results: 

```
Shape
```
