# Bonan tagon mondo

La sekva fontkodo estas la Ymir'a versio de la fama programo "Bonan tagon mondo!".

```ymir
import std::io // importo de la pakaĵo enhavanta io (en/el) funkcioj

// Tiu estas komento

/** Tiu estas deklaro de funkcio
  * La 'main' funkcio estas la unua vokata funkcio 
  */
def main () {
    // Skribas 'Bonan tagon mondo !!' je la ŝelo
    println ("Bonan tagon mondo !!");
}
```

Binaro estas kreita uzante la programo **gyc**.

```bash
$ gyc bonan_tagon.yr
``` 

Tiu ordono kreas la binaron `a.out` kiu povas esti rulita.

```bash
$ ./a.out
Bonan tagon mondo !!
```

La ordonlinia opcioj de gyc estas preskaŭ la samaj ol tiuj de [gcc
suite
compilers](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html#Overall-Options),
krom kelkaj esceptoj kiuj estos prezentitaj en tiu dokumentaro.

La opcio **`-o`** estas uzata por difini la nomon de la kreita programo.

```bash
$ gyc bonan_tagon.yr -o bonan_tagon
$ ls
bonan_tagon  bonan_tagon.yr
$ ./bonan_tagon
Bonan tagon mondo !!
```

