# Ranges

The range type is a pair of values of the same type. These types can be either integer, floating or character type.

```ymir
def main () {
    // rng is r!(i32);
    let rng = 1 .. 3; // equivalent to the interval[1, 3[

    // Range is an iterable type 
    // 
    for it in 0 .. 6 {
        print (it, ", "); // affiche "1, 2, 3, 4, 5, "
    }

    // The values of the interval can be retrieved
    println ("Range (", rng.fst, " .. ", rng.scd, ')');        
}
```

## Different range types

There are two types of operators to build a range, the operator `...` which means that the second value of the range is not included in the interval, and the operator `...`, which on the contrary allows him to include the second value in the interval.


```ymir
for i in 0 .. 5 {
	print (i, " "); 
} // 0 1 2 3 4

for i in 0 ... 5 {
	print (i, " ");
} // 0 1 2 3 4 5```

## Step 

The step attribute of a range allows to modify the step of a range, and thus to iterate differently, for example only on the even number.

```ymir
let range = 0 .. 7; 
range.step = 2;
for i in range {
	print (i, " "); // 0 2 4 6
}

// The step_by function allows you to do the same operation in a single line
for i in (0 .. 7).step_by (2) {
	print (i, " "); // 0 2 4 6
}
```

## Decreasing interval 

It is entirely possible to write a decreasing range.

```ymir
for i in 4 ... 0 {
	print (i, ' '); // 4 3 2 1 0
}
```

## Cte range

A range can be used as a compilation expression for cte `for` loops, if the elements that compose it are known at compilation.

```ymir
cte for i in 0 .. 100 {
	// ... 
} // Okay, the loop will be executed at compile time
```
