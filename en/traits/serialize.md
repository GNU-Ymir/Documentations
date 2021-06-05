# Packable

*Packable* trait (importable from **`std::net::packet`**) defines two
methods **`pack`** and **`unpack`**. There is a default behavior for
those two methods, and it is recommended to not override them, unless
you know exactly what you are doing. The **`pack`** method takes a
immutable object instance as parameter and creates a packet of
**`[u8]`**, encoding the object. This packet can then be sent throw
network, and unpack from another processes.

```ymir
import std::io;
import std::net::packet;

class Foo {
    let _v : [c8];
    
    pub self (v : [c8]) with _v = v {}
	
    impl Packable;
}


def main () {
    let a = Foo::new ("Test"s8);

    let packet = a.pack ();
    println (packet);
}
```

<br>
Results : 

```
[9, 0, 0, 0, 0, 0, 0, 0, 34, 6d, 61, 69, 6e, 33, 46, 6f, 6f, 4, 0, 0, 0, 0, 0, 0, 0, 54, 65, 73, 74]
```
<br>

The packet can then be unpacked with the function **`unpack`**. This
function returns an **`Object`**, that can be transformed in the
appropriate type using pattern matching.

```ymir
    {
        match unpack (packet) {
            x : &Foo  => println (x);
            _ => {
                println ("Unkown packet");
            }
        }
    } catch {
        UnpackError () => {
            println ("The packet contains unknwon information");
        }
    }
```
<br>

Results: 
```
main::Foo(Test)
```
<br>

**Warning** to work properly, the unpacker must have access to the
type information of the object that is packed. Otherwise, an
*UnpackError* is thrown. To make the symbol available in the unpacking
program, the class must be compiled and linked in it. For example, if
a module **`foo`** contains a class **`Foo`**, and the unpacking is
made inside the **`main` module. The command line of the compilation
must be : 

```bash
gyc main.yr foo.yr
```
<br>

It is possible to verify that the symbol are present in the
executable, by running the following command (example for the class
**`Foo`** of the previous example).

```bash
$ objdump -t a.out | grep Foo
0000000000410585 g     F .text	00000000000004a0              _Y3std3net6packet8Packable27__stdnetwork__unpackContentFxP9x3foo3FooSu8Zusize
0000000000447300  w    O .data	0000000000000030              _Y3foo3FooTI
0000000000410a25 g     F .text	000000000000006e              _Y3std3net6packet8Packable25__stdnetwork__packContentFP83foo3FooxP32x3std10collection3vec6VecNu83VecZv
000000000040eb82 g     F .text	0000000000000054              _Y3foo3Foo4selfFxP9x3foo3FooSc8ZxP9x3foo3Foo
00000000004472f0  w    O .data	0000000000000010              _Y133foo3Foo_nameCSTxSc32
0000000000447340  w    O .data	0000000000000030              _Y3foo3FooVT
000000000040f468 g     F .text	0000000000000093              _Y3std3net6packet8Packable4packFP83foo3FooxP32x3std10collection3vec6VecNu83VecZv
000000000040f381 g     F .text	00000000000000e7              _Y3std3net6packet8Packable4packFP83foo3FooZSu8
00000000004472c0  w    O .data	0000000000000024              _Y183foo3Foo_nameInnerCSTxA9c32
```
<br>

In the result of this command, the symbol **`_Y3foo3FooTI`** is
present, this is the symbol containing the type info of the
**`foo::Foo`** class, **`_Y3foo3FooVT`** contains the vtable, and
**`_Y3std3net6packet8Packable27__stdnetwork__unpackContentFxP9x3foo3FooSu8Zusize`**
the function called to unpack the object. These are the three
mandatory symbols to successfully unpack a object (the other symbols
are necessarily there if the vtable is present).

I think this is not a strong problem, as it can be easily resolved;
but must be taken into account when compiling the program.

**Contribution**: Almost every types are packable. I think the only
two types that are not are function pointer and closure. I see how
function pointer packing can be done, and it is not difficult and will
be done in future version of the std. On the other hand, because the
type info of the closure is not accessible, i don't see any way of
packing this type. In any case, closure behavior can be easily
simulated by using a object instance, or a structure and a function
pointer. And trying to pack a not packable type creates compile time
errors, so there is no bad surprise at runtime.


## Serializable

Like *Packable* trait, *Serializable* is a trait that transform an
object instance into something that can be stored, or sent. However,
unlike *Packable*, the result is humanely readable, and can be used to
create configuration files for example (current std implements
**toml** and **json** serialization). *Serializable* objects
implements the method **`serialize`**. It has no default behavior
(**Contribution** it is however probably possible to create a default
behavior based on the name of the fields). This method takes an
immutable object instance, and return a **`&Config`** value.

```ymir
import std::io;
import std::config::conv;
import std::config, std::config::toml;


struct
| A : &Foo
| B : &Foo
 -> Bar;

class Foo {
    let _v : [c32];
    let _u : i32;
    
    pub self (v : [c32], u : i32) with _v = v, _u = u{
    }

    impl Serializable {
        pub over serialize (self)->  &Config {
            let dmut d = Dict::new ();
            d:.insert ("v", self._v.to!(&Config) ());
            d:.insert ("u", self._u.to!(&Config) ());

            d
        }
    }
}


def main () {
    let x = Bar (Foo::new ("Test", 12), Foo::new ("Test2", 34));	
    println (toml::dump (x.to!(&Config) ()));
}
```

<br>
Results : 

```

[A]
u = 12
v = "Test"

[B]
u = 34
v = "Test2"

```
