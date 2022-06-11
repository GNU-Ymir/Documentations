# Methods

Methods are functions associated to object instances. Methods are
described inside a class definition. Information about function
presented in chapter
[Functions](https://ymir-lang.org/primitives/functions.html)
are applicable to methods. The grammar of a method is presented in the
following code block.

```grammar
method := simple_method | template_method

simple_method := 'def' Identifier method_params ('->' type)? expression
template_method := 'def' ('if' expression)? Identifier templates  ('->' type)? expression

method_params := '(' ('mut')? 'self' (',' param_decl)* ')'
```

<br>

Methods are accessible using an object instance, of the dot binary
operator **`.`**. Once accessed, a method can be called using a list
of arguments separated by comas inside parentheses. The first
parameter of a method is the object instance, and is the left operand
of the dot operator, so it must not be repeated inside the
parentheses.


```ymir
import std::io

class A {
	let _a : i32;

	pub self (a : i32) with _a = a {}
	
	
	pub def foo (self, x : i32) -> i32 {
		println ("Foo ", self._a);
		x + self._a 
	}
}

def main () {
	let a = A::new (29);
	println (a.foo (13));
}
```

Results:

```
Foo 29
42
```

<br>

The access to the fields, and to the methods of the object instance
inside the body of a method is made using the first parameter of the
method, the variable **`self`**. Unlike some object oriented language,
such as *Java*, *C++*, *Scala*, *D*, etc. **`self`** is never
implicit, e.g. accessing to the field **`_a`** in the above example,
cannot be made by just writing **`_a`**, but must be accessed by
writing **`self._a`**. This is a conceptual choice, whose purpose is
to improve code readability and sharing, by avoiding useless and
preventable search for the source of the variables.

## Privacy

Methods are protected by default. Meaning that only the class that
have defined them, and its heir class have acces to them. The keyword
**`pub`** and **`prv`** can be used to change the privacy of a
method. A public method is accessible everywhere, using an object
instance, and private methods are only accessible by the class that
have defined them. Unlike protected methods, private methods are not
accessible by heir classes. Privacy of methods is the same as privacy
of fields.

```ymir
import std::io

class A {

	pub self () {}
	
	pub def foo (self) {
		println ("Foo");
		self.bar ();
	}
	
	prv def bar (self) {
		println ("bar");
	}
}


def main () {
	let a = A::new ();
	a.foo ();
	a.bar ();
}
```

<br>

Because the method **`bar`** is private in the context of the
**`main`** function, the compiler returns the following error. One
can note, that the compiler tried to rewrite the expression into a
*uniform call syntax* (i.e. **`bar (a)`**), but failed, because the
function **`bar`** does not exists.

```error
Error : undefined field bar for element &(main::A)
 --> main.yr:(21,3)
21  ┃ 	a.bar ();
    ╋ 	 ^^^^
    ┃ Note : bar --> main.yr:(12,10) : (const self) => main::A::bar ()-> void is private within this context
    ┃ Note : when using uniform function call syntax
    ┃ Error : undefined symbol bar
    ┃  --> main.yr:(21,4)
    ┃ 21  ┃ 	a.bar ();
    ┃     ╋ 	  ^^^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Method mutability

The mutability of the object instance must be defined in the prototype
of the method. By default the object instance refered to by **`self`**
is immutable, meaning that the instance cannot be modified.

```ymir
class A {
	
	let mut _x : i32;
	
	pub self (x : i32) with _x = x {}
	
	pub def setX (self, x : i32) {
		self._x = x;
	}	
	
}
```

Error: 

```error
Error : when validating main::A
 --> main.yr:(1,7)
 1  ┃ class A {
    ╋       ^
    ┃ Error : left operand of type i32 is immutable
    ┃  --> main.yr:(8,7)
    ┃  8  ┃ 		self._x = x;
    ┃     ╋ 		    ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br> By using the keyword **`mut`**, the method can be applicable to
mutable instance. In that case the instance refered to by **`self`**
is mutable, and its mutable fields can be modified. Such methods can
be accessed only using mutable object instance - not only mutable
reference, the borrowed data located on the heap must be mutable. To
call such method, aliases is necessary and cannot be implicit.

```ymir
class A {
	let mut _x : i32;
	
	pub self (x : i32) with _x = x {}
	
	pub def setX (mut self, x : i32) {
		self._x = x;
	}	
	
}

def main () {
	let a = A::new (12);
	a.setX (42); 
	
	let dmut b = A::new (12);
	b.setX (42);
	
	(alias b).setX (42);	
}
```

<br> 

The first call at line **14** is not possible, **`a`** having only
read access to the object instance it contains. The second error, the
call at line **17**, is due to the fact that even **`b`** have write
permission to the object instance it contains, it cannot be passed to
the method implicitely, and have to be aliased, in order to certify
explicitely that the user is aware that the value of the object
contained in **`b`** will be modified by calling the method. The
errors returned by the compiler are the following.

```error
Error : the call operator is not defined for (a).setX and {i32}
 --> main.yr:(14,9)
14  ┃ 	a.setX (42); 
    ╋ 	       ^  ^
    ┃ Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
    ┃  --> main.yr:(14,9)
    ┃ 14  ┃ 	a.setX (42); 
    ┃     ╋ 	       ^
    ┃     ┃ Note : implicit alias of type &(main::A) is not allowed, it will implicitly discard constant qualifier
    ┃     ┃  --> main.yr:(14,2)
    ┃     ┃ 14  ┃ 	a.setX (42); 
    ┃     ┃     ╋ 	^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 

Error : the call operator is not defined for (b).setX and {i32}
 --> main.yr:(17,9)
17  ┃ 	b.setX (42);
    ╋ 	       ^  ^
    ┃ Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
    ┃  --> main.yr:(17,9)
    ┃ 17  ┃ 	b.setX (42);
    ┃     ╋ 	       ^
    ┃     ┃ Note : implicit alias of type mut &(mut main::A) is not allowed, it will implicitly discard constant qualifier
    ┃     ┃  --> main.yr:(17,2)
    ┃     ┃ 17  ┃ 	b.setX (42);
    ┃     ┃     ╋ 	^
    ┃     ┗━━━━━┻━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

We have seen in the chapter about function, and more specifically
about *uniform call syntax* that the operator **`:.`** can be used to
pass a aliased value as the first parameter of a function. This
operator is also applicable for method calls, and is to be prefered to
the syntax **`(alias obj).method`** which is a bit verbose.

```ymir
def main () {
	let dmut a = A::new (12);
	
	a:.setX (42); // same as (alias a).setX (42)
}
```

<br>

Method mutability is also applicable inside the body of a method. In
the example below, the method **`foo`** is mutable, and call another
mutable method **`bar`**, it also calls a immutable method
**`baz`**. Implicit aliasing is mandatory when calling the method
**`bar`**, but not when calling the method **`baz`**.

```ymir
class A {
	let _x : i32;
	pub self (x : i32) with _x = x {}

	pub def foo (mut self, x : i32) {
		self:.bar (x); // :. is mandatory
		self.baz (x);
	}
	
	pub def bar (mut self, x : i32) {
		self._x = x;
	}

	pub def baz (self) {
		println ("X : ", self._x);
	}
}
```

<br>

*Contribution*: Calling a immutable method with explicit alias is
possible. Maybe that is not a good idea, and will lead to the use of
the operator **`:.`** all the time, and misleading read of the code.

## Method mutability override

It is possible to define two methods with the same prototype, with the
only exception that one of them is mutable and not the other. In that
case the method with the best affinity is choosed when called. That is
to say, the mutable method is called on explicitly aliased object
instances, and the immutable method the rest of the time.

```ymir
import std::io

class A {

	pub self () {}
	
	pub def foo (mut self) {
		println ("Mutable");
	}
	
	pub def foo (self) {
		println ("Const");
	}   	
}

def main () {
	let dmut a = A::new ();
	a.foo ();
	a:.foo ();
}
```

Results:

```
Const
Mutable
```
