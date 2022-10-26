# Disposable

*Disposable* trait is a trait used to perform an operation at the end
of the life of an object instance. Unlike class destructor, the
dispose operation must be called by hand. There is no default behavior
for the *Disposable* trait. This trait can be coupled with the
**`with`** scope guard. Briefly in a word, this scope guards define a
variable (or a list of variable), like the **`let`** statement, but
ensure that it is disposed when the scope is exited, no matter what
happend in the scope. The *Disposable* trait is commonly used for
unmanaged memory (File, TcpStream, Mutex, ...).

```ymir
import std::io;

class Foo {
	pub self () {}
	
	impl Disposable {
		
		pub over dispose (mut self) {
			println ("I am disposed");
		}			
	}	
	
	impl Streamable;
}

def main () {
	with dmut a = Foo::new () {
		println (a);
	}
	println ("After a");
}
```

<br>
Results : 
```
main::Foo()
I am disposed
After a
```

<br>

A good practice is to call the **`dispose`** method inside the
destructor of the class. This way, even if the class was not disposed
by hand, it is disposed when the garbage collector destroy the
instance. (**Warning** to avoid multiple disposing the method
**`dispose`** shoud verify that the object is not already disposed,
e.g. the method can be called twice by hand, or first by hand, and
then by the destructor).
