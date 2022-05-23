# Hashable

*Hashable* trait (importable from **`std::hash`**) is used to
transform an object instance into a **`u64`**. The interest is to
easily compare objects, for example in
**`std::collection::map::HashMap`**, or
**`std::collection::set::HashSet`**. *Hashable* classes can be used in
these collections as key. A default behavior is defined in this trait,
but the method **`hash`** can be redefined, it takes a immutable
object instance as parameter, and return a **`u64`** value.

```ymir
import std::io;
import std::collection::map;
import std::hash;

class Foo {
	let _v : [c8];

	pub self (v : [c8]) with _v = v {}
	
	impl Hashable, Streamable;
}


def main () {
    let dmut coll = HashMap!{&Foo, i32}::new ();
    coll:.insert (Foo::new ("X"s8), 12);
    coll:.insert (Foo::new ("Y"s8), 34);
	
    println (coll);	
    println (Foo::new ("X"s8) in coll);
}
```

<br>

Results: 

```
{main::Foo(X)=>12, main::Foo(Y)=>34}
true
```
