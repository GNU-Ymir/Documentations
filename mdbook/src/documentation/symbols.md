# Symbols

Each element contains standard information : 

| Name | Value |
| --- | --- |
| `type` | The type of the symbol (`module`, `function`, etc..) |
| `name` | The name of the symbol |
| `loc_file` | The name of the file containing the symbol |
| `loc_line` | The number of the line at which the symbol is declared |
| `loc_column` | The number of the column at which the symbol is declared |
| `doc` | The documentation associated with the symbol (user comments) |
| `protection` | The protection of the symbol (`pub` V `prot` V `prv`) | 

## Module 

| Name | Value |
| --- | --- |
| `type` | `module` |
| `childs` | The symbols declared inside the module |

## Function 

| Name | Value |
| --- | --- |
| `type` | `function` |
| `attributes` | The custom attributes of the function |
| `params` | The list of parameters of the function |
| `ret_type` | The return type of the function | 
| `throwers` | The list of type that can be thrown by the function |

The parameters are defined according to the following table : 

| Name | Value |
| --- | --- |
| `name` | The name of the parameter |
| `type` | The type of the parameter (ymir type) |
| `mut` | `true` V `false` |
| `ref` | `true` V `false` |
| `value` | Can be unset if the variable has no value, encoded in a string |


## Variable declaration 

Declaration of a static global variable.

| Name | Value |
| --- | --- | 
| `type` | `var` |
| `mut` | `true` V `false` |
| `var_type` | The ymir type of the variable |
| `value` | Can be unset if the variable has no value, encoded in a string |

## Aka 

| Name | Value |
| --- | --- |
| `type` | `aka` |
| `value` | The value of the aka, encoded in a string |

The value of the aka is encoded in a string, because as **`aka`** are
only evaluated when used, we can't have more information on them.

## Structure 

| Name | Value |
| --- | --- |
| `type` | `struct` |
| `attributes` | `union`, `packed` |
| `fields` | The list of fields of the structure |

### Fields

| Name | Value |
| --- | --- |
| `name` | The name of the field |
| `type` | The ymir type of the field |
| `mut` | `true` V `false` |
| `doc` | The user documentation about the field |
| `value` | Set if the field has a default value, encoded in a string |

## Enumeration 

| Name | Value |
| --- | --- |
| `type` | `enum` |
| `en_type` | The ymir type of the enumeration fields |
| `fields` | The fields of the enum |

### Fields 

| Name | Value |
| --- | --- |
| `name` | The name of the field |
| `doc` | The user comments about the field |
| `value` | The value associated with the field, in a string |

## Class 

| Name | Value |
| --- | --- |
| `type` | `class` |
| `ancestor` | Set if the class has an ancestor, ymir type |
| `abstract` | `true` V `false` |
| `final` | `true` V `false` |
| `fields` | The fields of the class | 
| `asserts` | The list of static assertion inside the class |
| `cstrs` | The list of constructor of the class |
| `impls` | The list of implementation of the class |
| `methods` | The list of methods of the class |

### Fields 

| Name | Value |
| --- | --- |
| `name` | The name of the field |
| `type` | The ymir type of the field |
| `mut` | `true` V `false` |
| `doc` | The user comments about the field |
| `protection` | `prv` V `prot` V `pub` |
| `value` | Set if the field has a default value, inside a string |

### Asserts

| Name | Value |
| --- | --- |
| `test` | The condition in a string |
| `msg` | The msg of the assert |
| `doc` | The user comment about the assertion |

### Constructors

| Name | Value |
| --- | --- |
| `type` | `cstr` |
| `params` | The list of parameters of the constructor, identical to those of a function |
| `throws` | The list of ymir types thrown by the constructor |

### Implementations

| Name | Value |
| --- | --- |
| `type` | `impl` |
| `trait` | The name of the trait, in a string |
| `childs` | The list of overriden methods, identical to methods |

### Methods

| Name | Value |
| --- | --- |
| `type` | `method` |
| `over` | `true` V `false` |
| `params` | The list of parameters of the method, identical to function |
| `ret_type` | The ymir type of the return type | 
| `attributes` | `virtual`, `final`, `mut` |
| `throwers` | The list of types thrown by the method |

A virtual method is method with no body, and a mutable method is a
method that accepts only a mutable object.


## Traits

| Name | Value |
| --- | --- |
| `type` | `trait` |
| `childs` | The list of method inside the trait |

## Templates

| Name | Value |
| --- | --- |
| `type` | `template` |
| `test` | Set if the template has a test, in a string |
| `params` | The list of parameter of the template, in strings | 
| `childs` | The list of symbol inside the template |

## Macros

| Name | Value |
| --- | --- |
| `type` | `macro` |
| `cstrs` | The list of constructor of the macro |
| `rules` | The list of rules of the macro |

### Constructors and Rules

| Name | Value |
| --- | --- |
| `rule` | The rule of the macro in a string |
| `skips` | The list of token skiped, list of string |

