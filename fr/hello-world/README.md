# Hello World

Le code source suivant est la version **Ymir** du celebre programme Hello World.

```ymir
// C'est une commentaire

// Cette fonction est la première fonction appelé par l'exécution du programme
def main () {
    // Affiche 'Hello World !!' sur la console
    println ("Hello World !!");
}
```

L'exécutable peut être généré grâce au compilateur **GYC**

```bash
$ gyc hello.yr
$ ./a.out
Hello World !!
```

