# Template type constraints


Type constraints are used to verify that a type passed in
as long as the template parameter respects the defined constraints, in order to
specialize treatments. For example, define a function
applicable to any type of table.

## Of constraint

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
 
 
 
 


