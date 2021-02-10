# Structures

A structure is a custom type, allowing you to group several values into a type with a name. Their composition is equivalent to that of the tuples, we can see the tuples as anonymous structures. The keyword `struct` allows you to define a new structure.

```ymir

// A structure with two fields
struct 
| x : f64,
| y : f64
 -> Point;

// A structure can contain fields whose type is a structure
struct
| a : Point
| b : Point
 -> Rectangle;

def main () {
    // You must fill in all the data to build a structure
    let point = Point { 1.1, 1.7 };

	// It is also possible to build a structure without giving it any value
    // All fields will be filled with their value::init
    let point2 = Point::init; 

    // It is possible to transform a structure into a tuple
    let (x, y) = point.tupleof;
    println ("(", x, ", ", y, ")");

    let rect = Rectangle { point, Point { 3.3, 4.5 } };

	// Structures are displayable elements
    println (rect);
}
```

## Structure attributes

It is possible to modify the alignment of types in a structure. To do this, you must use a structure attribute, which is declared at the same time as the structure using the `@` token.

```ymir

struct @packed
| a : char 
| b : i32
| c : char
 -> Packed;
 
struct 
| a : char
| b : i32 
| c : char 
 -> Unpacked;
 
def main () {
	println (Packed::sizeof); // 6
	println (Unpacked::sizeof); // 12
} 
 
```
