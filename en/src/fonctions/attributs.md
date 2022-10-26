# Function attributes

The functions can be configured using attributes. Attributes are defined with the `@` token. 

```ymir
// Declare a function with multiple attributes
def @{safe, inline} foo () {
	// ...
}

// Or with only one attribute
def @inline bar () {
	// ...
}
```

## Inline 

As its name indicates, the attribute `inline` will allow to inline the function. In other words, unlike a normal function call, the body of the function will be pasted into the caller's function. 

```ymir 
def @inline foo (a : i32) {
	return a + 12;
}

println (foo (10)); 
```

Will be rewritten in : 
```ymir
println (22); 
```

It is impossible to inline a recursive function, but all other functions can be inlined. The inline, unlike other C-like languages, is a mandatory directive, the compiler is obliged to inline the function.

```ymir
def @inline fibo (n : i32) {
	if n < 2 { return n; }
	else return fibo (n - 1) + fibo (n - 2); // Error
}```

## Safe

The `safe` keyword adds semantic verification to the function, specifying that it cannot perform certain dangerous operations. A `safe` function cannot crash a program.

The three operations prohibited in a safe context are:
- Calling a non-safe function
- Unsubscribe a pointer
- Allocate memory
- throw error

All other operations are allowed.

## Trusted

The `trusted` attribute makes it possible to link low-level functions to safe functions. It should not be used lightly. It defines that a nonsafe function can still be called from a safe context, because the function has been manually checked before. 

**This attribute is highly deprecated.**
