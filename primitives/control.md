# Control flows

When writing a program, the ability to decide to execute part of the
code conditionally, or to repeat part of the code, is a basic scheme
that can be really useful.

In **Ymir**, unlike many *C* languages, there is no statement,
everything is an expression and can be evaluated. Thus, you can
initialize a variable with an expression `if`, `while` or even `for`.

# If expression

An *if* expression allows you to branch into your code by making
decisions based on conditions. An *if* expression consists of a keyword
`if`, followed by an expression that must be typed as a `bool`,
followed by an expression. You can add an `else` after an *if*
expression, to execute the code, if the condition of the *if*
expression is not met.

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

As mentioned above, since everything is an expression, you can use *if
expressions* as values. Each branch of the *if* expression must have
the same type, otherwise an error will be returned by the
compiler. The value of an *if*, can of course be of type **`void`**.

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

If no `else` follows an *if* expression, a default `else` that does
nothing and has an *empty* value is added. For example, with the
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
 --> main.yr:(3,10)
    | 
 3  | 	let x = if condition {
    | 	        ^^
    | Note : 
    |  --> main.yr:(4,3)
    |     | 
    |  4  | 		5 
    |     | 		^
    |------------------------------ 

ymir1: fatal error: 
compilation terminated.
```

## Loops 

In **Ymir**, there is three kind of loops: `loop`, `while` and `for`.

### Infinite repetitions with `loop`

The keyword `loop` is used to specify that a block of code must be
repeated endlessly.

```ymir
def main () {
	loop {
		println ("I will be printed an infinite number of times");
	}
}
```

A loop can be used to repeat an action until it succeeds, e.g. waiting
for the end of a thread, or waiting for incoming network connections,
etc.  The keyword `break` is used to stop a loop and gives it a value.

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

The above source code will produce the following result:

```
Result : 11
```

### Loop while condition is met

The keyword `while` creates a loop, which continues until a condition
is no longer satisfied. As for the `loop`, it can be broken with the
keyword `break`. The value of a *while* is given by the value of its
content expression, at the last iteration, or by the value given by a
`break` if it has been broken.

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

The above source code will produce the following result:

```
X is : 10
```

### For loops to iterate over a value

The last type of loop is the `for` loop. It is applicable on an
iterable type. The value of a `for` loop works exactly like the
evaluation of the value of a `while` loop. Ranges, Slice and Tuple are
iterable types.  For example, for range :

```ymir
import std::io
    
def main () {
    for i in (0 .. 8).step_by (2) {
		println (i);
    }	
	
	for i in 10 .. 0 {
		println (i, "!");
	}
}
```

You can iterate a slice by value, by defining a single iterator on the
for loop. This variable, will make a copy of each element of the
slice, at each iteration. Of course, you can choose to iterate by
reference, and even make it mutable. Or get the index at the same
time. When using an index, its type is a **`usize`**.

- Iteration by value :

```ymir
for i in [1, 2, 3]
```

- Iteration by reference : 

```ymir
let mut x : [mut i32] = [1, 2, 3];
for ref mut i in x {
	i = 8;
}
println (x);
```

- Iteration by value and index, (the value can of course be a reference) : 

```ymir
for index, value in [1, 2, 3]
```

If the slice you are iterating on is mutable, you can have mutable
access to its values.

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

The mutability of the tables and the reference system are advanced
knowledge of the language, and will not be discussed in this
chapter. For more information, please read the chapter on
[Aliases and references]().

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

