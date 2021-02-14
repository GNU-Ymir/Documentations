# Reference

The keyword**`ref`** is a keyword that is placed before the
declaration of a variable. It is used to refer to a value, which is
usually borrowed from another variable.
 
```ymir
def foo () {
	let x = [1, 2, 3];
	let ref y = ref x;
	//          ^^^    
	// Try to remove the keyword ref.
}
```

The above program can be represented in memory as shown in the
following figure.

![Image](https://gnu-ymir.github.io/Documentations/en/advanced/memory_x__ref_y_foo.png)

**`y`**, is a pointer to x, which can be used as if it were directly
**`x`**. This means that **`y`** must have the same mutability
properties (or lower) as **`x`**. And that if `x` is mutable, changing `y`
would also change `x`.

```ymir
import std::io

def main () {
	let mut x : [mut i32] = [1, 2, 3];
	let ref mut y : [mut i32] = ref x;
	y = [7, 8, 9];
	println (x); 
}
```

The above program should display the following output once launched:

```
[7, 8, 9]
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

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x_main_ref_x_foo.png" alt="drawing" width="450"/>

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

<br>

```
By value : 89
By reference : 89
```

<br>

If you have done the exercise, and added the keyword `mut` in the
signature of the first function `foo`, you should get the following
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

This error means that the type of x is not aliasable, so if it is not
a reference, marking it as mutable will have no effect on the program,
so the compiler does not allow it.

## Reference as a value 

A reference is not a type, it is only a kind of variable, you cannot
store references in subtypes (for example, you cannot make a reference
array, or a tuple containing a reference to a value). This means that
with the following code, you should get an error.

```ymir 
def main () {
	let x = 12;
	let y = (10, ref x);
}
```

<br>

```error
Warning : the creation of ref has no effect on left operand
 --> main.yr:(3,19)
    | 
 3  | 	let y = (10, ref x);
    | 	                 ^

ymir1: fatal error: 
compilation terminated.
```

<br>

This warning means that you have used the keyword `ref` but the
compiler will ignore it because it will not create a reference to `x`
in the value of `y`.

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

With the above source code, you should get the following error : 

```error
Error : cannot return a reference type
 --> main.yr:(3,19)
    | 
 3  | def foo () -> ref i32 {
    |                   ^^^

ymir1: fatal error: 
compilation terminated.
```
