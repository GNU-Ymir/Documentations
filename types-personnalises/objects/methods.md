# Méthodes

Les méthodes sont des fonctions particulière qui s'applique à des instances d'objets. Elle permettent d'appliquer un traitement particulier à un type et facilite la structuration du code.

## Méthodes pures

Comme pour les fonctions, les méthodes sont séparé en deux catégories, les méthodes pures et les méthodes impures (cf .[Fonctions](../../fonctions/main.md)).

Les méthodes pures sont définis dans une classe grâce au mot clé `def`. Le premier paramètre d'une méthode est toujours `self`, son type est une référence d'un objet, et est toujours inféré.

```ymir

type MyType impl (i32) {

	self (x : i32) { self.0 = x; }
	
	def foo (self, z : i32) {
		println ("Replace ", self.0, " by ", z);
		self.0 = z;
	}

}

// ...

let myvar = MyType::init (10);
myvar.foo (12); // This prints : 'Replace 10 by 12'

```

Il est possible de définir plusieurs méthodes avec le même nom, comme
pour les fonctions. La méthodes qui est le plus proche de la
spécialisation de types lors d'un appel, ou d'une référence sera
utilisé.

Nous verrons plus tard qu'il est également possible de surcharger une méthodes par l'héritage.
Seule les méthodes pures peuvent être surchargé par héritage, car elles seules sont virtuelles.


## Méthodes impures

Comme pour la déclaration des méthodes pures, le mot clé `def` permet de déclarer une méthodes impures. La différence entre une méthode pure et une méthode impure est la même que la différence entre les fonctions pures et impures, par conséquent vous pouvez vous référer à la section [Fonction](../../fonctions/main.md), pour de plus ample détail.

```ymir

type MyType impl (i32) {

	// ...
	
	def foo (self, x) { // Foo is an impure method
		// ...
	}	
}
```

Comme spécifié plus haut, les méthodes impures ne sont pas virtuelles et ne peuvent donc pas être surchargé par héritage.


# Méthodes statiques

Le nom "méthode statique" est un abus de language pour définir des fonctions définis à l'intérieur d'une classe et qui sont utilisable sans instance d'objet.

Une méthode statique est accéssible grâce à l'operateur `::`.

Contrairement au méthodes, ces fonctions ne prennent pas le paramètre `self` comme premier argument.

```ymir
type MyType impl (i32) {

	// ...
	
	def foo (x : i32) { // This method is static
		// ...
	}

}

// The type can be directly used to call static methods
MyType::foo (12); // Ok


let myvar = MyType::init ();

// We can also use a variable of this type 
myvar::foo (12); // Ok

// The static method cannot be accessed using the dot operator
myvar.foo (12); // Error, type MyType does not have any method named foo
```

Comme pour toutes déclaration de fonction, les méthodes statiques peuvent être pure ou impure, et également template comme nous le verrons dans la section consacré au [templates](../../templates/fonctions.md).

