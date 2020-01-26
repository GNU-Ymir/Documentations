# Reference
The keyword**`ref`**is a keyword that is placed before the declaration
of a variable. It is used to refer to a value, which is usually
borrowed from another variable.
 
```ymir
def foo () {
	let x = [1, 2, 3];
	let ref y = ref x;
	//          ^^^    
	// Try to remove the keyword ref.
}
```
The above program, can be represented in memory as illustrated in the
following figure. 

![Image](https://gnu-ymir.github.io/Documentations/advanced/memory_x__ref_y_foo.png)

**`y`**, is a pointer to x, that can be used as it was directly
**`x`**. Which means, that **`y`** must have the same mutability
properties as **`x`**. And that, if `x` is mutable, modify `y` would
also modify `x`.

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

A reference is not a type, it is only a type of variable,
you can't store references in sub types (for example, you can't make
an array of reference, or a tuple containing a reference to a value).

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

The following figure shows the memory status of the previous code: 

![Image](https://gnu-ymir.github.io/Documentations/advanced/memory_x_main_ref_x_foo.png)

The keyword `ref` is not always associated with a mutable variable, it
can be used to pass a complex type to a function more efficiently,
when you don't want to make a complete copy, which would be much less
efficient. In this case, you still need to specify that you pass the
variable by reference, to distinguish it from the function which
passes the variable directly by value.

**Exercice :** Try to guess the output of the following program : 

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

If you have done the exercise, and added the keyword `mut` in the
signature of the first function `foo`, you should have got the
following error:

```
Error : a parameter cannot be mutable, if it is not a reference
 --> main.yr:(4,14)
    | 
 4  | def foo (mut x : i32) {
    |              ^

ymir1: fatal error: 
compilation terminated.
```

This error means that the type of x is not aliasable, so if it is not
a reference, marking it as mutable will have no effect on the program,
and therefore the compiler does not allow it.

