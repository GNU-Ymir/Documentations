# Literaux

## literaux booléens

Les deux literaux qui permettent de former un `bool` sont `true` et `false`.

## Literaux numérique

Les literaux entiers peuvent être utilisés pour créer des entiers signés ou non-signés, ou encore des nombre flottants. Dans tout les cas, **Ymir** va déduire le type des literaux en fonction de leurs suffixe.

Les suffixes pour les entiers signés et non-signés sont :

| Suffix | Size | Type |
| --- | --- | --- |
| `B`, `UB` | 8-bits | `i8`, `u8` |
| `S`, `US` | 16-bits | `i16`, `u16` |
| `U` | 32-bits | `u32` |
| `L`, `UL` | 64-bits | `i64`, `u64` |

Si le literal n'a pas de suffixe, il sera considéré comme étant du type `i32`. Le jeton `_` peut être utilisé pour améliorer la lisibilité des literaux dans le cas de grand nombre.

```ymir
let a = 45; // i32
let b = 45UL; // u64
let c = 34B; // i8
let d = 10_000S; // i16
let f = 0x10B; // i8, with the value 16
```

Pour les literaux de nombre flottant, il n'y a qu'un seul suffixe `f`. Celui-ci force le type du literal a ếtre `f32`, au lieu de `f64` lorsqu'il n'y a pas de suffixe.

```ymir
let a = 3.; // f64, 3.0
let b = .2; // f64, 0.2
let c = .2f; // f32, 0.2f
```

## Character literals

Les literaux formant des caractères sont entouré de apostrophe `'`. Ces literaux sont inféré avec le type char, qui a une taille de `8 bits` est est non signé.

```ymir
let a = 'A'; 
let b = '\0x41'; // 65
assert (a == b);

let c = '\n';
```

Les caractères suivant sont les caractère d'échappement disponnible dans le langage **Ymir**.

* `\0x00\` .. `\0xFF`, hexadecimal notation from `0` to `255`.
* `\a`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`, `\\`, `\'`, `\"`, `\?`, `\0`

## String literals

Les literaux formant des chaines de caractères sont entourés de `"`. Il peuvent contenir n'importe quel type d'octet et de séquence de caractère.

On peut également utiliser `q: {}` pour former un chaine de caractère sur plusieurs ligne.

```ymir
let a = "Hi there !!";
let b = q: { 
    C'est une marco pour former une chaine de caractère de plusieurs ligne
    Ceci permet de forcer l'éditeur de ymire à garder la coloration syntaxique

    void some_c_function () {
        int a = 12;
        printf ("%d\n", a);
    }
};
```

## Literaux de tableau

En **Ymir**, il y a deux types de tableau primitif les tableau **dynamique** et les tableau **statique**. Les tableaux statiques possèdent une taille connu à la compilation, et qui ne peut pas être modifié. Grâçe aux literaux, il est possible de former des tableaux statiques.

```ymir
let tableau_un = [1, 2, 3]; // [i32; 3UL]
let tableau_deux = ["hi", "is", "this", "working", "?"]; // [string ; 5UL];
```

Le type string est un alias du type tableau de caractère constant : `[const (char)]`.

## Les literaux de bloc

Un bloc est une séquence d'instruction, qui peut être utilisé comme une expression.

```ymir
let a = {
   println ("some intructions ...");
   12;
}; // a va être égale à 12
```

La dernière expression du bloc est utilisé comme la valeur du bloc.

