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

Chacun des types entiers possèdent des attributs de types accéssible via l'operateur `::`, à partir du type ou d'un expression.

```ymir

let a = i32::init;  // i32 (0)
let b = (10)::init; // i32 (0)
```

Le tableaux suivant liste les attributs disponible : 

| Nom | valeur |
| --- | --- |
| `init` | La valeur d'initialisation du type (0) |
| `max` | La valeur maximale possible |
| `min` | La valeur minimale possible |
| `sizeof` | Un `u8` contenant la taille du type en octet |
| `typeid` | Le nom du type encodé dans un élément de type `string` |

### Floating-point types

Les nombre flottants sont les nombres possédants une partie décimal. **Ymir** propose deux type différents permettant de représenter les nombres flottants, `f32` et `f64`. 
Ces deux types sont respectivement de 32 bits et de 64 bits, ils sont similaire au type `float` et `double` du langage C.

Comme pour les types entiers, les types flottants possèdent des attributs de types : 

| Nom | Signification | 
| --- | --- |
| `init` | La valeur initial - `0` | 
| `max` | La valeur maximale finie que peut prendre le type | 
| `min` | La valeur minimale finie que peut prendre le type | 
| `nan` | Le nombre __Not a Number__ |
| `dig` | Nombre de decimal qui peuvent être arrondis dans un nombre flottant sans changer le nombre de chiffre de la partie décimale | 
| `infinity` | La valeur infinie positive | 
| `epsilon` | La différence entre `1` et la plus petite valeur représentable supérieur à `1` |
| `mant_dig` | Le nombre de chiffre qui composent la __mantisse__ |
| `max_10_exp` | La valeur maximale positive possible pour un exposant en base 10 |
| `max_exp` | La valeur maximale possible pour un exposant qui forme un nombre flottant normalisé | 
| `min_10_exp` | La valeur minimale négative pour un exposant en base 10 | 
| `min_exp` | La valeur minimale négative possible pour un exposant qui forme un nombre flottant normalisé | 
| `sizeof` | La taille du type dans un `u8` | 
| `typeid` | Le nom du type encodé dans un élément de type `string` |

### Type booléen

Un booléen est un type très simple qui peut prendre deux valeur, soit `true` soit `false`.
Le type `bool` possède également des attributs de type : 

| Nom | Signification |
| --- | --- |
| `init` | La valeur d'initialisation - `false` | 
| `sizeof` | Un `u8` contenant la taille du type en octet - `1` | 
| `typeid` | Un chaine de caractère de type `string` contenant le nom du type |

### Type `char`

Le type `char` est le type permettant d'encoder un caractère ascii. 
Ce type possède les même attributs de type que le type `bool` : 

| Nom | Significations |
| --- | --- |
| `init` | La valeur d'initialisation - `\0` | 
| `sizeof` | Un `u8` contenant la taille du type en octet - `1` | 
| `typeid` | Un chaine de caractère de type `string` contenant le nom du type| 


## Types composés 

Le langage **Ymir** possèdent également des types composés, ou autrement appelés `tuple`. Un tuple est une collection de valeur de type différent, et se note entre parenthèse, par exemple : 
 - `(char, i32)`, est un tuple composé d'un `char` et d'un `i32`.
 
Comme pour tout les types de **Ymir**, les tuples possèdent des attributs de types : 
 
| Nom | Signification |
| --- | --- |
| `init` | Un tuple initialisé avec les valeur initial des types le composant | 
| `arity` | Un `u32` contenant le nombre de type qui composent le tuple | 
| `sizeof` | La taille en mémoire du tuple, l'alignement du tuple est dépendant de l'architecture | 
| `typeid` | Le nom du type encodé dans un élément de type `string` |


## Autres types

Tous les types de **Ymir** qu'ils soit primitif ou non, possèdent les attributs de types `init`, `sizeof` et `typeid`.
