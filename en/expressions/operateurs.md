# Operators

The operators as in any language refers to the symbols used to perform operation between values.
The precedence of the operators is defined in the table below.

```ymir
let a = 1 + 3 * 4;
assert (a == 13);
```

## Type promotion

Operations on primitive types are allowed by the **Ymir** language
only if they do not generate a loss of accuracy. This is called type
promotion, and is defined by: A type _x_ can be transformed into type
_y_ if and only if the size of the type _x_ is smaller than the size
of _y_ and _x_ and _y_ are of the same nature. That is, _x_ and _y_
are both unsigned, or both signed, or both are floating.

```ymir
let a = 12; // i32
let b = 12B; // i8
b = a; // Illegal
a = b; // Ok

let c = 34UB; // u8
b = c; // Illegal
a = c; // Illegal
```

## Special type promotion


It is possible to override promotions of types that can be
sometimes annoying to do some calculations. For this purpose, there are
two ways. The first one is quite classic, it is the cast of the type
. An example is shown below, but the cast is explained more in
detail in this section [Type cast](expressions/cast.md).

```ymir
let a = 12; // i32
let b = 12B; // i8
b = cast!i8 (a); // Ok

let c = 34UB;
b = cast!i8 (c); // Ok
a = cast!i32 (c); // Ok
```

The cast can sometimes be a little too verbose, which is why **Ymir**
also offers an automatic cast system for types from a typed
operation. To do this, it is possible to type an operator in order to
define which type of operation you want to perform.

```ymir
let a = 12;
let b = 12B;

let c = a + b; // Illegal
let d = a +:i32 b; // Okay, an i32 operation will be applied

// This operation will be rewritten by the compiler into
// let d = cast!i32 (a) + cast!i32 (b); 
```

## Operator precedence 

| priority | description | operators |
| --- | --- | --- |
| 1 | Assignement operators | `/=` `&=` `&vert;=` `-=` `+=` `<<=` `>>=` `=` `*=` `%=` `^=` `^^=` `~=` |
| 2 | Logical or | `&#x7c;&#x7c;` | 
| 3 | Logical and | `&&` | 
| 4 | Test operators | `<` `>` `<=` `>=` `!=` `!<` `!<=` `!>` `!>=` `==` `is` `!is` `of` `!of` |
| 5 | Range operators | `..` `...` | 
| 5 | bit shift operators | `<<` `>>` |
| 6 | bitwise operation | `&vert;` `^` `&` |
| 6 | Additive operators | `+` `~` `-` |
| 7 | Multiplicatives operators | `*` `/` `%` |
| 8 | Unary operators | `++` `--` `!` `-` `&` `*` |
| 9 | Postfix operators | `(` `.` `[` |


