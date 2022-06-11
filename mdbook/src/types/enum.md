# Enumeration

Enumerations are user-defined types that enumerates a list of
values. The keyword `enum` is used to define an enumeration type. The
type of the fields can be inferred from the value associated to the
fields. This type can be forced using the type operator **`:`**, after
the keyword **`enum`**. All the fields of an enumeration shares the
same type.

The complete grammar of an enumeration is presented in the following
source block. As for struct declaration, templates can be used, but
this functionnality will only be discussed in the
[Templates](https://ymir-lang.org/templates/)
chapter.

```grammar
enum_type := 'enum' (':' type)? (inner_value)+ '->' identifier (templates)?;
inner_value := '|' identifier '=' expression
identifier := ('_')* [A-z] ([A-z0-9_])*	
```

<br>

In the following source code, an example of an enumeration of type
**`[c32]`** is presented. This enumeration lists the names of the
days.

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

The values of an enumeration are accessible using the double colon
binary operator **`::`**. In practice, access a value of the
enumeration will past the content value of the field at the caller
location. The value - result of the expression - is of the type of the
enumeration (for example the type **`Day`** in the example below).


### Value types

An example of enumeration access is presented in the following source
code. In this example, implicit casting is perform from a **`Day`** to
a **`[c32]`**, when calling the function **`foo`**, at line
**23**. This implicit cast is allowed.

```ymir
import std::io

enum : [c32] // the type is optional
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

However, the contrary is not allowed, because the source code tries to
cast a **`[c32]`** into a **`Day`** at line **28**, the compiler
returns an error. The error is presented in the code block below. Such
cast is forbidden, to avoid enumeration value to contain a value that
is actually not defined in the list of the field of the
enumeration. For example, if this was accepted, the string
**`"NotADay"`** would be castable into a **`Day`** (*note:* the value
of the string being possibly unknown at compilation time).

```error
Error : the call operator is not defined for main::bar and {mut [c32]}
 --> main.yr:(28,9)
28  ┃     bar ("Mon")
    ╋         ^     ^
    ┃ Note : candidate bar --> main.yr:(17,5) : main::bar (day : main::Day([c32]))-> void
    ┃     ┃ Error : incompatible types main::Day and mut [c32]
    ┃     ┃  --> main.yr:(28,10)
    ┃     ┃ 28  ┃     bar ("Mon")
    ┃     ┃     ╋          ^
    ┃     ┃ Note : for parameter day --> main.yr:(17,10) of main::bar (day : main::Day([c32]))-> void
    ┃     ┗━━━━━━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

### Value constructions

Enumeration values can be more complex than literals. Any kind of
value can be used, for example call functions, condition block, scope
guards, etc. In the following example, an enumeration creating
structure from function call is presented. The type of the enumeration
is **`Ipv4Addr`**.

```ymir
import std::io

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
    assert (addr.a == 127);
}
```

<br>

The enumeration value of a field is constructed at each access, this
means for example that when enumeration values are constructed using
function call, the function is called each time the enumeration field
is accessed. Thus the result of the execution of the compiled source
code above is the following:

```
Call localhost
Call localhost
Call broadcast
```

<br>

### Value context

If the value of the enumeration seems to be passed at the caller
location, they don't share the context of the caller. In other words,
the fields of an enumeration have access to the symbol accessible from
the enumeration context, and not from the caller context. An example,
of enumeration trying to access symbols is presented in the source
code bellow.

```ymir
import std::io

static __GLOB__ = true;

enum 
| FOO = (if (x) { 42 } else { 11 })
| BAR = (if (__GLOB__) { 42 } else { 11 })
 -> ErrorEnum;
 
def main () {
	let x = false;
	
	println (ErrorEnum::FOO); 
}
```

<br> 

From the above example, the compiler returns an error. In this error,
the compiler informs that the variable **`x`** is not defined from the
context of the enumeration. Even if the variable is declared inside
the **`main`** function, it is not accessible from the enumeration
context. The global variable **`__GLOB__`** is accessible from the
enumeration context, and thus accessing it is not an issue.

```error
Note : 
 --> main.yr:(6,3)
 6  ┃ | FOO = (if (x) { 42 } else { 11 })
    ╋   ^^^
    ┃ Error : undefined symbol x
    ┃  --> main.yr:(6,14)
    ┃  6  ┃ | FOO = (if (x) { 42 } else { 11 })
    ┃     ╋              ^
    ┗━━━━━┻━ 

Note : 
 --> main.yr:(13,11)
13  ┃ 	println (ErrorEnum::FOO); 
    ╋ 	         ^^^^^^^^^
    ┃ Error : the type main::ErrorEnum is not complete due to previous errors
    ┃  --> main.yr:(8,5)
    ┃  8  ┃  -> ErrorEnum;
    ┃     ╋     ^^^^^^^^^
    ┃     ┃ Note : 
    ┃     ┃  --> main.yr:(13,11)
    ┃     ┃ 13  ┃ 	println (ErrorEnum::FOO); 
    ┃     ┃     ╋ 	         ^^^^^^^^^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

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
is the same (double colon binary operator **`::`**), and therefore
that if an enumeration have a field named as a specific attributes
there is a conflict. To avoid conflict, the priority is given to the
fields of the enumeration, and specific attributes can be accessed
using their identifier surrounded by **`_`** tokens. For example,
accessing the `members` specific attributes can be made using the
identifier `__members__`. An example of the principle is presented in
the following source code. The specific attribute surrounding is
applicable to all types, but can be really usefull here.

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
