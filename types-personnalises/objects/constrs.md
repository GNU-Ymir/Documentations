# Construction et durée de vie

Cette partie va présenter la création d'un objet, le déroulement de sa vie, jusqu'a sa déstruction.

## Constructeur

Un objet est crée à partir d'une classe. Ils est possible de définir les opération qui vont être appliqué lors de la création d'un nouvelle objet, grâce à la notion de constructeur. Les constructeurs sont des méthodes particulière qui vont être appelé une et une seule fois sur un objet, lors de sa création. La syntaxe d'un constructeur est la suivante :

```ymir

type MyType impl (void) { // A type with no fields

	self () {
		println ("You are constructing me !!");
	}

	self (x : i32) {
		println ("You are constructing me, with a parameter : ", x, " !!");
	}

}

```

Une fois les constructeurs définis il est possible de créer une variable possédant le type personnalisé que nous venons de définir.

```ymir
let myVar = MyType::init (); // Constructor with no parameter
let mySecondVar = MyType::init (10); // Constructor with 1 parameter
```

Comme pour les types primitif, il est possible de construire un type avec `init` sans utiliser de parenthèse, si le type possède un constructeur sans paramètre.

```ymir
let myvar = MyType::init; // Ok
```

### Initialisation des champs de données 

Les champs de données doivent être initialisé dans les constructeurs. Si il ne le sont pas, il ne seront pas affecté à leurs valeur `init`, ce qui est un bug qui va être corrigé ultérieurement. En gros Work in progress !!


## Durée de vie 

Les objets sont des types spéciaux, mais ils respectent les conventions établie par les types primitifs.
La durée de vie d'une variable de type objets, ne différent pas de celle d'une variable de type primitifs.
Les objets sont placé sur la pile, comme toutes les variables locales (non allouées).

## Destructeur

Les déstructeur sont des méthodes appelé une et une seule fois sur les objets lors de leurs destruction.
Il sont définissable dans une classe grâce au mot clé `~self`. Une classe ne peut posséder qu'un seule destructeur.

```ymir
type MyType impl (i32) {

    self (x : i32) {
        self.0 = x;
        println ("Construct ", self.0);
    }
    
    ~self () {
        println ("Destruct ", self.0);
    }

}
```

Il n'est pas possible d'appeler un destructeur, il est appelé automatiquement lorsqu'une variable de type objet arrive en fin de vie.

```ymir
def main () {
    let a = MyType::init (1);
    {
        let b = MyType::init (2);
    }
}

```

Le programme précédant va génerer l'affichage suivant : 
```ymir
Construct 1 // The local constant MyType::init (1)
Construct 2 // The local constant MyType::init (2)
Destruct 2 // The local constant MyType::init (2)
Destruct 2 // the variable b
Destruct 1 // The local constant MyType::init (1)
Destruct 1 // The variable a
```

## Constructeur par copie 

Comme on peut le voir dans l'exemple ci-dessus, la construction d'un type objet par copie est définis par défaut comme une copie de tout les champs d'un type vers un autre, comme pour les copie d'une structure.

Il est néamoins possible de surcharger la construction d'un type par copie grâce à la définition d'un constructeur spécialisé.


```ymir
type MyType impl (i32) {

	self (x : i32) { 
		self.0 = x;
		println ("Construct ", self.0);
	} 
	
	self (self other) { // Copy constructor, where other is the name of the variable that will be copied 
		// other is passed by const reference, and is then typed const (ref MyType)
		self.0 = -other.0;
		println ("Copy ", self.0);
	}
	
	
	~self () {
		println ("Destruct ", self.0);
	}
}
```

Avec cette déclaration de classe, le code définis précédemment rappelé ci-dessous : 


```ymir
def main () {
    let a = MyType::init (1);
    {
        let b = MyType::init (2);
    }
}
```

Va générer l'affichage suivant : 
```
Construct 1 // The local constant MyType::init (1)
Copy -1 // The variable a
Construct 2 // The local constant MyType::init (2)
Copy -2 // The variable b
Destruct 2 // The local constant MyType::init (2)
Destruct -2 // The variable b
Destruct 1 // The local constant MyType::init (1)
Destruct -1 // The variable a
```

## Attention

Si l'objet est déjà construit, ce n'est pas le constructeur par copie qui est appelé lors d'une affectation, mais l'operateur d'affectation. Celui peut être surchargé comme nous le verrons dans la partie suivante sur les méthodes. 
