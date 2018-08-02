# Attributs de fonctions

Les fonctions peuvent être paramétrées grâce à des attributs. Les attributs sont définis avec le jeton `@`. 

```ymir
// 
def @{safe, inline} foo () {
}

def @inline bar () {
}
```

## Inline 

Comme son nom l'indique l'attribut `inline` va permettre d'inliner la fonction. En d'autre terme, contrairement à un appel de fonction normal, le corps de la fonction va être collé dans la fonction de l'appellant. 

```ymir 
def @inline foo (a : i32) {
	return a + 12;
}

println (foo (10)); 
```

Va être réecris en : 
```ymir
println (22); 
```

Il est impossible d'inliner une fonction récursive, mais toutes les autres fonctions peuvent être inliné. L'inline contrairement à d'autre langage proche du C est une directive obligatoire, le compilateur est obligé d'inliner la fonction.

```ymir
def @inline fibo (n : i32) {
	if n < 2 { return n; }
	else return fibo (n - 1) + fibo (n - 2); // Erreur
}
```

## Safe

Le mot clé `safe` ajoute des vérification sémantique à la fonction, spécifiant que celle-ci ne peut pas effectuer certaines opération dangereuse. Une fonction `safe` ne peut ainsi pas faire planter un programme.

Les trois opérations interdites dans un contexte safe sont :
- Appeler une fonction non-safe
- Déréférencer un pointeur
- Allouer de la mémoire

Toutes les autres opérations sont autorisés.

### Trusted

L'attribut `trusted` permet de faire le lien entre les fonctions bas niveau et les fonction safe. **Il ne doit pas être utilisé à la légère**. Il définit qu'une fonction non safe peut quand même être appelé depuis un contexte safe, car la fonction a été vérifié à la main auparavant. 

**Cet attribut est hautement déprecié**.
