# Control flows

When writting a program, the possibility of deciding to run a section
of code under condition, or repeat a part of a code, is a basic
pattern that can be really useful. 

In **Ymir** unlike many *C-like* language, there is no such things as
a statement, everything is an expression and can be evaluated as a
value. You can therefore initialise variable with a `if`, a `while` or
even a `for` expression.

# If expression

A if allows you to branch your code by making decision based on
conditions. A if expression is composed by a `if` keyword, followed by
an expression that has to be typed as a `bool`, followed by a
expression. You can add an `else` after an *if expression*, to perform
a code, if the condition of the *if expression* is not respected.

```ymir
def main () {
	let x = 5;
	
	if x < 5 {
		println ("X is lower than 5");
	} else {
		println ("X is higher or equal to 5");
	}
}
```

You can add an every expression you want after an `else`, for example another `if`.

```ymir
def main () {
	let x = 5;
	if x < 5 {
		println ("X is lower than 5");
	} else if x == 5 {
		println ("X is equal to 5");
	}
}
```

As said above, since everything is an expression, you can use *if
expressions as value*. For an if expression to have a value that is
not typed **`void`**, every branch of the **`if`** must have the same
type. 

```ymir
def main () {
	let condition = true;
	let x = if condition {
		5 
	} else {
		7
	};
}
```

If no `else` follows an *if expression*, a default `else` that does
nothing and have a value of type `void` is added. For example with the
following code :


```ymir
def main () {
	let condition = true;
	let x = if condition {
		5 
	};
}
```

You should get the following error: 

```
Error : incompatible types void and i32
 --> main.yr:(3,13)
    | 
 3  |     let x = if condition {
    |             ^
Note : 
 --> main.yr:(4,2)
    | 
 4  | 	5
    | 	^

ymir1: fatal error: 
compilation terminated.
```

## Loops 

In **Ymir**, there is three kind of loops: `loop`, `while` and `for`.

### Infinite repetitions with `loop`

The `loop` keyword tells to the compiler, that a block of code has to
be repeated forever.

```ymir
def main () {
	loop {
		println ("I will be printed an infinite number of time");
	}
}
```
A loop can be used to repeat an action until it succeed, such as wait
the end of a thread, or wait incoming network connections, etc.  The
keyword `break` allows you to stop a loop, and give a value to it.

```ymir 
import std::io

def main () {
	let mut counter = 0;
	
	let result = loop {
		counter += 1;
		if counter == 10 {
			break counter + 1;
		}
	};
	println ("Result : ", result);
}
```

Will give the following result once executed : 

```
Result : 11
```

### Loop while condition is met

The `while` keyword allows you to create a loop, that continue until a
condition is unmet. As for the `loop`, it can be breaked with the
keyword `break`. The value of a while is given by the value of its
content expression, at the last iteration, or by the value given by a
`break` if has been breaked.

```ymir
import std::io

def main () {
	let mut i = 0;
	let x = while i < 10 {
		i += 1		
	};
	
	println ("X is : ", x);
}
```

While produced the following results : 

```
X is : 10
```

### For loops to iterate over a value

The last type of loop is the `for` loop. It is applicable on an
iterable type. The value of a `for` loop works exactly like the value
of a while loop.

Ranges, Slice, and Tuple are iterable types. 
For example for range : 

```ymir
import std::io
    
def main () {
    for i in (0 .. 8).step_by (2) {
		println (i, "!");
    }	
	
	for i in 10 .. 0 {
		println (i, "!");
	}
}
```

For slices, this is a bit more complex, you can iterate by value like that : 
```ymir
for i in [1, 2, 3]
```

Or get the index at the same time 
```ymir
for index, value in [1, 2, 3]
```

If the slice on which you are iterating is mutable, you can have a mutable ref access to its values.
```ymir
import std::io

def main () {
	let mut x : [mut i32] = [1, 2, 3, 4];
	for ref mut i in x {
		if i % 2 == 0 {
			i = 8;
		}
	}
	println (x);
}
```

You can also iterate over tuple, but it will be a static iteration,
and is equivalent to a static rewrite.

```ymir 
import std::io 

def main () {
	let x = (1, 'r');
	for i in x {
		println (i);
	}
	
	// Is equivalent to 
	println (x.0);
	println (x.1);
}
```
