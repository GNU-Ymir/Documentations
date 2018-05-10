# Operateurs
<hr>

La priorité des operateurs est similaire aux autres langages proche du C.

```ymir
let a = 1 + 3 * 4;
assert (a == 13);
```

## Promotion de type

Les operations sur les types primitifs sont autorisées par le langage
**Ymir** seulement si elles ne générent pas de perte de précision.
Ceci s'appelle promotion de types, et se définis par : Un type *x*
peut être transformé en type *y* si et seulement si la taille du type
*x* est plus petite que la taille de *y* et *x* et *y* sont de même
nature. C'est à dire que *x* et *y* sont tout les deux non signés, ou
tout les deux signés, ou encore qu'il sont tout les deux de type
flottants.

```ymir
let a = 12; // i32
let b = 12B; // i8
b = a; // Illegal
a = b; // Ok

let c = 34UB; // u8
b = c; // Illegal
a = c; // Illegal
```

