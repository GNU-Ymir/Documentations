# Arrays and slices

## Arrays

An array is a collection of values of the same type, stored in a contiguous memory space. An array has a size and a pointer to the data. It can be represented as the following structure `{u64 size; p!T data}`, where `T` is the type of data stored by the table.

```ymir
// Compute the sum of an array of integers
def foo (a : [i32]) -> i32 {
    let sum = 0;
    for it in a {
        sum = sum + it;
    }
    return sum;
}

def main () {
    // array is [i32 ; 5U]
    let array = [1, 2, 3, 4, 5];

    // Allocate an array of i32 of size 100U
    let aux = [i32 ; new 100U]; 

    // Static table of 10 integer, in the stack
    let aux2 = [i32 ; 10U];

    println ("The first element is", array [0]);
    println ("The last element is", array [array.len - 1U]);
    println ("The sum of the array =", foo (array));
}
```

## Static and dynamic arrays

There are two types of tables in **Ymir**, static and dynamic tables. The first ones are stored in the stack, and their data are copied during each assignment.

```ymir
let a = [1, 2, 3]; // [i32 ; 3U]
let b = a;
b [0] = 9;
assert (a == [1, 2, 3]);
assert (a::sizeof == 12U);
```

Static tables can be transformed into dynamic tables using the `dup` function, which duplicate the data inside the array.

```ymir
let a = dup ([1, 2, 3]); // [i32] and allocate memory on heap
let b = a; // reference affectation
b [0] = 9;
assert (a == [9, 2, 3]);
assert (a::sizeof == 16U); // (u64, p!u64)
```

A dynamic array variable can be used as a reference to a static array.

```ymir
let a = [1, 2, 3]; // [i32] 
let b = cast!([i32]) (a); // [int] {3UL, &a} // No allocation, the memory is still on the stack
b [0] = 9;
assert (a == [9, 2, 3]);
assert (a::sizeof == 12U);
assert (b::sizeof == 16U);
```

Arrays can be constructed using the same syntax as structures: 

```ymir
let a = "Hello World !!"; // string is an alias for [const (char)]
let b = string { a.len - 6UL , a.ptr + 6UL }; // "Hello World !!"
	                                                    ^^^^^^^^
assert (b == "World !!");
```

The syntax `[type ; size]` allows you to create a table type, or to allocate a new table.

```ymir
let a = [i32 ; 5U]; // shortcut for ([i32 ; 5U])::init;
assert (a == [0, 0, 0, 0, 0]);
assert (a::sizeof == 20U);

let b = [i32 ; new 5U]; // allocate a new array on the heap
// The value are set to 0, (not init)
assert (b == [0, 0, 0, 0, 0]);
assert (b::sizeof == 16U);
```

## Slice

Slices are elements present in the language that present a different behavior from the arrays, and are used to access a section of an array:. They have a size, which cannot be modified.

```ymir
def foo (a : [i32]) -> i32 {
    let sum = 0;
    for it in a {
        sum += it;
    }
    return sum;
}

def main () {
    let a = [1, 2, 3, 4, 5];
    a [0 .. 2] = [1, 2]; // Ok
    a [0 .. 2] = [1, 2, 3]; // Assert Error, size mismatch
    a = [1, 2, 3]; // Ok

    a [0 .. 2] = a [2 .. 4];
    println (foo (a [2 .. a.len]));    
}
```

