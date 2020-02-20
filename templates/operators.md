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


The overloading of binary operators is done by defining the `opBinary` function.
The following operators are overloadable: 


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

When the operator is not defined, and the right operand is a class,
the compiler will try to rewritte the operation using the
`opBinaryRight` method.

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

## Logical operator

## Assignment

## Access operator

## Contain operator
