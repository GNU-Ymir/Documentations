# Primitives types

In **Ymir** language everything is typed. In this part, different
types that are directly integrated into the language are summed up.

## Scalar types

Scalar types represents all the types having only one value. They can have different size for different purposes. 

### Integer types

An integer is a number whithout decimal part. There are differents
integer types in **Ymir**, the signed one, and the unsigned
one. Signed and unsigned refers to the possibilty of a number to be
negative. The following table lists all the different integer types,
and sort them by memory size.

| Size | Type | Possible Values |
| --- | --- | --- |
| 8-bits | `i8` | `-128 .. 127` |
| 8-bits | `u8` | `0 .. 255` |
| 16-bits | `i16` | `-32768 .. 32767` |
| 16-bits | `u16` | `0 .. 65535` |
| 32-bits | `i32` | `-2147483648 .. 2147483647` |
| 32-bits | `u32` | `0 .. 4294967295` |
| 64-bits | `i64` | `-9223372036854775808 .. 9223372036854775807` |
| 64-bits | `u64` | `0 .. 18446744073709551615` |

The type `usize` and `isize` are types that are architecture dependent, and have the size of a pointer.

Each integer type has type attributs, which are accessible using the operator `::`, on a type.


```ymir
let a = i32::init;  // i32 (0)
```

The following table lists the integer attributs :

| Name | Meaning |
| --- | --- |
| `init` | The initial value (0) |
| `max` | The maximal value |
| `min` | The minimal value |
| `typeid` | The name of the type, encoded in a `[c32]` |

### Floating-point types

The floating point types, refers to the number having a decimal
part. **Ymir** offers two floating point types, `f32` and `f64`, that
have a respective size of `32` bits and `64` bits.

As for integer types, floating point types have type attributs : 

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `0.0` | 
| `max` | The maximal finite value that this type can encode| 
| `min` | The minimal finite value that this type can encode| 
| `nan` | The value __Not a Number__ |
| `dig` | The number of decimal digit of precision | 
| `infinity` | The value positive infinity | 
| `epsilon` | The smallest increment to the value `1` |
| `mant_dig` | Number of bits in the  __mantissa__ |
| `max_10_exp` | 	maximum int value such that $$10^{max\_10\_exp}$$ is representable |
| `max_exp` | maximum int value such that $$2^{max\_exp-1}$$ is representable| 
| `min_10_exp` | minimum int value such that $$10^{min\_10\_exp}$$ is representable as a normalized value| 
| `min_exp` | minimum int value such that $$2^{min\_exp-1}$$ is representable as a normalized value| 
| `typeid` | The name of the type encoded in a `string` |

### Boolean type 

A Boolean is a very simple type that can take two values, either `true` or `false`.
The `bool` type also has attributes of type : 

| Name | Meaning |
| --- | --- |
| `init` | The initialization value - `false` | 
| `typeid` | A string containing the name of the type |

### Character type 

The `c8` and `c32` are the types used to encode characters. 

| Name | Meaning |
| --- | --- |
| `init` | The initialization value - `\u{0}` | 
| `typeid` | A string containing the name of the type | 

