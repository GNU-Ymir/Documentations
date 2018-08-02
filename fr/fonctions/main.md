# Fonctions 

## Les fonctions pures 

Les fonctions pure sont des fonctions, dont on connaît toutes les informations nécessaire pour qu'elle soit compilé, c'est à dire que : 
- tous les types des paramètres sont connu
- elle possède un corps

Le type de retour n'est pas nécessaire pour qu'une fonction soit pure, il sera inféré lors de sa compilation.

La fonction `main` est toujours pure, même si le type du paramètre d'entrée n'est pas donné, il sera inféré à `[ [char] ]`.

```ymir
def maPremiereFonctionPure (a : i32, b : f32) -> f32 {
	return cast!f32 (a) + b;
}

def maDeuxiemeFonctionPure (a : i32, b : [char]) {
	return b [a]; // le type de retour n'est pas donné, mais inféré à char
}
```

Une fonction ne peut retourner qu'un seul type qui doit être connu à la compilation.

```ymir
def maFonctionImpossible (a : i32) {
	if a < 10 {
		return a;
	} else {
		return [1, 2]; // Erreur type incompatible [i32 ; 2UL] et i32
	}
}
```

### Cas particulier 

Il existe un cas particulier où le type de retour d'une fonction pure ne peut pas être déduis, le cas des fonction récursive.

```ymir
def fibo (n : i32) {
   if n < 2 { return n; } // n est de type _i32_, le type de la fonction est _i32_
   else return fibo (n - 1) + fibo (n - 2); // pas de problème le type de fibo a été déduit
}

def facto (n : i32) {
  if n >= 1 { return facto (n - 1) * n; } // Erreur, on ne connaît pas le type de facto
  else return 1;
}
```

Une fonction pure provenant d'un autre module que celui en cours de compilation (cf. [Modules](modules/main.md)) sera importé comme étant une fonction externe, par conséquent, si son type de retour n'est pas définis, il sera définis comme étant `void`.

## Les fonction impures 

Les fonction impures contrairement au fonction pure, manque d'information pour être compilé directement, mais possèdent un corp. Ces fonction vont donc être compilé uniquement lorsqu'elle seront référencé (généralement par un appel).

Le types des paramètres qui ne sont pas connu vont alors être inféré grâce à ceux des paramètre de l'appel. 

```ymir
def foo (a, b : i32, c) { // a et c n'ont pas de type
   // ...
} 

// ...
foo (10, 2, "salut"); // OK, avec a : i32 et c : string
foo (10, "salut", 1); // Erreur, b doit être de type i32
```

## Les fonctions externes

Les fonctions externes sont des fonctions dont on connaît le type de tout les paramètres, mais qui ne possède pas de corp. Elle sont utilisable comme tous les autres types de fonctions. Le type de retour des fonctions externes doit être donné, si ce n'est pas le cas, elle sera considéré comme `void`.

```ymir
extern foo (a : i32) -> i32; 

println (foo (10)); // Ok

```
## Surcharge

Toutes les fonctions peuvent être surchargé, qu'elle soit pure ou non. Lors de l'appel, la fonction la plus proche des types passé en paramètre sera appelé.

```ymir
def foo (a : i32, b) {
// ...
}

def foo (a, b : i32) {
// ...
}

//...
foo (10, "salut"); // la première fonction est appelé
foo ("salut", 10); // la deuxième fonction est appelé
foo (10, 10); // Erreur, la surcharge fonctionne autant avec les deux prototypes.
```

## Décorateur de paramètres

Il existe deux décorateur de paramètre pour spécifié un comportement 
- `const`, le paramètre ne pourra pas être modifié quel que soit son type (cf. [Variables](expressions/variables.md))
- `ref`, le paramètre est passé par référence, une lvalue est requise. Toute modification de la variable dans la fonction appelé modifira également la variable de la fonction appellante.

```ymir
def foo (ref a) {
	a = 12;
}

def bar (const a : [i32]) {
	a [0] = 8; // Erreur le tableau est constant
}

let a = 1;
foo (10); // Erreur 10 n'est pas une lvalue
foo (a);
assert (a == 12);

bar ([1, 2, 3]); // Ok
```

Le décorateur `const` est transitif et n'est pas ôtable.

```ymir
def foo (a : [char]) {
	// ...
}

def bar (const a : [char]) {
    // ...
}

let a = "test"; // [const (char)];
foo (a); // Erreur, on perd le const
bar (a); // Ok, le const est transitif, const ([char]) est plus global que [const (char)]

let b = [char ; new 10U]; // [char]
bar (b); // Ok, on peut passer un élément non constant en tant qu'élément constant
```

