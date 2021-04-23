# Structure

Structure is a common design used in many languages to define users'
custom types. They contains multiple values of different types,
accessible by identifiers. Structures are similar to tuples, in terms
of memory management (located in the stack). Unlike tuples, structures
are named, and all their internal fields are named as well. 

The complete grammar of structure definition is presented in the
following code block. One can note the possibility to add templates to
the definition of the structure. These templates will only be
discussed in the chapter
[Templates](https://gnu-ymir.github.io/Documentations/en/templates/),
and are not of interest to us at the moment.


```grammar
struct_type := 'struct' ('|' var_decl)* '->' identifier (templates)?
var_decl := ('mut'?) identifier ':' type ('=' expression)?
identifier := ('_')* [A-z] ([A-z0-9_])*	 
```

<br>

The fields of the structure are defined using the same syntax as the
declaration of function parameters, i.e. the same syntax as variable
declaration but with the keyword **`let`** omitted. The following
source code presents a definition of a structure **`Point`** with two
fields **`x`** and **`y`** of type **`i32`**. The two fields of this
structure are immutable, and have no default values.

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

<br>

Results:
```
main::Point(1, 2)
```

<br>

It is possible to declare a structure with no fields. Note, however,
that such structure has a size of 1 byte in memory.

<span style="color:grey">*Contribution* this is a limitation observed in gcc, maybe
this can be corrected ?</span>

```ymir
import std::io;

struct -> Unit;

def main () {
	let x = Unit ();
	println (x, " of size ", sizeof (x));
}
```
Results:
```
main::Unit() of size 1
```

## Structure construction

The construction of a structure is made using the same syntax as a
function call, that is to say using its identifier and a list of
parameters inside parentheses and separated by comas. Like function
calls, structure can have default values assigneted to fields. The
value of these fields can be changed using the *named expression*
syntax, which is constructed with the arrow operator `->`. Field
without default value can also be constructed using the *named
expression* syntax. In that case, the order of field construction is
not important.

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
Results:
```
main::Point(98, 12)
main::Point(0, 1)
```

<br>

## Field access

The fields of a structure are always public, and accessible using the
dot binary operator **`.`**, where the left operand is a value whose
type is a structure, and the right operand is the identifier of the
field.

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
structure are by default immutable. By adding the keyword **`mut`**
before the identifier of a field, the field becomes mutable. However,
the mutability is transitive in *Ymir*, meaning that a immutable value
of a struct type, cannot be modified even if its field are marked
mutable. Consequently, for a field to be really mutable, it must be
marked as such, and be a field of a mutable value.

```ymir 
import std::io

struct 
| x : i32
| mut y : i32
 -> Point;
 
def main () {
	let mut p1 = Point (1, 2);
	p1.y = 98; // y is mutable
	              // and p1 is mutable no problem
	
	p1.x = 34; // x is not mutable, this won't compile
	
	let p2 = Point (1, 2);
	p2.y = 98; // p2 is not mutable, this won't compile	
}
```
Errors:
```error
Error : left operand of type i32 is immutable
 --> main.yr:(13,4)
13  ┃ 	p1.x = 34; // x is not mutable, this won't compile
    ╋ 	  ^

Error : left operand of type i32 is immutable
 --> main.yr:(16,4)
16  ┃ 	p2.y = 98; // p2 is not mutable, this won't compile	
    ╋ 	  ^


ymir1: fatal error: 
compilation terminated.
```

## Memory borrowing of structure

By default structure data are located in the value that contains them,
i.e. in the stack inside a variable, on the heap inside a slice,
etc. They are copied by value, at assignement or function call. This
copy is static, and does not require allocation, so it is allowed
implicitely. 

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

<br>

Structure may contain aliasable values, such as slice. In that case,
the copy is no longer allowed implicitely (if the structure is
mutable, and the field containing the *aliasable* value is also
mutable, and the element that will borrow the data is also
mutable). To resolve the problem, the keywords `dcopy`, and `alias`
presented in [Aliases and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)
can be used.

```ymir
import std::io

struct 
| mut y : [mut [mut i32]]
 -> Point;

def main ()
    throws &OutOfArray
{
    let mut a = Point ([[1, 23, 3], [4, 5, 6]]);
    let mut b = dcopy a;
    let mut c = alias a;
    
    b.y [0][0] = 9; // only change the value of 'b'
    c.y [0][1] = 2; // change the value of 'a' and 'c'
    
    println (a);
    println (b);
    println (c);
}
```

<br>
Results:
```
main::Point([[1, 2, 3], [4, 5, 6]])
main::Point([[9, 23, 3], [4, 5, 6]])
main::Point([[1, 2, 3], [4, 5, 6]])
```

<br>

It is impossible to make a simple copy of a structure with the keyword
**`copy`**, the mutability level being set once and for all in the
structure definition. For example, if a structure *S* contains a field
whose type is **`mut [mut [i32]]`**, every value of type *S* have a
field of type **`mut [mut [i32]]`**. For that reason, by making a
first level *copy*, the mutability level would not be respected.

## Packed and Union

This part only concerns advanced programming paradigms, and is close
to the machine level. It is unlikely that you will ever need it,
unless you try to optimize your code at a binary level.

### Packed 

The size of a structure is calculated by the compiler, which decides
the alignment of the different fields. This is why the size of a
structure containing an `i64` and a `c8` is **16** bytes, not **9**
bytes. There is no guarantee about the size or the order of the fields
in the generated program. To force the compiler to remove the
optimized alignment, the *special modifier* **`packed`** can be
used. 

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

Results: 

```
Size of packed : 9
Size of unpacked : 16
```

### Union

The **`union`** *special modifier* , on the other hand, informs the
compiler that all fields in the structure must share the same memory
location. In the following example, the **`union`** *modifier* is used
on a structure containing two fields. The largest field of the
structure is the field **`y`** of type **`f64`**. The size of this
field is **8** bytes, thus the structure has a size of **8** bytes as
well. All the fields are aligned at the beginning of the strucures,
meaning that the field **`x`**, and **`y`** shares the same address in
memory.

```ymir
struct @union 
| x : i32
| y : f64
 -> Dummy;
```

<br>

The construction of a structure with **`union`** *modifier* requires
only one argument. This argument must be passed as a *named
expression* with the arrow operator `->`.

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

    // Comparison of pointer is only possible on pointer of the same type
    // Any pointer can be casted into a pointer of &void (the contrary is not possible)
	// is operator, checks if two pointer are equals
    assert (cast!(&void) (&(x.x)) is cast!(&void) (&(x.y)));

    // The value of x depends on the value of y
    assert (x.x == 1094713344);
    assert (x.y == 12.0f);
}
```

## Structure specific attributes

Structures have type specific attributes, as any types, accessible with
the double colon binary operator **`::`**. The table below presents
these specific attributes. These attributes are accessible using a
type of struct, and not a value. A example, under the table presents
usage of struct specific attributes.

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
