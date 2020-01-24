# Functions 

Functions are declared using the keyword `def`. Its argument are
declared exaclty like variables, and the return type is specified
using the arrow token `->`.

The body of a function is an expression, and this is expression gives
the final value of the function. The `return` statement can be used to
end a function earlier.

```ymir 

def add (x : i32, y : i32)-> i32 {
	x + y
}

def sub (x : i32, y : i32)-> i32 {
	x - y
}

def addOrSub (f : bool, x : i32, y : i32)-> i32 {
	if (f) add (x, y)
	else sub (x, y)
}

def is_divisable (x : i32, y : i32)-> bool {
	// Quit the function if y is equal to 0, and return false
	if (y == 0) return false;
	
	// The value in all other cases
	(x % y) == 0
}
```


