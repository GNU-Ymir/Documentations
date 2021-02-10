# Enums

Enums are special types with a set of values. The keyword `enum` allows to define a enumerated type, whose field type is inferred from the compilation. It is mandatory that each field has the same type.

```ymir
// This enum is a string type enum
enum 
| Engineer : "eng",
| Scientist : "sci"
 -> Person;

// This function takes a Person enum as a parameter
def inspect (p : Person) {

	// 	We can use pattern matching to choose between several values
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

