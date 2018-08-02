# Enums

Les enum sont des types spéciaux possédant un ensemble de valeurs constantes. Le mot clé `enum` permet de définir un type enumeré, dont le type des champs est inféré à la compilation. Il est obligatoire que chacun des champs possède le même type.

```ymir
// Cette enum est de type string
enum 
| Engineer : "eng",
| Scientist : "sci"
 -> Person;

// Cette fonction prend un enum de type Person en paramètre
def inspect (p : Person) {

	// On utilise le pattern matching pour choisir entre plusieurs valeur
    match p {
        Person::Engineer => println ("Engineer");
        Person::Scientist => println ("Scientist");
    }
}

def main () {
    let michel = ("Michel", Person::Engineer);

    inspect (michel.1);
    inspect (Person::Scientist);
}
```

