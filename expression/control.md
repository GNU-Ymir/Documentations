# Structure de contrôles
<hr>

Pour créer un programme fonctionnel, il vous faut être en mesure de prendre des décision, d'itérer sur des ensembles, ou de répéter des instructions plusieurs fois.
Cette partie va présenter les structures de contrôles offertes par le langage **Ymir**.

## Condition

La structure de contrôle la plus simple est la construction `if` `else`. 

```ymir
if a < b 
    println (a);
else if a == b
    println (a, "==", b);
else 
    println (b);
```

En **Ymir**, une condition doit être du type `bool`, il est impossible d'utiliser d'autres types comme des entiers comme on pourrait le faire dans d'autre langage proche du C.
Le contenu d'une instruction `if` est un bloc d'instruction, où la création d'un bloc contenant plusieurs instructions avec les jetons `{` `}` est optionnel, si vous voulez n'executer qu'une seule instruction.

La construction `if` `else` peut être utilisé comme une expression, vous pouvez par conséquent récupérer la valeur d'une expression conditionnel.

```ymir
let x = true;
let a = 1 + if (x) 100 else 2;
```

## Boucle

Le langage **Ymir** propose plusieurs structure de controle permettant de boucler, ou d'iterer sur un ensemble

### While

La boucle `while` est très similaire à celle d'autres langages proche du C.

```ymir
let i = 0;
while i < 100 {
    println (i);
    i ++;
}
```

#### Break

Parfois, il est pratique de pouvoir stopper une boucle avant que sa condition ne la force à s'arrêter. Le mot clé `break` vous permet de le faire.

```ymir
let i = 0;
while i < 100 {
    println (i);
    if i == 5 break;
    i ++;
}
```

Vous pouvez utiliser le mot clé `break` pour stopper une boucle parent en utilisant un tag. 

```ymir
let i = 0;
let j = 0;
while: firstLoop (i < 100) {
   while j < 10 {
      if j == 2 break firstLoop;
      j ++;
   }
   i++;
}
assert (j == 2 && i == 0);
```

### For

La boucle `for` vous permet d'itérer sur une collection d'élément comme un tableau, ou un range.

```ymir
for i in ["One", "Two", "Three"] {
    print (i, ","); 
} // One, Two, Three,

let a = [5, 3, 1];
for i in 0 .. 3 {
    print (i, ","); }
} // 0, 1, 2,

for i in 0UL .. a.len {
    print (a [i], ","); 
} // 5, 3, 1, 

for i in 3 .. 0 {
    print (i, ",");
} // 3, 2, 1,
```

Tout comme pour les boucle `while`, il est possible de tagger une boucle `for` afin de pouvoir y faire référence dans une instruction `break`.

```ymir
for:loop (i in [1, 2, 3]) {
	break loop;
}
```

