#Tuples
<hr>

A tuple is a collection of values with different types. You can construct a tuple using parentheses `()`.
You can pass tuple to function parameters, or as function return value to return multiple values.

```ymir

def reverse (pair : (i32, bool)) -> (bool, i32) {
	let (x, y) = pair;
	return (y, x);
}

```
