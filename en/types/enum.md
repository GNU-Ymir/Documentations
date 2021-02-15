# Enumeration

Enumerations are user-defined types that have a set of values. The
keyword `enum` is used to define an enumeration type. The type of the
fields is inferred at compile time, thanks to the value associated with
them. It is mandatory that each field shares the same type.

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
content value of the field in the source code. The result of the
expression have the type of the enumeration, and can be implicitely
casted into the type of its content. An example of enumeration access
is presented in the following source code.

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
a `Day`, the compiler will return an error. The error is presented in
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

## Enumeration specific attributes

