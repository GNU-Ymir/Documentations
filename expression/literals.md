# Literaux
<hr>

## literaux booléens 

Les deux literaux qui permettent de former un `bool` sont `true` et `false`.

## Literaux numérique 

Les literaux entiers peuvent être utilisés pour créer des entiers signés ou non-signés, ou encore des nombre flottants.
Dans tout les cas, **Ymir** va déduire le type des literaux en fonction de leurs suffixe. 

Les suffixes pour les entiers signés et non-signés sont :

| Suffix | Size | Type |
| --- | --- | --- |
| `B`, `UB` | 8-bits | `i8`, `u8` |
| `S`, `US` | 16-bits | `i16`, `u16` |
| `U` | 32-bits | `u32` |
| `L`, `UL` | 64-bits | `i64`, `u64` |

Si le literal n'a pas de suffixe, il sera considéré comme étant du type `i32`. 
Le jeton `_` peut être utilisé pour améliorer la lisibilité des literaux dans le cas de grand nombre.

```ymir
let a = 45; // i32
let b = 45UL; // u64
let c = 34B; // i8
let d = 10_000S; // i16
let f = 0x10B; // i8, with the value 16
```

Pour les literaux de nombre flottant, il n'y a qu'un seul suffixe `f`. Celui-ci force le type du literal a ếtre `f32`, au lieu de `f64` lorsqu'il n'y a pas de suffixe.


```ymir
let a = 3.; // f64, 3.0
let b = .2; // f64, 0.2
let c = .2f; // f32, 0.2f
```

## Character literals

Character literals are enclosed with single quote `'`.  The character  
literals are infered to type `char`, which have a size of `8-bits` and  
is unsigned.

```ymir
let a = 'A'; 
let b = '\0x41'; // 65
assert (a == b);

let c = '\n';
```

The following escape characters are supported

* `\0x00\` .. `\0xFF`, hexadecimal notation from `0` to `255`.
* `\a`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`, `\\`, `\'`, `\"`, `\?`, `\0`

## String literals

String literals are enclosed with double quotes `"`. They can contains  
any kind of bytes and escape sequences.

```ymir
let a = "Hi there !!";
let b = q: { 
    This is a macro to get a multiple line string
    It will force the text editor to keep the syntax highlighting

    it can be usefull to express some external language 

    void some_c_function () {
        int a = 12;
        printf ("%d\n", a);
    }
};
```

## Array literals

In **Ymir**, there two types of array _dynamic_ and _static_ ones.  
The static ones have an immutable size, which is known at compile time.  
Array literals allows to express this types of arrays.

```ymir
let my_first_array = [1, 2, 3]; // [i32; 3]
let my_second_array = ["hi", "is", "this", "working", "?"]; // [const (string); 5];
```

The type string is an alias to the array of char type `[char]`.

## Block literals

A block is sequence of instruction, and it can be used as an expression.

```ymir
let a = {
   println ("some intructions ...");
   12;
}; // a will be equal to 12
```

The last expression of a block is used as its value.

