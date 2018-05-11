# Structures

Structures are tuple with a name and type descriptor. This descriptor is created with the keyword `struct`.

```text
/* Two possible syntaxes */

// A structure with two fields
struct Point {
    x : double,
    y : double
}

// Struct can be field of another struct
struct
| a : Point
| b : Point
-> Rectangle;

def main () {
    // all values are needed
    let point = Point { 1.1, 1.7 };

    // // A struct can be constructed without value either
    // // All fields are set two 0x0.
    let point2 = Point::init; 

    // // We can get a tuple from a structure
    let (x, y) = point.tupleof;
    println ("(", x, ", ", y, ")");

    let rect = Rectangle { point, Point { 3.3, 4.5 } };

    // // Structure are printable.
    println (rect);    
}
```

