#Variables

Like many language **Ymir** allows you to store data in
variables. There are few differents kind of variables with different
lifetime. 

## Local variables

The keyword `let` give you the possibility to create a new variable. A
variable exist in a scope, which is the block of codes where the
variable can be accessed. 

```ymir
let a = 12;
let b = 34;
{ // Open a new scope
	let c = a * b;
} 

println (c); // Illegal, c doesn't exist anymore
```

### Const and Immutable

Immutable variables have a value known at compile time. You can't
change their values. The keyword `imut` allows you to declare some
immutable variables.

```ymir
let imut a = 12;
a = 45; // Illegal
```

The `const` keyword denotes that a variable can't change value, but it
can be unknown at compile time. 

```ymir
let const a = some_function_returning_i32 ();
a = 45; // Illegal
```

`const` information is transitive, for example a const array can't
change its size, and its internal values.

```ymir
let array = some_function_returing_array () // [ [char] ];
array [0][1] = 'r'; // ok

let const array_b = array;
array_b [0][0] = 'r'; // Illegal
```
