# Enumeration

Enumerations are user-defined types that enumerates a list of
values. The keyword `enum` is used to define an enumeration type. The
type of the fields can be inferred at compile time, thanks to the
value associated with them, but can also be forced using the keyword
**`:`** after the keyword **`enum`**. It is mandatory that each field
shares the same type.

The complete grammar of an enumeration is presented in the following
source block. As for struct declaration, templates can be used, but
this functionnality will only be discussed in the
[Templates](https://gnu-ymir.github.io/Documentations/en/templates/)
chapter.

```grammar
enum_type := 'enum' (':' type)? (inner_value)+ '->' identifier (templates)?;
inner_value := '|' identifier '=' expression
identifier := ('_')* [A-z] ([A-z0-9_])*	
```

<br>

A simple example of utilization of an enum type is presented in the
source code below, where an enum type `Day` of type `[c32]` is
defined.

```ymir
import std::io

enum
| MONDAY = "Mon"
| TUESDAY = "Tue"
| WEDNESDAY = "Wed"
| THURSDAY = "Thu"
| FRIDAY = "Fri"
| SATURDAY = "Sat"
| SUNDAY = "Sun"
 -> Day;

def foo (day : Day) {
    println (day);
}

def main () {
	let d = Day::MONDAY;
	foo (d);
}
```

## Value access

The values of an enumeration are accessible using the token
**`::`**. In practice, access a value of the enumeration will past the
content value of the field at the caller location. The result of the
expression have the type of the enumeration (for example the type
**`Day`** in the example below), and can be implicitely casted
into the type of its content (for example **`[c32]`** in the example
below). An example of enumeration access is presented in the following
source code.

```ymir
import std::io

enum : [c32]
| MONDAY = "Mon"
| TUESDAY = "Tue"
| WEDNESDAY = "Wed"
| THURSDAY = "Thu"
| FRIDAY = "Fri"
| SATURDAY = "Sat"
| SUNDAY = "Sun"
 -> Day;

def foo (day : [c32]) {
    println (day);
}

def bar (day : Day) {
    println (day);
}

def main () {
	// the internal type Day is of type [c32], so it can be implicitely casted into [c32]
	foo (Day::MONDAY);
	
	bar (Day::MONDAY);

	// However, it is impossible to transform a [c32] into a Day implicitely
	bar ("Mon")
}
```

<br>

With the above source code, because we try to cast a **`[c32]`** into
a **`Day`**, the compiler will return an error. The error is presented in
the code block below.


```error
Error : the call operator is not defined for type main::bar and {mut [c32]}
 --> main.yr:(28,6)
    ┃ 
28  ┃ 	bar ("Mon")
    ┃ 	    ^     ^
    ┃ Note : candidate bar --> main.yr:(17,5) : main::bar (day : [c32])-> void
    ┃ Error : incompatible types main::Day and mut [c32]
    ┃  --> main.yr:(28,7)
    ┃     ┃ 
    ┃ 28  ┃ 	bar ("Mon")
    ┃     ┃ 	     ^
    ┃ 
    ┃ Note : parameter day --> main.yr:(17,10) : main::bar (day : [c32])-> void
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

Enumeration values can be more complex than literals, and can for
example call functions, create structures, etc. An example of
enumeration creating structure from function call is presented in the
source code below. 

```ymir
struct
| a : i32
| b : i32
| c : i32
| d : i32
 -> Ipv4Addr;

enum
| LOCALHOST = localhost ()
| BROADCAST = broadcast ()
 -> KnownAddr;

def localhost ()-> Ipv4Addr {
    println ("Call localhost");
    Ipv4Addr (127, 0, 0, 1)
}

def broadcast ()-> Ipv4Addr {
    println ("Call broadcast");	
    Ipv4Addr (255, 255, 255, 255)
}

def main ()
    throws &AssertError
{
    let addr = KnownAddr::LOCALHOST; // will call localhost here

    assert (KnownAddr::LOCALHOST.a == 127); // a second time here
    assert (KnownAddr::BROADCAST.d == 255); // call broadcast here
}
```

<br>

The enumeration value of a field is constructed at each access, this
means for example that when enumeration values are constructed using
function call, the function is called each time the enumeration field
is accessed. Thus the result of the execution of the compiled source
code above will be the following:

```
Call localhost
Call localhost
Call broadcast
```

<br>

## Enumeration specific attributes

As for any type, enumeration have specific type attributes. The table
below lists the enumeration type specific attributes.

| Name | Meaning |
| --- | --- |
| `members` | A slice containing all the values of the enumeration |
| `member_names` | A slice of [c32], containing all the names of the fields of the enumeration (same order than `members`)
| `typeid` | The type identifier of the enumeration type in a `[c32]` typed value |
| `typeinfo` | The typeinfo of the inner type of the enumeration (cf. [Dynamic types]()) |
| `inner` | The inner type of the enumeration |

<br>

One may note that the operator to access specific attributes and field
is the same, and therefore that if an enumeration have a field named
as a specific attributes there will be a conflict. To avoid conflict,
the priority is given to the fields of the enumeration, and specific
attributes can be accessed using their identifier surrounded by
**`_`** tokens. For example, accessing the `members` specific
attributes can be made using the identifier `__members__`. An example
of the principle is presented in the following source code. The
specific attribute surrounding is applicable to all types, but can be
really usefull here.

```ymir
mod main;

enum
| typeid       = 1
| typeinfo     = 2
| members      = 3
| member_names = 4
| inner        = 5
 -> AnnoyingEnum;

def main ()
    throws &AssertError
{
    assert (AnnoyingEnum::typeid == 1);
    assert (AnnoyingEnum::__typeid == AnnoyingEnum::__typeid__);
    assert (AnnoyingEnum::__typeid == "main::AnnoyingEnum");	
}
```