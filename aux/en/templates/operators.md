# Operator overloading

The operator overload is done by rewriting the operations applied on
objects operands. No new syntax is used for operator overloading. They
use compilation time values, and template definition to choose the
correct operator.

## Unary operator


The overloading of binary operators is done by defining the `opUnary` function.
It is rewritten as follows: 

| expression | rewrite |
| --- | --- |
| -e | e.opUnary!("-") |
| *e | e.opUnary!("*") |
| !e | e.opUnary!("!") |

```ymir
import std::io;

class A  {
    let a : f32;
    
    pub self (a : f32) with a = a {} 
    
    pub def opUnary ("-") (self) -> A {
	A::new (-self.a)
    }
    
    pub def opUnary (op : [c32]) (self) -> A {
        if (op == "!")
            A::new (1.f / self.a)
        else
            self
    }

    impl std::io::Printable {
        pub over print (self) {
            print ("A(", self.a, ")");
        }
    }
}

def main () {
    let a = A::new (42.0f);
    println (!a); 
	// This is exactly the same as : 
	// println (a.opUnary!("!") ());
}
```

## Binary operator 

Binary operators are also overloadable. As for unary operators, this
overload can only be done on objects. They are rewritten with the
function `opBinary` and `opBinaryRight`. The rewritte with a call to
the function `opBinary` is tested first, and if it does not compile,
then the rewritte with the call to the function `opBinaryRight` is
then tried.

The following operators are overloadable. The use indicated in the
left column is only an indication and corresponds to the common use of
these operators, but they can of course be used for other purposes.

<table>
<tbody>
<tr>
<td align="left"><bold>Math</bold></td>
<td align="center"><code>+</code></td>
<td align="center"><code>-</code></td>
<td align="center"><code>*</code></td>
<td align="center"><code>/</code></td>
<td align="center"><code>%</code></td>
<td align="center"><code>^^</code></td>
</tr>

<tr>
<td align="left"><bold>Bitwise</bold></td>
<td align="center"><code>|</code></td>
<td align="center"><code>&</code></td>
<td align="center"><code>^</code></td>
<td align="center"><code> << </code></td>
<td align="center"><code> >> </code></td>
</tr>

<tr>
<td align="left"><bold>Array</bold></td>
<td align="center"><code>~</code></td>
</tr>
</tbody>
</table>

<!-- |     |     |      |      |     |      | -->
<!-- | --- | --- | ---- | --- | --- | ---- | -->
<!-- | `+` |	`-`	| `*`  | `/` |	`%` | `^^` | -->
<!-- | `\|` | `^` | `<<` | `>>` |	`~` | `&`  | -->


```ymir
import std::io;

class A {
    let a : i32;

    pub self (a : i32) with a = a {}

    pub def opBinary ("+") (self, a : i32) -> A {
        A::new (self.a + a)
    }

    pub def opBinaryRight ("+") (self, a : i32)-> A
        self + a

    pub def opBinary ("-") (self, a : i32) -> A {
        A::new (self.a - a)
    }

    pub def opBinaryRight ("-") (self, a : i32)-> A
        A::new (a - self.a)
        
        
    impl std::io::Printable {
        pub over print (self) {
            print (self.a);
        }
    }
}

def main () {
    let a = A::new (12);
    println (30 - a);
}
```

## Comparison operators

The comparison operators are also overloadable, but not like binary
operators. The equality and comparison are treated via two different
functions `opEquals` and `opCmp`. Because while almost all types can
be compared for equality, only some have meaningful order comparison. 

The `opCmp` function is used for the operators `<`, `>`, `<=` and `>=`
only. And the function `opEquals` is used for the operator `==` and
`!=`. When the method `opEquals` is not defined for the type, the
compiler will try to use the method `opCmp` instead. When both the
function are defined, it is up to the user to ensure that these two
functions are consistent.

Indeed, it is impossible to verify that in a general case. You may
want for example to define a set object, where the operator `x < y`
stand for `x` is a strict subset of `y`. Therefore, if neither `x < y`
and `y < x` are true, that does not implies that `x == y`.

### Overloading == and != 

Expression of the form `a != b`, are rewritten into `!(a == b)`,
therefore there is only one function to define. 

```ymir
import std::io

class Point {

	let x : i32, y : i32;
	
	pub self (x : i32, y : i32) with x = x, y = y {}
	
	pub def opEquals (self, other : Point) -> bool {
		self.x == other.x && self.y == other.y
	}
	
}

def main () throws AssertError {
	let a = Point::new (1, 2);
	let b = Point::new (2, 3);
	let c = Point::new (1, 2);
	assert (a == c);
	assert (a != b);
}
```

The operator `opEquals` is supposed commutative, so when the operator
is only defined for the type on the right operand, the operation will
simply be rewritten reversely.

```ymir
import std::io

class MyInt {

	let i : i32;
	
	pub self (i : i32) with i = i {}
	
	pub def opEquals (self, i : i32) -> bool {
		self.i == i
	}
	
}

def main () throws AssertError {
	let mi = MyInt::new (8);
	assert (8 == mi);
}
```

### Overloading <, >, <= and >=

Those operators are overloadable by rewritting and calling the method
`opCmp`. This method must return an signed integer element. The
following table presents how the operators are rewritten.

| comparison | rewrite 1 | rewrite 2 |
| --- | --- | --- |
| a < b | a.opCmp (b) < 0 | b.opCmp (a) > 0 |
| a > b | a.opCmp (b) > 0 | b.opCmp (a) < 0 |
| a <= b | a.opCmp (b) <= 0 | b.opCmp (a) >= 0 |
| a >= b | a.opCmp (b) >= 0 | b.opCmp (a) >= 0 |

The first rewrite is tried first, if it fails, the second is tested.
If the method `opEquals` is not defined the method `opCmp` will be
used, and will be rewritten as `a.opCmp (b) == 0`.

```ymir
import std::io

class MyInt {

	let i : i32;
	
	pub self (i : i32) with i = i {}
	
	pub def opCmp (self, i : i32) -> i32 {
		self.i - i
	}
	
}

def main () throws AssertError {
	let mi = MyInt::new (8);
	assert (7 < mi);
}
```

## Assignment

The assignment operator is not overloadable, it will always perform
the same operation. However, the shortcut operators `+=`, `-=`, `*=`
etc, are usable on object when oveloading the binary operator. In that
case, the method `opBinary` must return a mutable object.

```ymir
import std::io

class MyInt {

    pub let i : i32;
    
    pub self (i : i32) with i = i {}

    pub def opBinary ("+") (self, a : i32)-> mut MyInt {
		//                                   ^^^
		//                     Try to remove the mut there
        MyInt::new (self.i + a)
    }
    
}

def main () {
    let mut mi = MyInt::new (8);
    mi += 9;
    println (mi.i);
}
```

## Access operator

The operator of index `[]` is overloadable by the method
`opIndex`. This method will simply be called with the parameters
passed inside of the brackets. For example, the following operation `a
[b, c, d]` will be rewrite into `a.opIndex (b, c, d)`.

```ymir 
import std::io

class A {
	let i : [i32];
	
	pub self (a : [i32]) with i = a {}
	
	pub def opIndex (self, x : i32) -> i32 
		throws OutOfArray
	{
		self.i [x]
	}
	
}

def main () 
	throws OutOfArray, AssertError
{
	let i = A::new ([1, 2, 3]);
	assert (i [2] == 3)
}
```

## Contain operator

The contain operator is a binary operator used to check if an element
is inside another one. This operator is defined using the keyword
`in`. Unlike other operator, the rewritte for the overloading is made
only once on the right operand, and call the method `opContains`. The
expression `a !in b` will be rewritten into `!(a in b)`.

```ymir
class A {
	
	let a : [i32];
	
	pub self (a : [i32]) with a = a {}
	
	pub def opContains (self, i : i32)-> bool {
		for j in self.a {
			if (i == j) return true;
		}
		false
	}	
}

def main () 
	throws AssertError
{
	let i = A::new ([1, 2, 3]);
	assert (2 in i);
	assert (9 !in i);
}
```
