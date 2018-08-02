# Variables

Comme dans beaucoup de langage **Ymir** permet de stocker des données dans des variables. Il y a différent type de variables, avec différent type de durée de vie.

## Variables locales

Le mot clé `let` vous donne la possibilité de crée une nouvelle variable. Une variable existe pendant la durée d'un scope, qui est une portion de code dans laquelle la variable est accessible.

```ymir
let a = 12;
let b = 34;
{ // Ouvre un nouveau scope
    let c = a * b;
} 

println (c); // Illegale, c n'existe plus dans ce scope
```

### Variable de compilation

`cte` \(**C**ompile **T**ime **E**xecution\) variables sont des variables dont la valeur est connu à la compilation. Vous pouvez changer leurs valeurs si la nouvelle valeur est également connu à la compilation. Le mot clé `cte` vous permet de déclarer des variables connu à la compilation.

```ymir
let cte a = 12;
a = 45; // Ok
a = some_runtime_function (); // Illegal
```

### Const

Le mot clé `const` permet de rendre la variable immutable et d'empêcher sa modification.

```ymir
let const a = some_function_returning_i32 ();
a = 45; // Illegal
```

L'information `const` est transitive, par exemple pour un pointeur constant on ne peut ni changer la valeur du pointeur ni la valeur des éléments pointés.

```ymir
let array = some_function_returing_array () // [ [char] ];
array [0][1] = 'r'; // ok

let const array_b = array;
array_b [0][0] = 'r'; // Illegal
```

