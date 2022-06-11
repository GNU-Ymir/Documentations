# Mutability

Objects are aliasable types. The data being allocated on the heap, and
not copied - for efficiency reasons - on affectations (*cf.* [Aliases
and
References](https://ymir-lang.org/advanced/)).


## Object mutability

The type of an object instance is a reference to a class type. This
reference can mutable, and the data pointed data as well. In the
following example, a variable **`a`** containing an object instance of
the class **`A`** is created. This variable contains a mutable
reference, but the data borrowed by the reference are not mutable.

```ymir
class A {
	
	pub let mut x : i32;
	
	pub self (x : i32) with x = x {}
	
}


def main () {
	let mut a : &(A)= A::new (12);
	
	a = A::new (42); // ok the reference if mutable
	
	a.x = 33; // the borrowed data are not mutable
}
```

<br> 

Because the data borrowed by **`a`** are not mutable, the
compiler returns an error.

```error
Error : left operand of type i32 is immutable
 --> main.yr:(15,3)
15  ┃ 	a.x = 33; // the borrowed data are not mutable
    ╋ 	 ^


ymir1: fatal error: 
compilation terminated.
```

<br>

This error can be avoided, by making the borrowed data mutable as
well. Either by using the **`dmut`** modifier, or by writing **`mut
&(mut A)`**.


```ymir
def main () {
	let dmut a = A::new (12);
	a.x = 42; // no problem a is mutable, and its borrowed data as well.
	println (a.x); 
}
```

Because classes are aliasable types, the keyword **`alias`** has to be
used when trying to make a mutable affectation. Information about
aliasable types is presented in chapter
[Aliases](https://ymir-lang.org/advanced/alias.html),
and is not rediscussed here.

```ymir
def main () 
	throws &AssertError
{
	let dmut a = A::new (12);
	let dmut b = alias a;
	b.x = 42;
	
	assert (a.x == 42);
}
```

## Field mutability

Field mutability is set once and for all, in the definition of the
class. The information about field mutability presented in the chapter
about structure is applicable to classes. 

However, unlike structures, classes are not copiable by default, but
have to implement a specific traits. Trait and implementation is
presented in a future chapter, and copy is discussed in there
chapter. (*cf.*
[Traits](https://ymir-lang.org/objects/traits.html)).


```ymir
class A {
	
	pub let mut x : i32;
	pub let y : i32;
	
	pub self (x : i32, y : i32) with x = x, y = y {}
	
}


def main () {
	let dmut a = A::new (0, 1);
	a.x = 43;
	a.y = 89;
}
```

<br>

Errors: 

```error
Error : left operand of type i32 is immutable
 --> main.yr:(14,3)
14  ┃ 	a.y = 89;
    ╋ 	 ^


ymir1: fatal error: 
compilation terminated.
```
