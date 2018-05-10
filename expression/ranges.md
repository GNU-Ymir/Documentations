#Ranges
<hr>

Le type range est une paire de valeurs du même type. Ces types peuvent être soit entier, flottant ou de type char.

```ymir
def main () {
    // rng is r!(i32);
    let rng = 1 .. 3; // equivalent à l'interval [1, 3[

    // Range est un type iterable
    // 
    for it in 0 .. 6 {
        print (it, ", "); // affiche "1, 2, 3, 4, 5, "
    }

    // On peut récuperer les valeurs de l'intervalle
    println ("Range (", rng.fst, " .. ", rng.scd, ')');        
}
```