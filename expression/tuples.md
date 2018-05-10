#Tuples
<hr>

Un tuple est une collection de valeurs de types différents. Il est possible de construire un tuple en utilisant les parenthèses `(``)`.
Il est possible de passer un tuple en tant que paramètre d'un fonction, ou en tant que retour de fonction pour retourner plusieurs valeurs.

```ymir

def reverse (pair : (i32, bool)) -> (bool, i32) {
	let (x, y) = pair;
	return (y, x);
}

def main () {
    let tuple = (1, true);
    let rev = reverse (tuple);    
}

```

Le mot clé `expand` permet de deconstruire un tuple, et de le passer
en tant que paramètres de fonction, ou lors de la création d'un tuple
plus grand.


```ymir

def foo (a : i32, b : char) {
    println (a, " ", b);
}

def main () {
    let tuple = (1, 't');
    foo (tuple::expand);
    let tuple_2 = (1, tuple::expand);
}
	
```

Il est possible de récupérer une valeur d'un tuple en utilisant l'operateur `.`.

```ymir

def main () {
    let tuple = (1, 2, 3);
    println (tuple.0, " ", tuple.1, " ", tuple.2);
}

```
