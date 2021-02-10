# Functions 

## Pure functions 

Pure functions are functions, of which we know all the information necessary for it to be compiled, i. e.: 
- all types of parameters are known
- it has a body

The type of return is not necessary for a function to be pure, it will be inferred during its compilation.

The `main` function is always pure, even if the type of the input parameter is not given, it will be inferred from `[[char]]`.

```ymir
def myFirstPureFunction (a : i32, b : f32) -> f32 {
	return cast!f32 (a) + b;
}

def mySecondPureFunction (a : i32, b : [char]) {
	return b [a]; // the type of return is not given, but inferred to char
}
```

A function can only return one type that must be known at compile time.

```ymir
def myImpossibleFunction (a : i32) {
	if a < 10 {
		return a;
	} else {
		return [1, 2]; // Error types [i32; 2U] and i32 are incompatible 
	}
}
```

### Special case 

There is a particular case where the type of return of a pure function cannot be deduced, the case of recursive functions.

```ymir
def fibo (n : i32) {
   if n < 2 { return n; } // n is of type _i32_, the type of the function is _i32_
   else return fibo (n - 1) + fibo (n - 2); // no problem, the type of fibo has been deduced
}

def facto (n : i32) {
  if n >= 1 { return facto (n - 1) * n; } // Error, we don't know the type of the function
  else return 1;
}
```

A pure function from another module than the one being compiled (see [Modules](modules/main.md)) will be imported as an external function, so if its return type is not defined, it will be defined as `void`.

## Impure functions 

Impure functions, unlike pure functions, lack of information to be compiled directly, but have a body. These functions will therefore only be compiled when they are referenced (usually by a call).

The types of parameters that are not known will then be inferred from those of the call parameters. 

```ymir
def foo (a, b : i32, c) { // a and c do not have a type
   // ...
} 

// ...
foo (10, 2, "salut"); // OK, with a : i32 and c : string
foo (10, "salut", 1); // Error, b must be of type i32
```

## External functions

External functions are functions for which the type of all parameters is known, but which do not have a body. They can be used like all other types of functions. The type of return of external functions must be given, if not, it will be considered as `void`.


```ymir
extern foo (a : i32) -> i32; 

println (foo (10)); // Ok```

### Variadics external function

External functions can sometimes come from the C language, which offers a specific variadic function system. This system can be used in ymir, thanks to the operator `...`.
A very simple example in C, is the call of the function *printf*, which is a variadic function, and therefore takes an arbitrary number of arguments as input.

```ymir
extern (C) printf (const format : p!char, ...); 

let i = 0, j = 12.3f;
printf ("My int is equals to %d, and my float to %f".ptr, i, j);```

## Function overloading

All functions can be overloaded, whether pure or not. During the call, the function closest to the types passed as parameter will be called.

```ymir
def foo (a : i32, b) {
// ...
}

def foo (a, b : i32) {
// ...
}

//...
foo (10, "salut"); // the first function is called
foo ("salut", 10); // the second function is called
foo (10, 10); // Error, the overload works as well with both prototypes.
```


## Parameter decorator

There are three parameter decorators to specify a behavior 
- `const`, the parameter cannot be modified whatever its type (cf.[Variables](../expressions/variables.md))
- `ref`, the parameter is passed by reference, a lvalue is required. Any modification of the variable in the called function will also modify the variable of the calling function.
- We can also consider the `lazy` decorator, which will be detailed in another section

```ymir
def foo (ref a) {
	a = 12;
}

def bar (const a : [i32]) {
	a [0] = 8; // Error the table is constant
}

let a = 1;
foo (10); // Error, 10 is not a lvalue
foo (a);
assert (a == 12);

bar ([1, 2, 3]); // Ok
```

The `const` decorator is transitive and not removable.

```ymir
def foo (a : [char]) {
	// ...
}

def bar (const a : [char]) {
    // ...
}

let a = "test"; // [const (char)];
foo (a); // Error, we lose the const
bar (a); // Ok, the const is transitive, const ([char]) is more global than [const (char)]

let b = [char ; new 10U]; // [char]
bar (b); // Okay, you can pass a non-constant element as a constant element
```

