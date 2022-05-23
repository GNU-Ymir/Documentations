# The lambdas functions

Lambda functions are anonymous functions. They are declared in the body of other functions, and can be assigned in variables.  These functions can be `cte` under certain conditions, and under other conditions allow the management of an environment named `closure`.

## Definition of a lambda function

The syntax of a lambda function is as follows: 

```ymir 
let ld = (x : i32) => x + 1;

assert (ld (2) == 3);
```

The variable `ld`, is a pointer to a function, of the type `fn (i32)-> i32`. As the value of this variable is a function, it can be considered as known at compile time.
Therefore it is also possible to write: 

```ymir
let cte ld = (x : i32) => x + 1;

assert (ld (2) == 3);
```

The difference in the second case is how the call will be handled. When in the first case, the call is made via the dereferencing of a pointer to function (which is unsafe), in the second case the call is written directly during the compilation phase.

It is possible to describe a lambda function on several lines, so that it performs more than one operation.

```ymir
let ld = (x : i32) {
	for i in 0 .. x {
		println (i);
	}
	return x + 1;
};

println (ld (2)); // 0 1 3
```

The lambda functions can also be impure, and the type of parameters is optional. However, when an impure lambda is declared, it must be annotated as known at compilation and cannot be assigned to a dynamic variable.

```ymir
let cte ld1 = (x) => x + 1;

assert (ld1 (2) == 3);

let ld2 = (x) => x + 1; // Error, we can't create a pointer to a function if we don't know the type of parameters
```

## Closure 

The `closure` are particular lambda functions called so because it closes their environment. They are also called `delegate` and the keyword `dg` refers to a pointer to a closure.

```ymir
let num = 10;
let closure = (x : i32) => x + num;

assert (closure (10) == 20);
```

The `num` variable is copied to the lambda function, which allows the function to recover its value. Copy closures can be returned without any problem from a function.

```ymir
def retClosure () -> dg (i32)-> i32 {
	let num = 10;
	return (x : i32) => x + num;
}

let closure = retClosure ();
assert (closure (10) == 20);
```

### Closure by reference

Closures by reference are closures that access their environment by reference. This access allows you to modify the value of local variables in an environment.

```ymir
def transform (closure : dg (i32) -> void, len : i32) {
	for i in 0 .. len {
		closure (i);
	}
}

let myArray = [0, 0, 0, 0];
let closure = ref (i : i32) { myArray [i] = i + 1; };

transform (closure, 4);
assert (myArray == [1, 2, 3, 4]);
```

Unlike copy closure, reference closures sometimes cannot be returned from a function. Indeed, the lifetime of the local variables at the function never exceeds the lifetime of the function.


```ymir
def foo () -> dg (i32)-> void {
    let x = 12;
    return ref (i : i32) { println (i + x); }; // Error, Closure var 'x' does not live long enough
}
```
