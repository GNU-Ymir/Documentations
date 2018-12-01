# Template type constraints


Type constraints are used to verify that a type passed in
as long as the template parameter respects the defined constraints, in order to
specialize treatments. For example, define a function
applicable to any type of table.

## Type deduction 

The deduction of template types is done according to several rules:

**1.** The types of template parameters are established by the template arguments at the same positions: : 

```ymir
mod Mod (T, U) {}

Mod!(i32, f64); // T is i32, U is f64
```

**2.** If the template parameter is a specialization, it sets the type of all the template parameters on which it depends:

```ymir
mod Mod (T of [U], U) {}
	
Mod!([i32]); // T is [i32], U is i32
Mod!([i32], i32); // Ok, no conflict
```

**3.** If after that there are still some template parameters that are not defined: 

- In the case of a function, the template parameters are deduced from the runtime parameters
	
```ymir
def foo (T, U) (a : U) {
}
		
foo!i32 ('r'); // T is i32, U is char
```

- In all other cases, specialization does not work

If the previous rules do not allow the types to be deduced for all the template parameters, the specialization does not work.

## Of constraint

The keyword `of` defines that the type given in the left operand must be of the same form as the expression given in the right operand. 

```ymir
// This function take an array of any type in parameters
def foo (T of [U], U) (a : T) {
	// ...
}

foo ([1, 2, 3]); // T is deduced to [i32], and U to i32
foo (["1", "2", "3"]); // T is deduced to [string], and U to string
```


The `of` constraint can be used on any type, and can deconstruct at any level.


```ymir
struct (T) 
| a : T
 -> MySt;

// This is not really a template function, as it will only work for MySt!(MySt!([i32]))
 def foo (T of MySt!(U), U of [V], V of i32) (a : MySt!T) {
	// ...
 }
 
 let a = MySt!(MySt!([i32]))::init;
 foo (a); 
 ```
 
 
## Overloading

When several template elements are defined, the one with the best specialization will be used. The more precise the specializations are, the higher the score of this specialization will be. The element with the highest score will be the one used.

```ymir
def foo (T) (a : T) {
	println ("scalar");
}

def foo (T of [U], U) (a : T) {
	println ("array");
}

def foo (T of [U], U of i32) (a : T) {
	println ("array of int");
}

foo (10); // scalar
foo ([1, 2, 3].dup ()); // array of int
foo (['r', 't', 'y'].dup ()); // array
```

Specialization using the keyword `of` generates a higher score than specialization by a specific type. For example:

```ymir
def foo (T of [i32]) () {
	println ("First");
}

def foo (T of [U], U of i32) () {
	println ("Second");
}

foo!([i32]) (); // Second
```


