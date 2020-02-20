# Compilation time execution

In **Ymir**, templates are seen as compilation time execution
parameters. They can be used to create values, symbols, are to make
the compiler take decisions. 

## Compilation time values

Basically, every values can be know at compilation time as long as they do
not implies variable, or dynamic branching. For example this value
`foo ()` acquired from the following source code can be known at
compilation time.

```ymir
def foo () -> i32
	bar () + baz ()
	
def bar () -> i32 
	12
	
def baz () -> i32
	30
```

To see if a value can be known at compilation time a simple test is to use
it as a template parameter. **Exercise :** Try to compile the
following source code with the option `-fdump-tree-gimple`.

```ymir
import std::io

def foo () -> i32
	bar () + baz ()
	
def bar () -> i32 
	12
	
def baz () -> i32
	30
	
def printTemplate (V : i32) ()-> void {
	println (V);
}

def main () {
	printTemplate!(foo ());
}
```

This will generate a file named `main.yr.004t.gimple` containing a
precompiled version of the code. You should get in this file a
definition of the function `printTemplate`.

This chapter does not cover compilation time values, which will be
detailed in the next chapter, but it is important to know what a
compilation time value is in order to understand the following
sections.

## Is operator 

The `is` operator is used to perform a template test that will be
evaluated to a bool value. This is useful for all of the following
principles. The syntax is the following : 

```is ! template_arguments templates_parameters```

```ymir
import std::io;

def foo (T) () {
	let isI32 = is!(T) (X of i32);
	println (isI32);
}

def main () {
	foo!i32 ();
	foo!f32 ();
}
```

## Template function test

When declaring a function with the keyword `def`, you can add a test
that will be evaluated at compilation time, that will force the compiler
to decide wether or not the symbol must be declared. 

```ymir
import std::io;
import std::traits;

def if (isIntegral!T) foo (T) (a : T)-> T
    a + cast!T(30)
    
    
def main () {
    println (foo (12)); 	
}
```

The function `isIntegral` is declared within the module
`std::traits`. This module contains a list of compilation time definitions
that are designed to help for the specialization of templates . Each
value that can be known at compilation time can be used in the test of a
model function.

## Compilation time condition

The keyword `cte` in front of a `if` condition defines that the
condition test must be performed at compilation time. Only the block of
the condition that is satisfied will be compiled.

```ymir
import std::traits;
import std::io;

def foo (T) (a : T)-> T {
	cte if (isIntegral!T) {
		a + 30
	} else {
		// Inconsistent operation on integrals
		a [0]
	}
}

def main () {
	println (foo (12));
}
```

Any condition that can be known at compilation time can be used as a test
of a compilation time condition. 

## Class compilation test

The keyword `cte` can also be used inside class definition to make
decision at compilation time. The syntax is the same as a compilation
time condition.

```ymir
import std::io;

class Container (T) {
	cte if !(is!(T)(X of void)) {
		pub let value : T;
	}
	
	cte if !(is!(T)(X of void)) {
		pub self (x : T) with value = x {}
	} else {
		pub self () {}
	}
	
	impl std::io::Printable {
		pub over print (self) {
			cte if (is!(T)(X of void)) {
				print ("Container!(void)")
			} else {
				print ("Container::value (", self.value, ")")
			}
		}
	}
}

def main () {
	let a = Container!(void)::new ();
	let b = Container::new (42);
	
	println (a);
	println (b);
}
```
