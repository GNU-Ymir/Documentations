# Komentoj

*Ymir* proponas du manierojn por skribi komentojn.

* > `// Linio de komento, kiu finas je la fino de la linio`
* > `/* Pluraj linioj de komento, kiu finas kiam aperas la lima signo fina */`

```ymir
def main () 
	throws &AssertError // Ne io, kio gravas por la momento
{
	// Tiu estas ekzemplo de komento, sur unu linio
	
	/**
	 * Tiu estas alia ekzemplo
	 * Kie, la asteriskoj estas nedevigaj
	 */
	 
	 /**
	   Tio estas pruvo
	 */
	 
	 // Neniu, el tiuj komentoj havas influon sur la kompilado
	 
	let x = 1 + /* 2 + */  3;
    assert (x == 4); 
}
```

<br>

En la supra programkodo, voki **`assert`** ĵetas escepton, se la testo
malsukcesas. Eraroj estas prezentataj en la ĉapitro [Traktado de
Eraroj](https://gnu-ymir.github.io/Documentations/eo/eraroj/main.html). Krome,
por la momento, ni nur konsideros ke la escepto simple haltigas la
programon kiam la testo malsukcesas.

Ni ankaŭ vidos en la ĉapitro
[Dokumentado](https://gnu-ymir.github.io/Documentations/eo/dokumentado/main.html),
ke komentoj estas uzataj por produkti dokumentadon aŭtomate.
