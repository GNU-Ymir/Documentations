# Primitives types

## Compound type

Unlike the scalar types, compound contains multiple values. 
There are two type of compound type:
- Tuple
- Array and Slice


### Tuple

A tuple is a collection of values of different types. They are constructed using the parentheses `()`. 
Tuple can be used by functions to return multiple values.

```ymir
import std::io
    
/**
 * Reverse a tuple of 2 elements 
 */
def reverse (x : (i32, c32))-> (c32, i32) {
    (x.1, x.0)
}

def foo (a : i32, b : c32) {
    println (a, " ", b);
}

def main () {
    // A tuple of arity four
    let t = (1, 'r', 3.0f, true);
    
    // tuple value can be extracted with the operator '.'	
    println ("First value : ", t._0); 
    println ("Second value : ", t._1); 
    
    // Tuple of tuple
    let _ = ((1, 2), (3,), 1); 
    
    let pair = (1, 't');
    let _ = reverse (pair);
    
    // Tuple can be destructured 
    let (x, y) = pair;
    println ("X : ", x, ", Y : ", y);
    
    // The keyword expand can be used to expand a tuple and call function or create other tuple 
    foo (expand pair);
    let z = (expand pair, 3); 
    
    println (z.0, ' ', z.1, ' ', z.2);
}
```

### Tuple access

A value can be accessed inside a tuple with the operator `.`
The right operand of the this operation must be a integer constant that is known at compile time.

```ymir
import std::io
def foo () -> i32 
    0

def main () {
    let x = (1, 2, 3);
    // Arithemtic value can be retreived at compile time
	println (x.(87 - 86));
	
	// The value 2 is known at compile time
    println (x._2);
	
	// The return value of foo is a constant, and is equals to 0
    println (x.(foo ()));
}
```

### Expand expression

The keyword `expand` is a syntaxic simplification, that unroll a tuple.

```ymir
import std::io

def add (a : i32, b : i32) -> i32 
	a + b


def main () {
    let x = (1, 2);
	println (add (expand x)); 
	
	// Will be rewritten into : 	
	println (add (x.0, x.1));
}
````
