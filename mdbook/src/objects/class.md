# Class

An object is an instance of a class. A class is declared using the
keyword **`class`**, followed by the identifier of the class.  The
complete grammar of a class definition is presented in the following
code block.

```grammar
class_decl := simple_class_decl | template_class_decl

simple_class_decl := 'class' (modifiers)? Identifier ('over' type)? '{' class_content '}'
template_class_decl := 'class' ('if' expression)? (modifiers)? Identifier templates ('over' type)? '{' class_content '}'
class_content :=   field
	             | method
				 | constructor
				 | impl
				 | destructor
modifiers := '@' ('{' modifier (',' modifier)* '}') | (modifier)
modifier := 'final' | 'abstract'
```

<br>

As many symbols, the class can be a template symbols. Templates are
not presented in this chapter, and are left for a future chapter
(*cf.*
[Templates](https://gnu-ymir.github.io/Documentations/en/templates/)).

## Fields 

A class can contain fields. A field is declared as a variable, using
the keyword `let`. A field can have a default value, in that case the
type is optional, however if the value is not set, the field must have
a type. Multiple fields can be declared within the same **`let`**,
with coma separating them.

```ymir
class Point4D {
	let _x : i32;
	let _y = 0;
	let _z : i32, _w = 0;
}
```

### Field privacy

All fields are protected by default, i.e. only the class defining them
and its heirs have access to them. The keyword **`pub`** can be used
to make the fields public, and accessible from outside the class
definition. The keyword **`prv`**, on the other hand, can be use to
make the field totally hidden from outside the class. Unlike
**`prot`**, **`prv`** fields are not accessible by the heirs of a
class.

A good practice is to enclose the privacy of the fields in their name
definition. For example, a public field is named **`x`**, without any
**`_`** token. A protected fields always starts with a single
underscore, **`_y`**, and private fields are surrounded by two
underscores before and after the identifier. This is just a convention,
the name has no impact on the privacy.

```ymir
class A {
	pub  let x = 12;
	prot let _y : i32;
	prv  let __z__ : i32;
}
```

## Constructor 

To be instancible, a class must declare at least one constructor. The
constructor is always named `self`, and takes parameters to build the
object. The object is accessible within the constructor body through
the variable **`self`**.

### Field construction 

The constructor must set the value to all the fields of the
class, with the keyword **`with`**. Fields with default values are not
necessarily set by this **`with`** statement, but can be
redefined. The with statement has the effect of the initial value of
the fields, meaning that the value of immutable fields is set by them.

```ymir
class Point {
	let _x : i32;
	let _y = 0;
	
	/**
	 * _y is already initialized
	 * it is not mandatory to add it in the with initialization
	 */
	pub self () with _x = 12 {}
	
	/**
	 * But it can be redefined
     */
	pub self (x : i32, y : i32) with _x = x, _y = y {}
}
```

<br> 

Field value is set only once. For example, if a class has a field
**`_x`** with a default value, calling a function **`foo`**. And the
constructor use the **`with`** statement to set the value of the field
from the return value of the **`bar`** function, the function
**`foo`** is never called.

```ymir
def foo () -> i32 {
	println ("Foo");
	42
}

def bar () -> i32 {
	println ("bar")
	33
}

class A {
	let _x = foo ();
	
	pub self () with _x = bar () {} // foo is not called, bar is call instead
}
```

<br>

The point behind **`with`** field construction, is to ensure that all
fields have a value, when entering the constructor body. This way,
when instruction are made inside the constructor body, such as
printing the value of the fields, their value is already set, and the
object instance is already valid.

```ymir
class A {
	let _x : i32;
	
	pub self () with _x = 42 {
		println (self._x); // access the field _x, of the current object instance
	} 
}
```


### Create an object instance


Class are used to create object instance, by calling a
constructor. This call is made using the double colon binary operator
**`::`**, with the left operand being the name of the class to
instantiate, and the right operand the keyword **`new`**. After the
keyword **`new`** a list of argument is presented, this list is the
list of argument to pass to the constructor. The constructor with the
best affinity is choosed and called on a allocated instance of the
class. Constructor affinity is computed as function affinity (based on
type mutability, and type compatibility – *cf.* [Aliases and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)).

```ymir
import std::io

class A {

	pub self (x : i32) {
		println ("Int : ", x);
	}
	
	pub self (x : f32) {
		println ("Float : ", x);
	}

}

def main () {
	let _ = A::new (12);
	let _ = A::new (12.f);
}
```

<br>
Results
```
Int : 12
Float : 12.000000
```

### Named constructor 

A name can be added to the constructor. This name is an Identifier,
and follows the keyword **`self`**. A named constructor can be called
by its name when constructing a class. This way two constructor can
share the same prototype, and be called from their name. A named
constructor is **not** ignored when constructing a class with the
**`new`** keyword, its named is just not considered.

In the following example, a class **`A`** contains two constructors,
**`foo`** and **`bar`**, these constructors have one parameter of type
**`i32`**. 

```ymir
import std::io

class A {
	let _x : i32;
	
	pub self foo (x : i32) with _x = x {
		println ("Foo ", self._x);
	}
	
	pub self bar (x : i32) with _x = x {
		println ("Bar ", self._x);
	}
}

def main () {
	let _ = A::foo (12);
	let _ = A::bar (12); 
	
	let _ = A::new (12);
}
```

<br>

The last object construction at line **19** is not possible, the call
working with both **`foo`** and **`bar`**. The other constructions
work fine, that is why the compiler returns only the following error.

```error
Error : {self foo (x : i32)-> mut &(mut main::A), self bar (x : i32)-> mut &(mut main::A)} x 2 called with {i32} work with both
 --> main.yr:(19,17)
19  ┃ 	let _ = A::new (12);
    ╋ 	               ^
    ┃ Note : candidate self --> main.yr:(6,6) : self foo (x : i32)-> mut &(mut main::A)
    ┃ Note : candidate self --> main.yr:(10,6) : self bar (x : i32)-> mut &(mut main::A)
    ┗━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

### Construction redirection 

To avoid redondent code, a constructor can call another constructor in
the **`with`** statement. This call redirection is performed by using
the **`self`** keyword. In that case, because the fields are already
constructed by the called constructor, they must not be reconstructed.

```ymir
import std::io;

class A {
    let _x : i32;

    pub self () with self (12) {
        println ("Scd ", self._x);
    }

    pub self (x : i32) with _x = x {
        println ("Fst ", self._x);
    }
    
}


def main () {
    let _ = A::new (); // construct an instance of the class A
	                   // from the constructor at line 6
}
```

<br>
Results:
```
Fst 12
Scd 12
```

<br>

*Contribution:* Redirection to named constructor does not work for the moment. This is not complicated, but has to be done.

### Constructor privacy

As fields, the privacy of the constructor is protected by default. The
keyword **`prv`** and **`pub`** can be used to change it.

## Destructors

Object instances are destroyed by the garbage collector. Meaning that
there is no way to determine when or even if an object instance will
be destroyed. But lets say that such operation effectively happen
(which is quite probable, let's no lie either), then a last function
can be called just before the object instance is destroyed and
irrecoverable. The destructor is called **`__dtor`**, and takes the
parameter **`mut self`**. There is only one destructor per class, this
destructor is optional and always public.


```ymir
import std::io;

static mut I = 0;

class A {
    let _x : i32;
    pub self () with _x = I {
        I += 1;
    }
    
    __dtor (mut self) {
		println ("Destroying me ! ", self._x); 
    }

}

def foo () {
    let _ = A::new (); 
} // the object instance is irrecoverable at the end of the function

def main () {
    loop {
        foo ();
    }
}
```

<br>

Results:
```
Destroying me ! 765
Destroying me ! 1022
Destroying me ! 764
Destroying me ! 1023
Destroying me ! 763
Destroying me ! 1024
Destroying me ! 762
Destroying me ! 1025
Destroying me ! 761
Destroying me ! 1026
...
```

<br>

One can note from the result, that the order of destruction is totally
unpredictible. Rely on class destructor is not the best practice. We
will see in a future chapter disposable objects, that are destroyed in
a more certain way. Destructors are a last resort to free unmanaged
memory, if this was forgotten (for example, file handles, network
socket, etc. if not manually disposed).

