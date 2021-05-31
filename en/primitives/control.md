# Control flows

When writing a program, the ability to decide to execute part of the
code conditionally, or to repeat part of the code, is a basic scheme
that is necessary. 

# If expression

An **`if`** expression is a control flow allowing to branch into the
program code by making decisions based on conditions. An `else` can be
placed after an *if* expression, to execute a part of code, if the
condition of the *if* expression is not met. The syntax of the *if
expression* is presented in the following code block.

```grammar
if_expression := 'if' expression expression ('else' expression)?
```

<br>

The following source code present a basic utilization of the *if expression*. 

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

The value of an *if expression* is computed by the block of code that
is executed when branching on the condition. Each branch of the
**`if`** expression must have a value of the same type, otherwise an
error is returned by the compiler. The value of an **`if`**, can of
course be of type **`void`**.

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

If there is a possibility for the program to enter none of the branch
of the *if expression*, then the value of the whole *if expression* is
of type **`void`**. For example, in the following source code, the
variable condition can be either **`true`** or **`false`**, leading to
the possibility for the *if expression* defined at line **5** to be
never entered, and to the possibility for that the value of **`x`** to
be never set.

```ymir
def foo () -> bool { // ... } // return a bool value

def main () {
	let condition = foo ();
	let x = if condition { // the condition can be false
		5 
	}; // and then the expression has no value
	   // but the variable x cannot be of type void
}
```
Errors: 
```error
Error : incompatible types void and i32
 --> main.yr:(5,10)
 5  ┃ 	let x = if condition { // the condition can be false
    ╋ 	        ^^
    ┃ Note : 
    ┃  --> main.yr:(6,3)
    ┃  6  ┃ 		5 
    ┃     ╋ 		^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

## Loops 

In *Ymir*, there are three kinds of loops: `loop`, `while` and `for`.

### Infinite repetitions 

The keyword **`loop`** is used to specify that a scope must be
repeated endlessly. The syntax of the **`loop`** expression is the
following:

```grammar
loop_expression := 'loop' expression
```

<br>

In the following example, the program will never exit, and will print,
an infinite number of times, the string `"I will be printed an infinite
number of times".`

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
etc.  The keyword **`break`** is used to stop a loop. A *break
statement* is associated with a value, which is following the
keyword. The value of a loop is defined by the value given by the
*break statement*. Every *break statement* in a *loop* must share the
same type. A loop can evidently be of type **`void`**.

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
	println ("Result : ", result);}

```
Results:
```
Result : 11
```

<br>

### Loop while condition is met

The keyword **`while`** creates a loop, which repeats until a
condition is no longer satisfied. As for the *loop*, it can be broken
with the keyword **`break`**. Unlike *loop* the value of a while loop
is always of type **`void`**, because it is impossible to ensure that
the *while* is entered at all. The *break statement* must follow that
rule, and break only with values of type **`void`**. 
*Contribution:*
It is planned to add the possibility to write an *else* after a *while
loop* to give a value to the *while loop* when it is not entered.


The grammar of the *while* loop is presented, in the following code
block.

```grammar
while_expression := 'while' expression expression
```
<br>


The following example, present an utilization of a *while* loop, where
the loop iterates 10 times, while the value of **`i`** is lower than
**10**. 

```ymir
import std::io

def main () {
	let mut i = 0;
	while i < 10 {
		i += 1;	
	};
	
	println ("I is : ", i);
}
```
<br>

Results:
```
I is : 10
```

<br>

### Iterate over a value

The last type of loop is the *for loop* defined with the keyword
**`for`**. Like for the *while loop* the value of a *for loop* is
always **`void`** as it is impossible to garantee that the loop is
entered even once. The *for loop* iterates over an iterable
type. Primitive iterable types are ranges, tuple, slices and static
arrays.

```grammar
for_expression := 'for' ('(' var_decls ')' | var_decls) 'in' expression expression

var_decls := var_decl (',' var_decl)
var_decl := (decorator)* identifier (':' type)?

decorator := 'ref' | 'mut' | 'dmut'
```

<br> 

**1) Iteration over a range.** In the following example, the *for loop* is
used to iterate over two ranges. The first loop at line **4**,
iterates between **0** and **8** (not included), by a step of
**2**. When the second loop iterate between the value **10** and **0**
(not included) with a step of **-1**.

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

**2) iteration over slices and static arrays.** Slices are iterable
types. They can be iterated using one or two variables. When only one
variable is used, it is associated with the values contained inside
the slice. When two variable are used, the first variable is
associated to the current iteration index, and the second variable to
the values contained inside the slice. Static array iteration works
the same.


```ymir
import std::io;

def main () {
	let a = [10, 11, 12];
	for i in a {
		print (i, " ");
	}
	
	println ("");
	for i, j in a {
		print (i, "-> ", j, " ");
	}
	println ("");
}
```
Results:
```
10 11 12 
0-> 10 1-> 11 2-> 12
```
<br>

*Contribution*: the iteration by reference over mutable slice, and
mutable static arrays is currently under development.


**3) iteration over tuples.** Tuple are iterable types. But unlike slice,
or range the *for loop* is evaluated at compilation time. The tuple
can be iterated using only one variable, that is associated to the
values contained inside the tuple.

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

<br>

One may note that the type of the variable **`i`** in the *for loop*
of the above example changes from one iteration to another, being of
type **`i32`** at first iteration and then of type **`c32`**. For that
reason, the *for loop* is not really dynamic, but flattened at
compilation time. This does not change anything from a user
perspective, but is worth mentioning, to avoid miscomprehension of
static type system, there is no hidden dynamicity here.

