# Alias

All the types that contains pointer to data located in the heap, are
aliasable type. An aliasable type cannot be copied implicitly, and
also cannot be refered implicitly, for respectively performance and
safety considerations. There is principaly to types that are
aliasable, the arrays (or slices there is no difference in Ymir) and
Objects. The structs, and tuple that contains aliasable types are also
aliasable.


You must use the keyword `alias`, to tell to the compiler that you
understand that a new variable will borrow values.

```ymir
import std::io

def main () {
	let mut x : [mut i32] = [1, 2, 3];
	let mut y : [mut i32] = alias x;
	//                      ^^^^^
	// Try to remove the alias
	println (y);
}
```

This source code can be represented in memory by the following figure.

<img src="https://gnu-ymir.github.io/Documentations/advanced/memory_x_alias_main.png" alt="drawing" width="700"/>


The alias keyword is mandatory only when the variable that will borrow
the data is mutable, and can have an impact on the value. You
evidently can't borrow immutable data in a variable that is
mutable. For example the compiler should return an error on the
following code.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let mut y : [mut i32] = alias x;
	//                      ^^^^^
	// Try to remove the alias
	println (y);
}
```

```
Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
 --> main.yr:(5,13)
    | 
 5  |     let mut y : [mut i32] = alias x;
    |             ^
Note : 
 --> main.yr:(5,29)
    | 
 5  |     let mut y : [mut i32] = alias x;
    |                             ^

Error : undefined symbol y
 --> main.yr:(8,14)
    | 
 8  |     println (y);
    |              ^

ymir1: fatal error: 
compilation terminated.
```

However, if the variable that will borrow the data is not mutable,
there is no need to add the `alias` keyword, and the compiler will
make an implicit alias, that will have no consequence.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let y = x; 
	println (y);
}
```

In the last example, **`y`** can be mutable, as long as its internal
value is immutable, i.e. its type is `mut [i32]`, you can change the
value of `y`, but not the value it borrows. There is no problem, the
values of `x` will not be changed, no matter what you do with `y`.

```ymir
import std::io

def main () {
	let x = [1, 2, 3];
	let mut y = x; 
	// y [0] = 9;
	// Try to add the above line 
	
	y = [7, 8, 9];
	println (y);
}
```

## Deep mutability

Earlier we have introduce the keyword `dmut`, this keyword is used to
avoid very verbose type declaration, and tell that every sub type from
this point will be mutable. This keyword is applicable on every type,
but will have only effect on arrays and tuple. The following table
shows example of that, on an array type :

| Type | Verbose equivalent |
| --- | --- |
| dmut [i32] | mut [mut i32] |
| dmut [[[i32]]] | mut [mut [mut [mut i32]]] |

We define the mutability level, as the deeper level in the type that
is mutable. An example of mutability level is presented in the
following table : 

| Type | Level |
| --- | --- |
| mut [i32] | 1 |
| [i32] | 0 |
| mut [mut i32] | 2 |
| dmut [[[i32]]] | 4 |

## Alias a function parameter

As you have noticed, the keyword "alias", unlike the keyword "ref",
does not characterize a variable. The type of a variable will tell
whether the type must be passed through alias or not, and therefore
there is no change in the definition of the function.

```ymir 
import std::io

def foo (mut x : [mut i32]) {
	x [0] = x [1];
}

def main () {
	let dmut x = [1, 2, 3];
	foo (alias x);
	//   ^^^^^
	// Try to remove the alias
}
```

Like for the variable, if the parameter of the function cannot have
effect on the values that are borrowed, the alias keyword is not
mandatory.

```ymir 
import std::io

def foo (x : [i32]) {
	println (x);
}

def main () {
	let dmut x = [1, 2, 3];
	foo (x);
}
```


