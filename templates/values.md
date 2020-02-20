# Template values

In the previous chapter, we saw that some values can be known at the
time of compilation. These values can be used for the compiler to
decide which part of the code should be compiled and which part should
not.

It can also be used to compute complexe values, that won't change
during the program.

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
