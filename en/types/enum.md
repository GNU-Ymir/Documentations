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

The enumeration can be casted according to the type of its value, but
the reverse is not possible.

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

def foo (day : [c32]) {
	println (day);
}

def bar (day : Day) {
	println (day);
}

def main () {
	foo (Day::MONDAY);
	bar (Day::MONDAY);
	// Try to add the line 
	// bar ("Mon")
}
```
