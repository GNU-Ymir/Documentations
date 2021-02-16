# Control flows

When writing a program, the ability to decide to execute part of the
code conditionally, or to repeat part of the code, is a basic scheme
that can be really useful. In **Ymir**, unlike many *C* languages,
there is no statement, everything is an expression and can be
evaluated. Thus, **`if`**, **`while`**, and any other control flow
expressions have a value.

# If expression

An **`if`** expression allows you to branch into your code by making
decisions based on conditions. You can add an `else` after an *if*
expression, to execute the code, if the condition of the *if*
expression is not met. The syntax of the **`if`** expression is the
following:

```grammar
if_expression := 'if' expression expression ('else' expression)?
```

<br>

The following source code present a basic utilization of the **`if`**
expression. In this example, the expression has no value, and is then
evaluated as a **`void`** expression.

```ymir
def main () {
	let x = 5;
	
	if x < 5 {
	   println ("X is lower than 5");
	} else if (x == 5) { // parentheses are optional
	  println ("X is exactly 5");
	} else {
	  println ("X is higher than 5");
	}
}
```

<br>

As mentioned above, since everything is an expression, you can use
**`if`** expressions as values. Each branch of the **`if`** expression
must have the same type, otherwise an error will be returned by the
compiler. The value of an **`if`**, can of course be of type
**`void`**.

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

<br>

If there is a possibility that no branch of an expression **`if`** is
visited, then the value of the whole **`if`** expression is
**`void`**. Then, with the following source code, the compiler will
return an error, because there is a possibility for the variable
`condition` to be evaluated to `false`.

```ymir
def foo () -> bool { // ... } // return a bool value

def main () {
	let condition = foo ();
	let x = if condition { // the condition can be false
		5 
	}; // and then the expression has no value, that is not possible
}
```

<br>

```error
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

<br>

## Loops 

In **Ymir**, there is three kind of loops: `loop`, `while` and `for`.

### Infinite repetitions with `loop`

The keyword **`loop`** is used to specify that a block of code must be
repeated endlessly. The syntax of the **`loop`** expression is the
following:

```grammar
loop_expression := 'loop' expression
```

<br>


```ymir
def main () {
    loop { // the loop will never exit
         println ("I will be printed an infinite number of times");
    }
}
```

<br>

A loop can be used to repeat an action until it succeeds, e.g. waiting
for the end of a thread, or waiting for incoming network connections,
etc.  The keyword **`break`** is used to stop a loop and to give a
value to it.

```ymir 
import std::io

def main () {
	let mut counter = 0;
	
	let result = loop { 
		counter += 1;
		if counter == 10 {
			break counter + 1; // stop the loop and set its value to 'counter + 1'
		}
	};
	println ("Result : ", result);
}
```

<br>

The above source code will produce the following result:

```
Result : 11
```

<br>

### Loop while condition is met

The keyword **`while`** creates a loop, which continues until a
condition is no longer satisfied. As for the **`loop`**, it can be
broken with the keyword **`break`**. The value of a **`while`** is
given by the value of its content expression, at the last iteration,
or by the value given by a **`break`** if it has been broken.

The syntax of the **`while`** expression is the following:

```grammar
while_expression := 'while' expression expression
```

<br>

```ymir
import std::io

def main () {
	let mut i = 0;
	let x = while i < 10 {
		i += 1	// the value of the while loop will be equal to 'i' at the last iteration	
	};
	
	println ("X is : ", x);
}
```

<br>

The above source code will produce the following result:

```
X is : 10
```

<br>

### For loops to iterate over a value

The last type of loop is the **`for`** loop. It is applicable on an
iterable type. The value of a **`for`** loop works exactly like the
evaluation of the value of a **`while`** loop. Ranges, Slice and Tuple
are iterable types. For example, for range :

The syntax of the **`while`** expression is the following:

```grammar
for_expression := 'for' ('(' var_decls ')' | var_decls) 'in' expression expression

var_decls := var_decl (',' var_decl)
var_decl := (decorator)* identifier (':' type)?

decorator := 'ref' | 'mut' | 'dmut'
```

<br>

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

<br>

You can iterate a slice by value, by defining a single iterator on the
for loop. This variable, will make a copy of each element of the
slice, at each iteration. Of course, you can choose to iterate by
reference, and even make it mutable. Or get the index at the same
time. When using an index, its type is a **`usize`**.

- Iteration by value :

```ymir
for i in [1, 2, 3]
```

<br>

- Iteration by reference : 

```ymir
let mut x : [mut i32] = [1, 2, 3];
for ref mut i in x {
	i = 8;
}
println (x);
```

<br>

- Iteration by value and index, (the value can of course be a reference) : 

```ymir
for index, value in [1, 2, 3]
```

<br>

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

<br>

The mutability of the tables and the reference system are advanced
knowledge of the language, and will not be discussed in this
chapter. For more information, please read the chapter on
[Aliases and references](https://gnu-ymir.github.io/Documentations/en/advanced/).

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

