# Komentoj

*Ymir* proponas du malsamajn manierojn por komenti fontkodon. 

* > `// Linio de komento kiu finiĝas je la fino de la linio`
* > `/* Komento de multaj linioj kiu finiĝas je la limiga signo */`

```ymir
def main () 
	throws &AssertError // tiu malgravas por la momento
{
    // Tio estas ekzemplo de komento

    /* 
     * Tio estas alia ekzemplo de komento
     * Kie staroj estas nedevigaj
     */

    /*
	Kaj tio estas pruvo
    */

    // Neniu el tiuj linioj havas influo al la traduko

    let x = 1 + /* 2 + */  3;
    assert (x == 4); 
}
```

En la antaŭa programo, la voko de la funkcio **`assert`** ĵetas
escepton se la testo pasita kiel parametro estas malvera. Eraroj estas
prezentataj en la ĉapitro [Error
Handling](https://ymir-lang.org/eo/errors/main.html). Por
la momento, ni nur konsiderus ke la programa finiĝas se la testo estas
malvera.

Ni vidos en la ĉapitro
[Documentation](https://ymir-lang.org/eo/documentation/README.html), ke
komentoj estas utilaj por produkti dokumentaron aŭtomate.
