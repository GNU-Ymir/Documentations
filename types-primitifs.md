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

Each integer type has type attributs, which are accessible using the operator `::`, from a type directly or using an expression.

```ymir

let a = i32::init;  // i32 (0)
let b = (10)::init; // i32 (0)
```

The following table lists the integer attributs :

| Name | Meaning |
| --- | --- |
| `init` | The initial value (0) |
| `max` | The maximal value |
| `min` | The minimal value |
| `sizeof` | A `u32`, containing the size of the type in bytes |
| `typeid` | The name of the type, encoded in a `string` |

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
| `sizeof` | The size of the type encoded in a `u32`| 
| `typeid` | The name of the type encoded in a `string` |

### Boolean type 

A Boolean is a very simple type that can take two values, either `true` or `false`.
The `bool` type also has attributes of type : 

| Name | Meaning |
| --- | --- |
| `init` | The initialization value - `false` | 
| `sizeof` | An `u8` containing the size of the type in bytes - `1`. | 
| `typeid` | A string containing the name of the type |

### Character type 

The `char` type is the type used to encode an ascii character. 
This type has the same type attributes as the `bool` type: 

| Name | Meaning |
| --- | --- |
| `init` | The initialization value - `\0` | 
| `sizeof` | An `u8` containing the size of the type in bytes - `1`. | 
| `typeid` | A string containing the name of the type | 

## Compound types 

The **Ymir** language also has compound types, or otherwise called `tuple`. A tuple is a collection of different types of value, and is noted in brackets, for example : 
 - (char, i32), is a tuple composed of a `char` and an `i32`.
 
As with all types of **Ymir**, tuples have attributes of types : 
 
| Name | Meaning |
| --- | --- |
| `init` | A tuple initialized with initial values of the types composing it |
| `arity` | A `u32` containing the number of types that make up the tuple | 
| `sizeof` | The size in memory of the tuple, the data alignment of the tuple is dependent on the architecture | 
| `typeid` | The name of the type encoded in a `string` type element |

## String type 

The `string` type allows to encode a sequence of characters and is a
syntactic simplification of the array type `[const char]`. He owns
therefore the same type attributes as an array but
also the same value attributes.

The value attributes are accessible through the operator `.`, on a typed expression.

```ymir
let a = "hi !!";
println (a.len, " ", a); // 5 hi !!
```

The `string` type has two value attributes like all table types: 

| Name | Meaning |
| --- | --- |
| `len` | The size of the array (number of elements) encoded in a `u64` |
| `ptr` | The pointer to the first element of the array |

## Other types

All types of **Ymir**, whether primitive or not, have the attributes of types `init`, `sizeof` and `typeid`.

