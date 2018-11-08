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

