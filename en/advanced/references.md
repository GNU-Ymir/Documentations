# Reference

The keyword**`ref`** is a keyword that is placed before the
declaration of a variable. It is used to refer to a value, which is
usually borrowed from another variable. They are performing similar
operation as
[Pointers](https://gnu-ymir.github.io/Documentations/en/primitives/types.html#pointers),
with the difference that they does not need to be dereferenced (this
is done automatically), and pointer arithmetics is not possible with
references. In **Ymir** references are always set, and are always set
from another variable, hence they are way safer than pointers, and
must be prefered to them when possible.
 
```ymir
def foo () {
	let x = [1, 2, 3];
	let ref y = ref x;
	//          ^^^    
	// Try to remove the keyword ref.
}
```

<br>

The above program can be represented in memory as shown in the
following figure.

<br>

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x__ref_y_foo.png" alt="drawing" height="500", style="display: block; margin-left: auto;  margin-right: auto;">

<br>


In this figure, one can note that **`y`**, is a pointer to x, which
can be used as if it was directly **`x`**. This means that **`y`**
must have the same mutability properties (or lower) as **`x`**. And
that if **`x`** is mutable, changing the value of **`y`** would also
change **`x`**.

A first example of reference is presented in the following source
code. In this example, a mutable variable **`x`** contains a value of
type **`i32`**. This value is placed on the stack, as it is not a
aliasable type. Then a variable **`y`** is constructed as a reference
of the variable **`x`**. Modifying **`y`** in the following example, also
modifies **`x`**.

```ymir
def main ()
    throws &AssertError
{
    let mut x = 12; // place a value of type i32 and value 12 on the stack
    let ref mut y = ref x; // create a reference of x
    y = 42; // modify the value pointed by the reference
    assert (x == 42);
}
```

<br>

A more complexe example is presented in the following source code. In
this example, a deeply mutable array **`x`** is created. This array is
a reference on borrowed data in the heap. A deeply mutable reference
**`y`** is the, made on that variable **`x`**, which is allowed
because **`x`** is also deeply mutable and the mutability level of
**`x`** and **`y`** are the same. When changing the value of **`y`**
(here the reference of the slice), it does not only change the
reference of **`y`** but also the reference of **`x`**.

```ymir
def main () {
	let mut x : [mut i32] = [1, 2, 3];
	let ref mut y : [mut i32] = ref x;
	y = [7, 8, 9]; // modify the value pointed by the reference (in the stack)
	y [0] = 89; // modify the value on the heap
	assert (x == [89, 8, 9]); 
}
```


## Reference as function parameter

A parameter of a function can be a reference. As with the local
variable, when a value is passed to it, you must tell the compiler
that you understand that you are passing the value by reference, and
accept the side effects it may have on your values.


```ymir
import std::io

def foo (ref mut x : i32) {
	x = 123;
}

def main () {
	let mut x = 12;
	//  ^^^
	// Try to remove the mut
	foo (ref x);
	//   ^^^
	// Try to remove the ref
	println (x); 
}
```

<br>

The following figure shows the memory status of the previous code:

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x_main_ref_x_foo.png" alt="drawing" width="500" style="display: block; margin-left: auto;  margin-right: auto;">

The keyword `ref` is not always associated with a mutable variable, it
can be used to pass a complex type to a function more efficiently,
when you don't want to make a complete copy, which would be much less
efficient. In this case, you should always specify that you pass the
variable by reference, to distinguish it from the function that passes
the variable directly by value. In practice, due to the existence of
aliasable types, which will be discussed in the next chapter, you will
never gain anything by doing this.

```ymir
import std::io

def foo ( x : i32) {
//       ^
// Try to add mut here
	println ("By value : ", x);
}

def foo (ref x : i32) {
	println ("By reference : ", x);
}

def main () {
	let x = 89;
	foo (x);
	foo (ref x);
}
```
Results:
```
By value : 89
By reference : 89
```

<br>

If you have done the exercise, and added the keyword **`mut`** to the
signature of the first function **`foo`**, you should get the following
error: 

```error
Error : a parameter cannot be mutable, if it is not a reference
 --> main.yr:(4,14)
    | 
 4  | def foo (mut x : i32) {
    |              ^

ymir1: fatal error: 
compilation terminated.
```

<br>

This error means that the type of **`x`** is not aliasable, so if it is not
a reference, marking it as mutable will have no effect on the program,
so the compiler does not allow it.

## Reference as a value 

A reference is not a type, it is only a kind of variable, you cannot
store references in subtypes (for example, you cannot make an array of
references, or a tuple containing a reference to a value). This means
that with the following code, you should will get an error.

```ymir 
def main () {
	let x = 12;
	let y = (10, ref x);
}
```

<br> The following error means that the source code intended to create
a reference on a variable, but the compiler will not make it, as it
has no interest and will be immediately dereferenced to be stored in
the tuple value.

```error
Warning : the creation of ref has no effect on left operand
 --> main.yr:(3,19)
    | 
 3  | 	let y = (10, ref x);
    | 	                 ^

ymir1: fatal error: 
compilation terminated.
```

## Reference as function return

You may be skeptical about the interest of returning a reference to a
variable, and we agree with you. That is why, it is impossible to
return a reference to a variable as a function return value. 

```ymir
import std::io

def foo () -> ref i32 {
	let x = 12;
	ref x
}

def main () {
	let ref y = ref foo (); // x would no longer exists
	println (y); // and a seg fault would be raised, when using the reference
}
```

<br>

With the above source code, the compiler return this fairly straightforward error.

```error
Error : cannot return a reference type
 --> main.yr:(3,19)
    | 
 3  | def foo () -> ref i32 {
    |                   ^^^

ymir1: fatal error: 
compilation terminated.
```
