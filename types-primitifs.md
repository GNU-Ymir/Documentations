# Types primitifs

En **Ymir** toutes les valeurs ont un type, celui ci va servir à définir le comportement que le compilateur doit adopter et comment la valeur va être utiliser pour les différents calculs. Dans cette partie nous présentons les différents types qui font partie intégrente du langage.

## Les types scalaires

Les types scalaires représente tous les types qui ne dispose que d'une seule valeur. Il peuvent faire différentes tailles en fonction de leurs besoins.

### Types entier

Un entier est un nombre qui ne possède pas de partie décimal. Il y a différent types d'entier en **Ymir** les signés et les non-signés. Signés et non-signés se rapporte à la possibilité d'un nombre d'être négatif. Le tableau suivant liste les différents types entiers présent en **Ymir**, et les classe en fonction de leur taille en mémoire.

| Taille | Type | Valeurs possible |
| --- | --- | --- |
| 8-bits | `i8` | `-128 .. 127` |
| 8-bits | `u8` | `0 .. 255` |
| 16-bits | `i16` | `-32768 .. 32767` |
| 16-bits | `u16` | `0 .. 65535` |
| 32-bits | `i32` | `-2147483648 .. 2147483647` |
| 32-bits | `u32` | `0 .. 4294967295` |
| 64-bits | `i64` | `-9223372036854775808 .. 9223372036854775807` |
| 64-bits | `u64` | `0 .. 18446744073709551615` |

### Floating-point types

Floating-Point numbers are numbers with a decimal points. **Ymir** has two types for floating-point numbers, `f32` and `f64`. The default type is `f64`.

### Boolean types

A boolean type has two possible value, `true` or `false`. The type is specified by the name `bool`.

### Character types

// TODO

## Compound types

