#Interfacing to C
<hr>

 It would be sensless, to ignore the vast array of C API's available, that's why Ymir is designed to fit perfectly with C language.

## Calling C function

The ```extern (C)``` keyword allows you to declare extern C function.
```ymir
extern (C) pow (base : double, exponent : double) -> double;

def main() {
    println ("7 ^ 3 = ", pow (7.0, 3.0));
}
```
Ymir knows how C function names are mangled, and the correct C calling convention.

## Passing Ymir array to C function

In C, arrays are passed to functions as pointer, even if the function says it's an array. In Ymir arrays with an imutable size are passed by value, when in C they are passed by reference. Thus the function prototype must be changed to match with C expectations.

Ymir and C function prototype equivalence :

| # | Ymir Type | C Type |
| --- | --- | --- |
| 1. | p!T | T[] |
| 2. | ref [T ; dim] | T[dim] |

## Structs And Unions

Ymir structs and unions are analog to C ones.

## Accessing C globals

C globals have the C naming convention, so they must be declared as ```extern (C)```.
```ymir
/*
 * C file : 
 * int x;
 *
 */
extern (C) x : int;
```
