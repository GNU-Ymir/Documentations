## Copiable

*Copiable* trait is a core trait, (defined in a core file, thus does
not need to be imported). This trait is used to override the
**`dcopy`** operator on a class. **Contribution**: for the moment
there is no default behavior for the Copiable trait, even if it is
completely possible. *Copiable* trait defines a method **`deepCopy`**
that takes a immutable object instance, and return a deeply mutable
one.

```ymir
import std::io;

class Foo {
	let _type : [c8];
	
	pub self () with _type = "I am an original"s8 {}
	
	prot self (type : [c8]) with _type = type {}
	
	
	impl Copiable {
		pub over deepCopy (self)-> dmut &(Foo) {
			Foo::new ("I am a copy"s8)
		}
	}


	impl Streamable; // convinient for debugging
}


def main () {
	let a = Foo::new ();
	let dmut b = dcopy a; // same as alias (a.deepCopy ())
	
	println (a);
	println (b);
}
```

<br>

Results: 
```
main::Foo(I am an original)
main::Foo(I am a copy)
```
