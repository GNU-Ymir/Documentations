# Template values

In the previous chapter, we saw that some values can be known at the
time of compilation. These values can be used for the compiler to
decide which part of the code should be compiled and which part should
not.

## Compilation time variable

A compilation time value can also be passed as a parameter of a
template.  A template argument defined like a variable with the token
`:`, will accept a compilation time value of the type that is
specified on the right operand. The left operand will then be an alias
of the value, that will be pasted each time it is referenced in the
body of the template.

For example the following program, compute the value of fibonacci at
compilation time. You can see that the template `fibo` accept a
compilation time value of type `i32`.

```ymir
import std::io

def fibo (N : i32) () -> i32 {
	cte if (N == 0)
		0
	else cte if (N <= 2)
		1
	else 
		fibo!(N - 1) + fibo!(N - 2)	
}

def main () {
	let x = cte (fibo!(12)); 
	println (x);
	// will be rewritten into :
	// println (144) 
}
```

**Exercise :** Try to remove the `cte` keywords in the example above.

The compilation time execution is really efficient, for example the following
code will compile without any problem.

```ymir
import std::io

def fibo (N : u64) () -> u64 {
    cte if (N == 0u64)
        0u64
    else cte if (N <= 2u64) {
		1u64
    } else {
		fibo!(N - 1u64) + fibo!(N - 2u64)
    }
}

def main () {
    let x = cte (fibo!(fibo!12u64)); 
    println (x);
}
```

## Template type for compilation time variable

The type of the compilation time variable can be a template. In that
case the system works like for `Of` specifier, and the template type
must be declared after in the template parameters. For example, the
following template function will accept any compilation time value.

```ymir
import std::io;

def foo (N : T, T) () {
	println (T::typeid, "(", N, ")");
}

def main () {
	foo!(42);
	foo!("Hi !");
}
```

Compilation time values, can also be used to get an static array of a
specific size. This evidently works only on static arrays, and not on
slice, because we need to know the size of the array at compilation
time.

```ymir
import std::io

def foo (ARRAY of [T; N], T, N : usize) (a : ARRAY) {
	println ("Got an array of size : ", N);
	println (a);
}

def main () {
	let array = [0; 10u64];
	foo (array);
}
```


## Function as compilation time variable 

Standard function and lambda function can be used as compilation time
values. As for any other compilation time values, the variables are
declared using the token `:` inside of the template parameters.  The
type of a compilation time function, is a function pointer, that is
thus declared with the keywords `fn`. 

```ymir
import std::io

def foo (FUN : fn ()-> T, T) () -> T {
    println ("Execution of a function : ");
    FUN () + 30
}

def bar (FUN : fn (X)-> T, T, X...) (a : X) -> T {
    println ("Execution of function with parameters : ");
    FUN (expand a)
}

def baz () -> i32 {
    12
}

def add (x : i32, y : i32)-> i32 {
    x + y
}

def main () {
    let a = foo!(baz) ();
    let b = bar!(add) (1, 2);
	
    println (a);
    println (b);
}
```
