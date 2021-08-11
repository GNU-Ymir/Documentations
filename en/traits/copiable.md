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
    let mut _type : [c8];
    
    pub self () with _type = "I am an original"s8 {}
    
    pub def change (mut self) {
        self._type = "I am modified"s8;
    }
    
    impl Copiable;	
    impl Streamable; // convinient for debugging
}


def main () {
    let dmut a = Foo::new ();
    let dmut b = dcopy a; // same as alias (a.deepCopy ())
    
    b:.change ();
    
    println (a);
    println (b);
}
```

<br>

Results: 
```
main::Foo(I am an original)
main::Foo(I am modified)
```
