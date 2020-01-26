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

<img src="https://gnu-ymir.github.io/Documentations/advanced/memory_x_alias_main.png" alt="drawing" width="450"/>


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


