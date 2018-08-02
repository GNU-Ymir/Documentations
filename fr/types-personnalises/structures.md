# Structures

Une structure est un type personnalisé, permettant de regrouper plusieurs valeurs dans un type ayant un nom. Leur composition est équivalente à celle des tuples, on peut voir les tuples comme des structures anonymes. Le mot clé `struct` permet de définir un nouveau type.

```ymir

// Une structure avec deux champ
struct  
| x : double,
| y : double
-> Point;

// Une structure peut contenir des champ dont le type est une structure
struct
| a : Point
| b : Point
-> Rectangle;

def main () {
    // Il faut remplir toutes les données pour construire une structure
    let point = Point { 1.1, 1.7 };

    // Il est également possible de construire une structure sans lui donner de valeur
    // Tout les champs seront remplis avec leur valeur ::init
    let point2 = Point::init; 

    // Il est possible de transformer une structure en tuple
    let (x, y) = point.tupleof;
    println ("(", x, ", ", y, ")");

    let rect = Rectangle { point, Point { 3.3, 4.5 } };

    // Les structure sont des éléments affichables
    println (rect);
}
```

## Attribut de structure

Il est possible de modifier l'alignement des types dans une structure. Pour ça, il faut utiliser un attribut de structure, qui se déclare en même temps que la structure grâce au jeton `@`.

```ymir

struct @packed
| a : char 
| b : i32
| c : char
 -> Packed;
 
struct 
| a : char
| b : i32 
| c : char 
 -> Unpacked;
 
def main () {
	println (Packed::sizeof); // 6
	println (Unpacked::sizeof); // 12
} 
 
```
