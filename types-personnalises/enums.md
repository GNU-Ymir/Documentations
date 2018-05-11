# Enums

Enum are created by the keyword `enum`. Enum declaration are used to define a group of constants.

```ymir
// This enum is typed as string, but any type can be used
enum Person {
    Engineer : "eng",
    Scientist : "sci"
}

// This function take an enum as an argument 
def inspect (p : Person) {
    // Match are used to branch over multiple values
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

