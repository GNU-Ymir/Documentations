# Streamable

Streamable objects are objects that can be put inside a
**`StringStream`**. These objects are also printable, using the
standard **`print`** or **`println`** functions. *Streamable* trait
has a default behavior, that consist in writting the typeid of the
class, followed by every fields (private and protected included) of
the class inside the stream. 

## Print objects to stdout

In the following example, two classes implements the traits
**`Streamable`**, and are printed to stdout. The first class **`Foo`**
does not redefine the behavior of the trait, on the other hand
**`Bar`** does.

```ymir
import std::io; // the trait is accessible from std::io, or std::stream

class Foo {
	
	let _i = 12;
	let _j = "Foo";

	pub self () {}
	
	impl Streamable;
}

class Bar {
	pub self () {}
	
	impl Streamable {
		pub over toStream (self, dmut stream : &StringStream)-> void {
			stream:.write ("{I am a Bar}"s8);
		}
	}	
}

def main () {
	let a = Foo::new ();
	let b = Bar::new ();
	
	println (a);
	println (b);
}
```

<br>
Results: 
```
main::Foo(12, Foo)
{I am a Bar}
```

## Write objects to StringStream

The **`Streamable`** trait is originaly used to transform an object
into a **`[c8]`**, inside a **`&StringStream`**. **`StringStream`** is
a class provided by the module **`std::stream`** that transform types
into a growing string, in a efficient manner, to avoid unefficient
string concatenation.  In the following example, instead of using the
**`print`** function, provided by **`std::io`**, the objects are added
to a **`StringStream`**, that is then printed to stdout.

```ymir
import std::io; // io publically import std::stream
                

class Foo {
	
	let _i = 12;
	let _j = "Foo";

	pub self () {}
	
	impl Streamable;
}

class Bar {
	pub self () {}
	
	impl Streamable {
		pub over toStream (self, dmut stream : &StringStream)-> void {
			stream:.write ("{I am a Bar}"s8);
		}
	}	
}

def main () {
	let a = Foo::new ();
	let b = Bar::new ();

	let dmut stream = StringStream::new ();

	a.toStream (alias stream); 
	stream:.write ("\n"s8)	 // write returns the stream
		  :.writeln (b) // the method write of a stringstream call the method toStream
		  :.write ("Hello : ", 42); // everything can be added inside a stringstream
	
	println (stream []); // the operator [], gets the slice [c8] contained inside the stream (without copying it).
}
```

<br>
Results: 
```
main::Foo(12, Foo)
{I am a Bar}
Hello : 42
```
