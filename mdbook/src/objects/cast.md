# Cast, and dynamic typing

An object instance of a heir class can be casted to an object instance
of an ancestor class. Unlike, casting of integer values,
(e.g. **`i32`** to **`i64`**), because an object is an aliasable type,
the memory size of the object is not modified. Casting must respect
mutability of the object value. Moreover, this cast can be made
implicitely, as it does not create any problem in memory. In the
following example, the class **`Bar`** inherits from the class
**`Foo`**. A variable **`x`** is created, and is of type
**`&Bar`**. At line **`1`**, an implicit cast is made of a **`&Bar`**
value to a **`&Foo`** value, the same cast is made but explicitely at
line **`1`**.

```ymir
import std::io;

class Foo {
	pub self () {}
	
	pub def foo (self) {
		println ("Foo");
	}
}

class Bar over Foo {
	pub self () {}
	
	pub over foo (self) {
		println ("Bar");
	}
}

def baz (f : &Foo) {
	f.foo ();
}

def main () {
	let x = Bar::new ();
	baz (x);
	
	let y = cast!{&Foo} (x);
	y.foo ();
}
```

<br>
Results:

```
Bar
Bar
```

## Dynamic typeinfo

One can note from the above example, that when a variable contains a
value of type **`&Foo`**, that does not necessarily mean that this is
a pure **`&Foo`** value, but it can be a **`&Bar`**. In object
oriented programming, this principle is denote polyphormism. In the
chapter [Basic programming
concepts](https://gnu-ymir.github.io/Documentations/en/primitives/),
we have seen that every object has specific attributes. Object is no
exception to the rule. The following table lists the default specific
attributes of the object types.

| Name | Meaning |
| --- | --- |
| `typeid` | The name of the type stored in a value of type [c32] |
| `typeinfo` | A structure of type TypeInfo, containing information about the type |

These attributes are compile time executed, and thus are static. For
example, in the following source code, the typeid of the class
**`Bar`** is printed to stdout, followed by a line that does exactly
the same thing (literraly).

```ymir
def main () {
	println (Bar::typeid);
	println ("main::Bar");
}
```

<br>

When it comes to dynamic typing, it can be interesting to get the
typeinfo of the type of the value that is actually stored inside the
variable (e.g. get the typeinfo of the **`Bar`** class, type of the
value contained inside a **`&Foo`** variable). To do that, the
specific attribute **`typeinfo`** of object is also accessible from
the value directly, and this time dynamically.

```ymir
def main () {
	let x = Bar::new ();
	let y : &Foo = x;
	
	println (y::typeinfo);
}
```

<br>

Results: 

```
core::typeinfo::TypeInfo(13, 16, [core::typeinfo::TypeInfo(13, 16, [], main::Foo)], main::Bar)
```

<br> 

The result presented above, gives the following information : 1)
we have a object, 2) its size is 16 bytes, 3) it has an ancestor
(object, size 16 bytes, no ancestor, named **`main::Foo`**), 4) its
name is **`main::Bar`**.

The **`TypeInfo`** returned by the **`typeinfo`** attributes (either
dynamically or statically), is a structure whose definition is the
following. The **`inner`** fields depend on the value of the
**`typeid`** field, for example, when dealing with an object it stores
the ancestor **`TypeInfo`**, and when dealing with slice, it stores
the **`TypeInfo`** of the type contained inside the slice.

```ymir
pub struct
| typeid : TypeIDs
| size   : usize
| inner  : [TypeInfo]
| name   : [c32] 
 -> TypeInfo;

pub enum : u32
| ARRAY        = 1u32
| BOOL         = 2u32
| CHAR         = 3u32
| CLOSURE      = 4u32
| FLOAT        = 5u32
| FUNC_PTR     = 6u32
| SIGNED_INT   = 7u32
| UNSIGNED_INT = 8u32
| POINTER      = 9u32
| SLICE        = 10u32
| STRUCT       = 11u32
| TUPLE        = 12u32
| OBJECT       = 13u32
| VOID         = 14u32
 -> TypeIDs;
```

<br>

The typeinfo of a class is stored in the text and is accessible from
the vtable of the object. One can note that **`Bar`** and **`Foo`**
have a size of 16 bytes, despite the fact that they store no
fields. This is due to two pointers that are stored inside every
objects, the first pointer is refering to the monitor of the object
(*cf.* [Parallelism]()), and the second one points the the vtable of
the object.


## Object 

*Ymir* have a type named **`Object`**, that can used to cast any
object into that type. The reverse is impossible. We have seen that
the object are not inheriting from a global ancestor, and this is
really not the case. This cast unlike casting to parent class objects,
cannot be made implicitely. We can see the **`&(Object)`** type as the
**`&(void)`** type, that can store any pointer, but for
objects. Unlike **`&(void)`** (in which by the way we can't cast
objects), **`&Object`** stores one valuable information, it stores a
valid object value, with a vtable, a monitor, a typeinfo, and **cannot
be `null`**. 

In the following example, a pattern matching is used to check the type
of the object that is returned by the **`foo`** function. This is
discussed in chapter [Pattern
Matching](https://gnu-ymir.github.io/Documentations/en/pattern/).

```ymir
def foo ()-> &Object {
	cast!{&Object} (Foo::new ())
}

def main () {
	match foo () {
		Foo () => {
			println ("I got a Foo !");
		}
	}
}
```

<br>
Results: 

```
I got a Foo !
```

<br>

Some function of the standard library uses the **`Object`** type to
return values, when it is impossible statically to get more accurate
information about the type (e.g. [Packable]
(https://gnu-ymir.github.io/Documentations/en/traits/serialize.html).)
