# Saluton, Mondo !

La sekva programkodo estas la *Ymir*' versio de la fama programo "Saluton, Mondo!"

```ymir
import std::io; // importo de la pako enhavanta IO funkciojn
   
// Tiu estas komento

/**
 * Tiu estas deklaro de funkcio
 * La 'main' funkcio estas la unua funkcio, kiu estas vokita
 */
def main () {
   // skribas 'Saluton, Mondo!' en stdout
   println ("Saluton, Mondo!");
}
```
<br>

Binaro povas esti kreita per *gyc* kompililo.

```bash
gyc saluton.yr
```

<br>
Tiu ordono kreas binaron nomita `a.out`, kiu povas esti lanĉita.

```bash
$ ./a.out
Saluton, Mondo!
```

<br>
La opcioj de la kompililo *gyc* estas la samaj ol tiuj de [la
kompililaro de
GCC](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html#Overall-Options)
krom kelkaj esceptoj, kiuj estos klarigitaj en ĉi tiu dokumentado.

La opcio **`-o`** povas esti uzita por determini la nomon de la lanĉebla binaro.

```bash
$ gyc saluton.yr -o salutu
$ ls
salutu  saluton.yr
$ ./salutu
Saluton, Mondo!
```

