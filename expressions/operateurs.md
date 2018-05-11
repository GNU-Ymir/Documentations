# Operateurs

La priorité des operateurs est similaire aux autres langages proche du C.

```text
let a = 1 + 3 * 4;
assert (a == 13);
```

## Promotion de type

Les operations sur les types primitifs sont autorisées par le langage **Ymir** seulement si elles ne générent pas de perte de précision. Ceci s'appelle promotion de types, et se définis par : Un type _x_ peut être transformé en type _y_ si et seulement si la taille du type _x_ est plus petite que la taille de _y_ et _x_ et _y_ sont de même nature. C'est à dire que _x_ et _y_ sont tout les deux non signés, ou tout les deux signés, ou encore qu'il sont tout les deux de type flottants.

```text
let a = 12; // i32
let b = 12B; // i8
b = a; // Illegal
a = b; // Ok

let c = 34UB; // u8
b = c; // Illegal
a = c; // Illegal
```

