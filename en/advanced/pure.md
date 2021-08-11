# Pure values

A pure value is a value that cannot change. In other word it is a
value, that ensure that there is no variable in the program that has a
mutable access to it. Pure values are different to const values, in
the sense that const values just give the guarantee that the current
access is not mutable, however they does not guarantee that there is no
other variable in the program with mutable access.

The different guarantees on values can be listed as follows : 

1. No guarantee, the value is mutable **`mut`**
2. Guarantee that the value is no writable in the current context **`const`** 
3. Guarantee that the value is completely immutable in every context **`pure`**

## Limitation of const values

To understand the limitation of **`const`** values, the following
program has two variable defined in the function **`main`**. The first
one **`a`** has a mutable access to the value, and the variable
**`b`** has a const access to the same value. Because the variable
**`a`** modifies the value, the value pointed by **`b`** is also
modified even if it was **`const`**. Thus, it is important to
understand that **`const`** is only referering to the permission of
the variable **`b`**.

```ymir
import std::io;

def main () {
	let dmut a = [1, 2, 3];
	let b = a;
	
	a [0] = 98;
	
	println (b);
}
```

<br>

Results: 

```
[98, 2, 3]
```

<br>

We have seen in a previous chapter that the keywords **`copy`** and
**`dcopy`** can be used to remove this limitation, and ensure that the
value of **`b`** is the same as the value of **`a`**, but that
modifying the value of **`a`** does not modify the value of
**`b`**. This mechanism is the base of the one provided by **`pure`**
values.

```ymir
import std::io;

def main () 
	throws &OutOfArray
{
	let dmut a = [1, 2, 3];
	let b = dcopy a;
	
	a [0] = 98;
	
	println (b);
}
```

<br>

Results: 

```
[1, 2, 3]
```

<br>

Now let's add a third variable to the equation, and let's name it
**`c`**. In this variable we want to store the value of **`b`**, and
ensure that the variable is never modified. If the initialization of
the variable **`b`** is made in an obscure way (for example in a
function that is not readable, here the **`foo`** function), then the
only way to ensure that the value of **`c`** is never modified, is to
make a copy of it inside the value of **`c`**. If the memory movement
are easy in the following example, it may not be the case in complex
program with many variable and memory movement.

```ymir
import std::io;

def foo (a : [i32])-> [i32] {
	a
}

def main () 
	throws &OutOfArray
{
	let dmut a = [1, 2, 3];
	let b = foo (a);
	
	let c = dcopy b;
	let d = b;
	
	a [0] = 98;
	
	println (c);
	println (d);
}
```

<br>

Results: 

```
[1, 2, 3]
[98, 2, 3]
```

## Purity and the pure keyword

<br> In the above example, both variable **`b`** and **`d`** have no
guarantees, and there values are indeed modified. The **`pure`**
keyword can be added to their definitions. In that case, the compiler
checks the initialization of the values that are used, and ensure that
they came from a deep copy, or another pure value.

```ymir
def foo (a : [i32]) -> [i32] {
	a
}

def main () 
	throws &OutOfArray 
{
	let dmut a = [1, 2, 3];
	
	let pure b = foo (a);
}
```

<br>

```error
Error : discard the constant qualifier is prohibited
 --> main.yr:(10,11)
10  ┃ 	let pure b = foo (a);
    ╋ 	         ^
    ┃ Note : implicit pure of type [i32] is not allowed, it will implicitly discard constant qualifier
    ┃  --> main.yr:(10,19)
    ┃ 10  ┃ 	let pure b = foo (a);
    ┃     ╋ 	                 ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br> To avoid the above error, there is two possibilities. Either we
add a **`dcopy`** on the function call of **`foo`**, or we add
**`pure`** to the return type of **`foo`** and make a deep copy of the
value of **`a`** in this function. The function **`bar`** of the
following example perform the second possibility.

```ymir
import std::io;

def foo (a : [i32])-> [i32] {
	a
}

def bar (a : [i32])-> pure [i32] {
	return dcopy a;
}

def main () 
	throws &OutOfArray 
{
	let dmut a = [1, 2, 3];
	let pure b = dcopy foo (a);
	
	let pure c = bar (a);
	
	let pure d = b;
	let pure e = c;
	
	a [0] = 98;
	
	println (d);
	println (e);
}	
```

<br>

Results: 

```
[1, 2, 3]
[1, 2, 3]
```

<br> One can note that not copy are needed to move the value contained
in the variable **`c`** into the variable **`e`**. This is due to the
fact that **`c`** is pure, so the guarantee of purity is already
made. Thanks to the **`pure`** mechanism some copies can be avoided.

