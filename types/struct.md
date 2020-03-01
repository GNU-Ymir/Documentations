# Structure

Structure is a common design used in many languages to define users'
custom types, which contains multiple values of different
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

The mutability of a field of a structure is defined in the structure
declaration. As with any variable declaration, the fields of a
structure are by default immutable. You can of course add the keyword
`mut` before the declaration of the field, to make it mutable. Its
mutability therefore depends on the mutability of the variable that
borrows the data from the structure.

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

As explained in the chapter [Alias](), structures are only aliasable
if they contain a field whose type is aliasable. All the fields of a
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

You can add a default value for a field in a structure, such as a
function call, it can be changed when creating a new structure, using
a named expression, which is constructed with the `->` token.

The algorithm for determining which field an argument is associated
with is the same as that used for the function call, and is presented
in [Function]().

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
<div class="spoiler_head"> <strong>Correction</strong> (spoiler) : </div>
{%s%}
<pre class="language-" style="position: relative;" class="spoiler"><code>main::Point(98, 12)
main::Point(0, 1)
</code></pre>
{%ends%}


## Packed and Union

This part only concerns advanced programming paradigms, and is close
to the machine level. I don't think you'll ever need it, unless you
try to optimize your code at a binary level.

The size of a structure is calculated by the compiler, which decides
the alignment of the different fields. This is why the size of a
structure containing an `i64' and a `c8'` is `16` bytes, not `9`
bytes. To force the compiler to remove the optimized alignment, you
can use the `packed` modifier.

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
argument. You cannot give several arguments when building a union, as
they would be contradictory. The argument must also be passed as a
named expression (using the `->` token).
