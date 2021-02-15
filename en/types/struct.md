# Structure

Structure is a common design used in many languages to define users'
custom types, which contains multiple values of different
types. Structures are similar to tuples, in terms of memory management
(can be located in the stack). Unlike tuples, structures have a name,
and all their internal fields also have a name. It can be said that
tuple are simply anonymus structures. 

```ymir
import std::io

struct 
| x : i32
| y : i32 
 -> Point;
 
def main () {
    let point = Point (1, 2); // initialize the value of the structure
    println (point); // structures are printable
} 
```

## Structure construction

The construction of a structure is made using the same syntax as a
function call, that is to say using its identifier and a list of
parameters inside parentheses and separated by comas. Like function
calls, structure can have default values assigneted to fields. The
value of these field can be then changed using the *named expression*
syntax, which is constructed with the `->` token.

The algorithm for determining which value will be associated to each
field is the same as that used for the function call, and is presented
in
[Function](https://gnu-ymir.github.io/Documentations/en/primitives/functions.html).

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

<br>

```
main::Point(98, 12)
main::Point(0, 1)
```

<br>

## Field access

The field of a structure are always public, and accessible using the
operator **`.`** where the left operand is a value whose type is a
structure, and the right operand is the identifier of the field.

```ymir
import std::io

struct 
| x : i32
| y : i32 
 -> Point;
 
def main ()
    throws &AssertError
{
    let point = Point (1, 2); 
    assert (point.x == 1 && point.y == 2);
}
```

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

As explained in the chapter [Alias and
References](https://gnu-ymir.github.io/Documentations/en/advanced/),
structures are only aliasable if they contain a field whose type is
aliasable. All the fields of a structure are copied each time an
assignment is made.

```ymir
import std::io

struct 
| mut x : i32
| mut y : i32
 -> Point;

def main ()
    throws &AssertError
{
    let p = Point (1, 2);
    let mut p2 = p; // make a copy of the structure
    p2.y = 12;

    assert (p.y == 2);
    assert (p2.y == 12);
}
```

## Packed and Union

This part only concerns advanced programming paradigms, and is close
to the machine level. I don't think you'll ever need it, unless you
try to optimize your code at a binary level.

The size of a structure is calculated by the compiler, which decides
the alignment of the different fields. This is why the size of a
structure containing an `i64' and a `c8'` is `16` bytes, not `9`
bytes. There is no guarantee about the size or the order of the fields
in the generated program. To force the compiler to remove the
optimized alignment, you can use the `packed` modifier.

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

def main ()
    throws &AssertError
{
    let x = Dummy (y-> 12.0f);
    assert (x.x == 1094713344);
}
```

As you can see, the construction of the Union requires only one
argument. You cannot give several arguments when building a union, as
they would be contradictory. The argument must also be passed as a
*named expression* (using the `->` token).

## Structure specific attributes

### Attributes of a type

Structure have type specific attributes, as any types, accessible with
the token **`::`**. The table below presents these specific
attributes. These attributes are accessible using a type of struct,
and not a value. A example, under the table presents usage of struct
specific attributes.

| Name | Meaning |
| --- | --- |
| `init` | The initial value of the type |
| `typeid` |  The name of the type stored in a value of type **`[c32]`** |
| `typeinfo` | A structure of type TypeInfo, containing information about the type |

All the information about TypeInfo are presented in chapter [Dynamic types]().

```ymir
mod main;

import std::io;

struct
| x : i32
| y : i32 = 9
 -> Point; 
 
def main ()
    throws &AssertError
{
    let x = Point::init;
    
    // the structure is declared in the main module, thus its name is main::Point	
    assert (Point::typeid == "main::Point");
    
    assert (x.x == i32::init && x.y == 9);
}
```

### Attributes of a value

Value of type struct have also specific attributes accessible using
the token **`::`**. This token is used because it will generate
another values of a different types at compile time, and these values
are not contained inside the structure. The table below lists the
specific attributes accessible using a value of type struct.

| Name | Meaning |
| --- | --- |
| `tupleof` | Create a immutable tuple value from the struct value  |
| `fields_address` | Used for low level operation. Create a tuple where each field is the address of the field if the struct |

An simple example of `tupleof` and `fields_address` is presented in
the following source code. The mutability of the pointers in the tuple
created by `fields_address` is the same mutability as those of the
fields of the creator struct. This attributes is used in the `std` for
low level operations, and as for pointer we do not recommand to use
this attribute unless, you know exactly what you are doing. In a
previous section, we presented that there is no guarantee on the
alignment and order of the fields in the structure in the compiled
program. The interest of `fields_address` attribute is to bypass this
limitation, when writing code that need access to the fields without
knowing the name of the fields (basically some `std` function uses
that capacity).

```ymir
struct
| x : i32
| mut y : i32
 -> Point;

def main ()
    throws &AssertError, &SegFault
{
    let mut point = Point (1, 2);
    let (x, y) = point::tupleof;

    assert (x == 1 && y == 2);

    let mut addrs : (&i32, dmut &i32) = alias (point::fields_address);
    //                                  ^^^^^
    // The alias is mandatory, we try to borrow data using a pointer, which is an aliasable type
    // The first element of addrs can't be mutable, because x is not mutable in the structure
    
    *(addrs._1) = 9; // modifying 'y' value of point

    assert (point.y == 9);

    let imut_addrs = point::fields_address; // here not need for alias
    assert (*(imut_addrs._1) == 9);
}
```
