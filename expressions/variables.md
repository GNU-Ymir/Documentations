# Variables

As in many languages **Ymir** allows to store data in variables. There are different types of variables, with different types of lifetime.

## Local variables

The keyword `let` gives you the possibility to create a new variable. A variable exists during the duration of a scope, which is a portion of code in which the variable is accessible.

```ymir
let a = 12;
let b = 34;
{ // open a new scope
    let c = a * b;
} 

println (c); // Illegal, c no longer exists in this scope```

### Compilation variable

`cte` \(**C**compile **T**ime **E**xecution\) variables are variables whose value is known at compilation. You can change their values if the new value is also known at compile time. The `cte' keyword allows you to declare variables known at compile time.

```ymir
let cte a = 12;
a = 45; // Ok
a = some_runtime_function (); // Illegal
```

### Const

The keyword `const` makes it possible to make the variable immutable and prevent its modification.

```ymir
let const a = some_function_returning_i32 ();
a = 45; // Illegal
```

The `const` information is transitive, for example for a constant pointer you can neither change the value of the pointer nor the value of the pointed elements.

```ymir
let array = some_function_returing_array () // [ [char] ];
array [0][1] = 'r'; // ok

let const array_b = array;
array_b [0][0] = 'r'; // Illegal
```

