# Literals

## Boolean literals

The two literals that form a `bool` are `true` and `false`.

## Digital Literals

Whole literals can be used to create signed or unsigned integers or floating numbers. In any case, **Ymir** will deduce the type of literals according to their suffixes.

Suffixes for signed and unsigned integers are:

| Suffix | Size | Type |
| --- | --- | --- |
| `B`, `UB` | 8-bits | `i8`, `u8` |
| `S`, `US` | 16-bits | `i16`, `u16` |
| `U` | 32-bits | `u32` |
| `L`, `UL` | 64-bits | `i64`, `u64` |

If the literal does not have a suffix, it will be considered to be of the type `i32`. The `_` token can be used to improve the readability of literals in the case of large numbers.

```ymir
let a = 45; // i32
let b = 45UL; // u64
let c = 34B; // i8
let d = 10_000S; // i16
let f = 0x10B; // i8, with the value 16
```

For floating number literals, there is only one suffix `f`. This forces the literal type to be `f32`, instead of `f64` when there is no suffix.

```ymir
let a = 3.; // f64, 3.0
let b = .2; // f64, 0.2
let c = .2f; // f32, 0.2f
```

## Character literals

The literals forming characters are surrounded by quotes `'`'. These literals are inferred with the `char` type, which has a size of `8 bits` and is unsigned.

```ymir
let a = 'A'; 
let b = '\0x41'; // 65
assert (a == b);

let c = '\n';
```

The following characters are the escape characters available in the **Ymir** language.

* `\0x00\` .. `\0xFF`, hexadecimal notation from `0` to `255`.
* `\a`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`, `\\`, `\'`, `\"`, `\?`, `\0`

## String literals

The literals forming strings of characters are surrounded by `"`. They can contain any type of byte and character sequence.

The macro `q: {}` can also be used to form a string on several lines.

```ymir
let a = "Hi there !!";
let b = q: { 
    It is a marco to form a character string of several lines
    This allows you to force the text editor to keep the syntax highlighting

    void some_c_function () {
        int a = 12;
        printf ("%d\n", a);
    }
};
```

## Table literals

In **Ymir**, there are two types of primitive tables: the **dynamic** and the **static** tables. Static tables have a size known at compile time, which cannot be modified. Thanks to the literals, it is possible to form static tables.

```ymir
let tableau_un = [1, 2, 3]; // [i32; 3UL]
let tableau_deux = ["hi", "is", "this", "working", "?"]; // [string ; 5UL];
```

The string type is an alias of the array type of constant character: `[const (char)]`.

## The block literals

A block is an instruction sequence, which can be used as an expression.


```ymir
let a = {
   println ("some intructions ...");
   12;
}; // a will be equal to 12
```

The last expression of the block is used as the value of the block.

