# Union 

Les types `union` sont équivalent au type `struct`, à l'exception que les champs qui composent une `union` partage la même zone mémoire. Le mot clé `union` permet de déclarer un type `union`. 

```ymir 
union 
| i : i32
| d : f64
 -> MyUnion;

def main () {

	// Un seul des éléments de l'union est nécessaire pour la construire
	// Le premier élément compatible est utilisé 
	let a = MyUnion { 12 }, b = MyUnion { 1200.05 };
	let c = MyUnion {'r'}; // Erreur
	
	println (b.i, " ", b.d, " ", b::sizeof); // 858993459 1200.050000 8		
}
```
