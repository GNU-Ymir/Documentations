# Tableaux et slices

## Arrays

Un tableau est une collection de valeurs du même type, stockés dans un espace mémoire contigu. Un tableau possède une taille ainsi qu'un pointeur vers les données. Il peut être représenté comme étant la structure suivante `{u64 size; p!T data}`, où `T` est le type des données stocké par le tableau.

```ymir
// Calcule la sum d'un tableau d'entier
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

    // Tableau statique de 10 entier, dans la pile
    let aux2 = [i32 ; 10U];

    println ("Le premier élément est ", array [0]);
    println ("Le dernier élément est ", array [array.len - 1U]);
    println ("La somme du tableau = ", foo (array));
}
```

## Slice

Les slices sont des éléments présent dans le langage qui présente un comportement différents des tableaux, et qui servent à accéder à une section d'un tableau. Il ont une taille, qui ne peut pas être modifié.

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

