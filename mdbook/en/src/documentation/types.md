# Ymir Type

Ymir type are the value type (*cf*. [Data
types](https://gnu-ymir.github.io/Documentations/en/primitives/types.html)). They
are not always validated for many reasons (templates, aka, ...). The
**`type`** value contains the kind of type that is encoded,
**`unknown`** means that the type cannot be validated, and is always
associated with **`name`** that contains the string name of the type.

Each type contains the attribute **`mut`** set to **`true`** or
**`false`**.

## Integer

| Name | Value |
| --- | --- |
| `type` | `int` |
| `name` | `i8` V `u8` V `i32` etc... |

## Void 

| Name | Value |
| --- | --- |
| `type` | `void` |
| `name` | `void` |

## Boolean

| Name | Value |
| --- | --- |
| `type` | `bool` |
| `name` | `bool` |


## Floating

| Name | Value |
| --- | --- |
| `type` | `float` |
| `name` | `f32` V `f64` |

## Char

| Name | Value |
| --- | --- |
| `type` | `char` |
| `name` | `c8` V `c32` |

## Array 

| Name | Value |
| --- | --- |
| `type` | `array` |
| `size` | The size in a string | 
| `childs` | An array containing the inner type of the array |

## Slice

| Name | Value |
| --- | --- |
| `type` | `slice` |
| `childs` | An array containing the inner type of the slice |

## Tuple

| Name | Value |
| --- | --- |
| `type` | `tuple` |
| `childs` | An array containing the list of inner type of the tuple |

## Struct

| Name | Value |
| --- | --- |
| `type` | `struct` |
| `name` | The name of the structure |

## Enum

| Name | Value |
| --- | --- |
| `type` | `enum` |
| `name` | The name of the enum |

## Pointer

| Name | Value |
| --- | --- |
| `type` | `pointer` |
| `childs` | An array containing the inner type of the pointer |

## ClassPointer

| Name | Value |
| --- | --- |
| `type` | `class_pointer` |
| `childs` | An array containing the inner type of the pointer |

## Range

| Name | Value |
| --- | --- |
| `type` | `range` |
| `childs` | An array containing the inner type of the range |

## Function pointer

| Name | Value |
| --- | --- |
| `type` | `fn_pointer` |
| `childs` | An array containing the parameter types of the function pointer |
| `ret_type` | The return type of the function pointer |

## Closure

**Warning** the closure here is the element contained inside a delegate, not the delegate type

| Name | Value |
| --- | --- |
| `type` | `closure` |
| `childs` | An array containing the inner types of the closure |


## Delegate

| Name | Value |
| --- | --- |
| `type` | `dg_pointer` |
| `childs` | An array containing the parameter types of the delegate pointer |
| `ret_type` | The return type of the function pointer |

## Option 

| Name | Value |
| --- | --- |
| `type` | `option` |
| `childs` | An array containing the inner type of the option |


## Unknown

| Name | Value |
| --- | --- |
| `type` | `unknown` |
| `name` | The string name of the type |


