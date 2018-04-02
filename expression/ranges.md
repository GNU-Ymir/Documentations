#Ranges
<hr>

Range is a pair of values of the same type. Range can be of integer, floating or character type.

```ymir
def main () {
    // rng is r!(i32);
    let rng = 1 .. 3; // equivalent to the interval [1, 3[

    // Range is an iterable type.
    // 
    for it in 0 .. 6 {
        print (it, ", "); // prints "1, 2, 3, 4, 5, "
    }

    // We can get the values
    println ("Range (", rng.fst, " .. ", rng.scd, ')');        
}
```