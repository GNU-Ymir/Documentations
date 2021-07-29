# Simple operator overloading

This chapter presents the standard operator overloading : *unary*, *binary* and *comparison*.

## Unary operator

Unary operators are operators that are applied to only one
operand. The overloading of the operator is made by defining a
template method inside the class definition. The name of the template
method must be **`opUnary`**, and must take a template value as first
argument. The table bellow lists the rewrite operations that are done
by the compiler to call the correct template method for operator
overloading.

| expression | rewrite |
| --- | --- |
| -e | e.opUnary!("-") |
| *e | e.opUnary!("*") |
| !e | e.opUnary!("!") |

In the following example, the class **`A`** has two **`opUnary`**
methods. The first one at line **8**, is applicable with the operator
**`-`**, and the second one at line **12** is applicable with any
other operators. 

```ymir
import std::io;

class A  {
    let _a : f32;
    
    pub self (a : f32) with _a = a {} 
    
    pub def opUnary {"-"} (self) -> &A {
		A::new (-self._a)
    }
    
    pub def opUnary {op : [c32]} (self) -> &A {
        cte if (op == "!") // op is compile time known
            A::new (1.f / self._a)
        else // operator '+'
            self
    }

    impl Streamable;
}

def main () {
    let a = A::new (10.0f);
    println (!a); 
}
```

<br>

This example, call the method defined at line **12** by using the
operator **`!`**. In this method the value of **`op`** is known at
compile time, and thus can be compared (also at compile time). The
**`!`** unary operator is defined for the class **A** as giving the
inverse of the value stored in the object, thus the result is the
following :

```
main::A(0.10000)
```

## Binary operator 

Binary operators are also overloadable. As for unary operators, the
overloading of binary operators is made by code rewritting at compile
time. In the case of binary operators, the operation involves two
different operands, one of them must be an object instance. 

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


The following example presents a class **`A`** that overload the
operator **`+`** and **`-`** using a **`i32`** as a second operand.

```ymir
import std::io;

class A {
    let _a : i32;

    pub self (a : i32) with _a = a {}

    pub def opBinary {"+"} (self, a : i32) -> &A {
        A::new (self._a + a)
    }

    pub def opBinary {"-"} (self, a : i32) -> &A {
        A::new (self._a - a)
    }
	
	impl Streamable;
}

def main () {
    let a = A::new (12);
    println (a - 30);
}
```

<br>

Results: 
```
main::A(-18)
```

<br>

Because there are two operands (sometimes of different types), binary
operation can sometimes be not commutative (for example the math
binary operator **`-`**). To resolve that problem the rewritting is
made in two different steps, the first step tries to rewritte the
operation using the method **`opBinary`**, if this first rewritte
failed a second rewritte is made, but this time using the right
operand and by calling the method **`opBinaryRight`**. If the right
operator is not defined, the compiler **does not** try to make the
operation commutative, the two methods must be defined.

```ymir
import std::io;

class A {
    let _a : i32;

    pub self (a : i32) with _a = a {}

    pub def opBinaryRight {"-"} (self, a : i32) -> &A {
        A::new (a - self._a)
    }
	
	impl Streamable;
}

def main () {
    let a = A::new (12);
    println (54 - a);
}
```

<br>
Results: 
```
main::A(42)
```

## Limitations

For the moment, templates method cannot be overriden by children
classes. For that reason, it is impossible to override the behavior of
the binary operator of an ancestor class. The limitation is the same
for unary operators. However, to allow such behavior, the overloading
method can call a standard method (without template), that is
overridable by a children class. An example is presented in the
following source code.

```ymir
import std::io

class A {

    let _i : i32;
    pub self (i : i32) with _i = i {}
    
    pub def opBinary {"+"} (self, i : i32) -> &A {
        self.add (i)
    }

    pub def add (self, i : i32)-> &A {
        A::new (i + self._i)
    }

    impl Streamable;
}

class B over A {
    pub self (i : i32) with super (i) {}

    pub over add (self, i : i32)-> &A {
        B::new (i * self._i)
    }

    impl Streamable;
}

def main () {
	let mi = B::new (8);
	println (mi + 8);
}
```

**Contribution** How to override template method is currently under
discussion ! But it seems impossible for many reasons that are not
discussed here, you can contact us for more information.

## Comparison operators

 The equality and comparison are treated via two different methods
`opEquals` and `opCmp`. Because while almost all types can be compared
for equality, only some have meaningful order comparison.

The `opCmp` method is used for the operators `<`, `>`, `<=` and `>=`
only. And the method `opEquals` is used for the operator `==` and
`!=`. When the method `opEquals` is not defined for the type, the
compiler will try to use the method `opCmp` instead. When both the
methods are defined, **it is up to the user to ensure that these two
functions are consistent**.

Indeed, it is impossible to verify that in a general case. For example
the operator **`<`** can be used on a set object, where the operator
`x < y` stand for `x` is a strict subset of `y`. Therefore, even if
neither `x < y` and `y < x` are true, the equality `x == y` is not
implied.

### Overloading == and != 

The method **`opEquals`** is a simple method, that does not take
template arguments. Expressions of the form `a != b`, are rewritten
into `!(a == b)`, therefore there is only one method to define.

```ymir
import std::io

class Point {

	let x : i32, y : i32;
	
	pub self (x : i32, y : i32) with x = x, y = y {}
	
	pub def opEquals (self, other : &Point) -> bool {
		self.x == other.x && self.y == other.y
	}
	
}

def main () 
    throws &AssertError 
{
	let a = Point::new (1, 2);
	let b = Point::new (2, 3);
	let c = Point::new (1, 2);
	assert (a == c);
	assert (a != b);
}
```

<br>

The operator `opEquals` is assumed **commutative**, thus when the
operator is only defined for the type on the right operand, the
operation will simply be rewritten reversely. The following example
presents such a case, where the operator **`opEquals`** is only
defined by the class **`A`**. The line **19** is simple rewritten into
**`mi.opEquals (8)`**.

```ymir
import std::io

class MyInt {

    let i : i32;
    
    pub self (i : i32) with i = i {}
    
    pub def opEquals (self, i : i32) -> bool {
	self.i == i
    }
    
}

def main ()
    throws &AssertError
{
    let mi = MyInt::new (8);
    assert (8 == mi);
}
```

### Overloading <, >, <= and  >=

The method **`opCmp`** is used to compare an object to another
value. The comparison unlike equality evaluation, gives a comparison
order between two values. The method **`opCmp`** does not take any
template parameter, but returns an integer value. A negative value
meaning that the left operand is lower than the right operand, an
positive value, that the left operand is higher than the right one,
and a nul value that both operands are equals.


The following table lists the possible rewritting of the comparison
operators. As we can see in this table, the operator is assumed to be
not commutative, thus if the first rewritting fails to compile (for
type reason), then the second rewritting is used.

| comparison | rewrite 1 | rewrite 2 |
| --- | --- | --- |
| a < b | a.opCmp (b) < 0 | b.opCmp (a) > 0 |
| a > b | a.opCmp (b) > 0 | b.opCmp (a) < 0 |
| a <= b | a.opCmp (b) <= 0 | b.opCmp (a) >= 0 |
| a >= b | a.opCmp (b) >= 0 | b.opCmp (a) >= 0 |


In the following example, a comparison operator is used at line
**`19`**, the rewritting **`(7).opCmp (mi) < 0`** does not compile,
because **`7`** is not an object value, and thus does not have any
method. The second rewritting is thus used, **`mi.opCmp (7) > 0`**.

```ymir
import std::io

class MyInt {

	let i : i32;
	
	pub self (i : i32) with i = i {}
	
	pub def opCmp (self, i : i32) -> i32 {
		self.i - i
	}
	
}

def main ()
    throws &AssertError
{
	let mi = MyInt::new (8);
	assert (7 < mi);
}
```

## Assignment

The assignment operator is not overloadable, it will always perform
the same operation. However, the shortcut operators **`+=`, `-=`,
`*=`** etc, are usable on object when oveloading the binary
operator. This operation is simply rewritten at compilation time, for
example the expression **`a += 12`** is rewritten into **`a =
a.opBinary!{"+"}(12)`**. The following example presents an utilisation
example of the **`+=`** shortcut.

```ymir
import std::io

class MyInt {

    let _i : i32;
    
    pub self (i : i32) with _i = i {}

    pub def opBinary {"+"} (self, a : i32)-> &MyInt {
        MyInt::new (self._i + a)
    }
	
    impl Streamable;
}

def main () {
    let mut mi = MyInt::new (8);
    mi += 9;
    println (mi);
}
```

<br>

Results: 
```
main::MyInt(17)
```

<br>

One can note that the instance of the object stored in the variable
**`mi`** is changed after the affectation. This is the standard
behavior of the **`=`** operator.
