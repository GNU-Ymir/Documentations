# Objects

Objects are particular custom types on which methods can be defined to
specify treatments. The objects present in **Ymir** are a little
different from those proposed in other object languages in terms of
how inheritance works.

As in any object-oriented language, an object is instantiated from a
class that will serve as its pattern. A class is defined by the
keyword `type`, and applies to a predefined type using the keyword `impl`.

The predefined type can be anything, a structure, a tuple, a
enumerated type, etc...

```ymir

struct 
| x : i32
| y : i32
 -> Point;

type MyType impl (u64, Point) {
}

```


This section will present the different elements that make up an object type :
- Attributes
- Construction, lifetime and deconstruction 
- Methods
- Inheritance

