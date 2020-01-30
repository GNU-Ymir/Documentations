# Structure

Structure is a common pattern used in many languages to define
users' custom types, which contains multiple values of different
types. Structures are similar to tuples, in terms of memory management
(always located in the stack). Unlike tuples, structures have a name,
and all their internal fields also have a name.

```ymir
import std::io

struct 
| x : i32
| y : i32 
 -> Point;
 
def main () {
	let point = Point (1, 2);
	println (point);
} 
```

As you can see structure are printable.

## Structure mutability

The mutability of the field of a structure is defined within the
structure declaration. As for any variable declaration, by default the
fields of a structure are immutable. You can of course add the keyword
`mut` before the field declaration, to make it mutable. Its mutability
is therefore dependent on the mutability of the variable that borrows
the data from the structure.

```ymir 
import std::io

struct 
| x : i32
| mut y : i32
 -> Point;
 
def main () {
	let mut point = Point (1, 2);
	//  ^^^
	// Try to remove the mut here
	point.y = 98;
	
	// Try to add the following line 
	// point.x = 34;
	
	println (point);
}
```

## Memory borrowing of structure

As explained in the [Alias]() chapter, structures are only aliasable
if they contain a field whose type is aliasable. All fields in a
structure are copied each time an assignment is made.

```ymir
import std::io

struct 
| mut x : i32
| mut y : i32
 -> Point;

def main () {
	let p = Point (1, 2);
	let mut p2 = x;
	p2.y = 12; 
	println (p, " ", p2);
}
```

The above program should compile and display the following output : 

```
main::Point(1, 2) main::Point(1, 12)
```

## Default value 

You can add a default value for a field in a structure, like a
function call, it can be changed when creating a new structure, using
a named expression, which is constructed with the `->' token.

The algorithm for determining to which field an argument is associated
is the same as the one used for the function call, and is presented in
[Function]().

**Exercise :** Try to guess the output of the following program : 

```ymir
import std::io

struct 
| x : i32 = 0
| y : i32 
 -> Point;
  
def main () {
	let point = Point (y-> 12, x-> 98);
	println (point);
	
	let point2 = Point (1);
	println (point2);
}
```

## Packed and Union

This part only concern advanced programming paradigms, and are close
to the machine level. I don't think you'll ever need them unless you
try to optimize your code at a binary level.

The size of a structure is calculated by the compiler, which decides
the alignment of the different fields. This is why the size of a
structure containing an `i64` and a `c8` is `16` bytes and not `9`. To
force the compiler to remove the optimized alignment, you can use the
`packed` modifier.

```ymir
import std::io

struct @packed
| x : i64
| c : c8
 -> Packed;
 
struct 
| x : i64
| c : c8
 -> Unpacked;


def main () {
	println ("Size of packed : ", sizeof Packed);
	println ("Size of unpacked : ", sizeof Unpacked);
}
```

```
Size of packed : 9
Size of unpacked : 16
```

The `union` modifier, on the other hand, tells the compiler that all
fields in the structure must share the same memory location. The size
of the structure will then be the size of its largest field.

```ymir
import std::io

struct @union
| x : i32
| y : f32
 -> Dummy;

def main () {
    let x = Dummy (y-> 12.0f);
    println (x.x);
}
```

```
1094713344
```

As you can see, the construction of the Union requires only one
argument. You cannot give multiple arguments when building an union,
as they would be contradictory. The argument must also be passed as a
named expression (using the `->` token).