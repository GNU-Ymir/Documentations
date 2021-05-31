# Funkcioj

Funkcioj estas vaste akceptita koncepto por dividi programon al etaj
partoj. *Ymir* programo ĉiam komencas per la **`main`** (*ĉefa*
esperante) funkcio, kiun ni jam vidis en antaŭaj ĉapitroj. Ĉiuj
funkcioj estas deklaritaj per la vorto **`def`** sekvita per nomo, kaj
listo da parametroj. Oni vokas funkcion per ĝia nomo sekvita de listo
da parametroj apartigitaj per komoj.

```ymir 
import std::io 

/** 
 * La 'main' funkcio estas la enirejo de la programo
 * Ĝi povas havi neniun parametron, kaj redonas i32'a aŭ void'a valoron.
 */
def main () {
    foo ();
}


/** 
 * Deklaro de funkcio nomita 'foo', kiu havas neniun parametron
 */
def foo () {
    println ("Foo");
    	
    bar (); 
}


/**
 * Deklaro de funkcio nomita 'bar', kiu havas unu parametron 'x' de tipo 'i32'
 */
def bar (x : i32) {
    println ("Bar ", x);
}
```

<br>

La sintakso de deklaro de funkcio estas prezentata en la sekva bloko.

```grammar
funkcio := ŝablona_funkcio | simpla_funkcio
simpla_funkcio := 'def' Nomo parametroj ('->' tipo)? esprimo
ŝablona_funkcio := 'def' ('if' esprimo) Nomo ŝablonaj_parametroj parametroj ('->' tipo)? esprimo

parametroj := '(' (var_dekl (',' var_dekl)*)? ')'
var_dekl := Nomo ':' tipo ('=' esprimo)?

Nomo := ('_')* [A-z] ([A-z0-9_])*
```

<br>

La ordo de la deklaroj ne gravas, kaj havas neniun efikon sur la
kompilado. La simboloj estas difinitaj per la kompilado unue, antaŭ ol
ĝi kontrolas ilin, do malkiel C kaj similaj programlingvoj, kvankam la
funkcio **`foo`** estas deklarita post la **`main`** funkcio (en la
unua ekzemplo de tiu ĉapitro), ĝia simbolo estas atingebla de la
**`main`** funkcio, kiu do povas voki ĝin. Pliaj informoj pri deklaro
de simboloj, kaj atingebleco estas prezentataj en la ĉapitro
[Pakoj](https://gnu-ymir.github.io/Documentations/eo/modules/).

## Parametroj

La parametroj de funkcio estas deklaritaj post la nomo, inter rondaj
krampoj. La sintakso de deklaro de parametro estas simila al la
sintakso de deklaro de variablo, krom la vorto **`let`** kiu estas
ellasita. Tamen, malkiel deklaro de variablo, parametro devas havi
tipon, kaj ĝia valoro estas maldeviga.

```ymir 
import std::io 

/**
 * Deklaro de funckio 'foo' kun unu parametro 'x' de tipo 'i32'
 */
def foo (x : i32) {
	println ("La valoro de x estas : ", x);
}

/**
 * Deklaro de funkcio 'bar' kun du parametroj 'x' kaj 'y' ambaŭ de tipo 'i32'
 */
def bar (x : i32, y : i32) {
	println ("La valoro de x + y : ", x + y);
}

def main () {
	foo (5); // Vokas la funkcion 'foo', kun la valoro '5' por la parametro 'x' 
	bar (3, 4); // Vokas la funkcion 'bar', kun 'x' fiksita al '3' kaj, 'y' fiksita al '4'
}
```

<br>

### Apriora valoro

Parametro de funkcio povas havi valoron, kiu estas uzita kiel apriora
valoro kiam oni vokas la funkcion. Tiam, estas maldeviga fiksi valoron
por la parametroj, kiuj havas aprioran valoron. Por ŝanĝi la valoron
asociita al tia parametro, oni enkondukas novan sintakson, nomita la
*noma esprimo*. Tiu esprimo, kies sintakso estas prezentata en la
sekva kodbloko, konsistas en nomi esprimon.

```
noma_esprimo: Nomo '->' esprimo
```

<br>

La sekva ekzemplo prezentas funkcion **`foo`**, kies parametro **`x`**
havas aprioran valoron. La funkcio **`main`** vokas ĝin, unue uzante
la aprioran valoron de **`x`**, kaj due uzante *noman esprimon*.

```ymir 
import std::io

/**
 * Funkcio 'foo' povas esti vokita sen fiksi valoron por la parametro 'x'
 * Tiam, '8' estos uzita kiel la apriora valoro de 'x'
 */
def foo (x : i32 = 8) {
    println ("The value of x is : ", x);
}

def main () {
    foo (); // Vokas 'foo' kun 'x' fiksita al '8'
    foo (x-> 7); // Vokas 'foo', kun 'x' fiksita al '7'
}
```

<br>

*Noma esprimo* povas ankaŭ esti uzita por parametroj, kiuj ne havas
aprioran valoron. Danke al la *noma esprimo*, eblas voki funkcion sen
zorgi pri la ordo de la argumentoj.

```ymir
import std::io


/**
 * Parametroj kun apriora valoro ne bezonas esti la lastaj.
 * Tiu funkcio povas esti vokita kun nur du parametroj ('x' kaj 'z'), aŭ uzante noman esprimon
 */
def foo (x : i32, y : i32 = 9, z : i32) {
    println (x, " ", y, " ", z);
}

def main () {
    // Vokas la funkcion 'foo', kun 'x' = 2, 'y' = 1 kaj 'z' = 8 
    foo (8, y-> 1, x-> 2);
    foo (1, 8); // Vokas la funkcion 'foo' kun 'x' = 1, y = '9' kaj z = '8'
}
```
<br>

Rezultoj:
```
2 1 8
1 9 8
```

<br>

Iu ajn kompleksa esprimo povas esti uzita kiel la apriora valoro de
parametro. Kreo de objekto, voko de funkcio, kodbloko, ktp. La sola
limo estas ke oni ne povas referi al la aliaj parametroj de la
funkcio. Fakte, ili ne ankoraŭ estas konsideritaj kiel deklaritaj, je
la momento de la voko.

```ymir
def foo (x : i32) -> i32 { ... }
def bar (x : i32) -> i32 { ... }

def baz (a : i32, b : i32 = {bar (1) + foo (2)}) {
 // ...
}

def main () {
	baz (12); // Vokas 'baz', kun 'a' = 12 kaj b = (bar (1) + foo (2))
}
```

<br>

La simboloj uzitaj en la apriora valoro de parametro devas esti
atingeblaj je la kunteksto de la deklaro de ties funkcio. Tio volas
diri ke, en la lasta ekzemplo, la funkcio **`baz`** devas povi atingi
la funkciojn **`bar`** kaj **`foo`**, tamen ne bezonas ke la funkcio
**`main`**, kiu vokas la **`baz`** funkcion, povas atingi tiujn du
funkciojn. Pliaj informoj pri deklaro de simboloj kaj atingebleco
estas prezentataj en la ĉapitro
[Pakoj](https://gnu-ymir.github.io/Documentations/eo/modules/).

### Rikura apriora valoro

Rikuro en apriora valoro estas malpermesita. Por ilustri tiun punkton,
la sekva kodbloko prezentas ekzemplon, kiun la kompililo rifuzos.

```ymir
import std::io;

def foo (foo_a : i32 = bar ()) -> i32 {
                    // ^^^ tie, la valoro estas rikura
	foo_a
}

def bar (bar_a : i32 = foo ()) -> i32 {
                    // ^^^ rikura problemo
					 
	println ("Bar ", bar_a);
	foo (foo_a-> bar_a + 11) 
}

def main () {
	println ("Main ", bar ()); // ne bezonas ke oni fiksu la valoron de 'bar_a'
}
```

<br>

Eraroj:
```error
Error : the call operator is not defined for main::bar and {}
 --> main.yr:(3,28)
 3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ╋                            ^^
    ┃ Note : candidate bar --> main.yr:(8,5) : main::bar (bar_a : i32)-> i32
    ┃ Note : 
    ┃  --> main.yr:(3,10)
    ┃  3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ┃     ╋          ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(8,24)
    ┃  8  ┃ def bar (bar_a : i32 = foo ()) -> i32 {
    ┃     ╋                        ^^^
    ┃ Note : 
    ┃  --> main.yr:(8,10)
    ┃  8  ┃ def bar (bar_a : i32 = foo ()) -> i32 {
    ┃     ╋          ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(3,24)
    ┃  3  ┃ def foo (foo_a : i32 = bar ()) -> i32 {
    ┃     ╋                        ^^^
    ┗━━━━━┻━
```

<br>

Tiu rikura problemo povas esti simple solvita, per fiksi valoron al la
parametro **`bar_a`**, kiu ne dependas de la valoro de **`foo_a`**,
kiam oni vokas la funkcion **`bar`** kiel la apriora valoro de
**`foo_a`**.

```ymir
def foo (foo_a : i32 = bar (bar_a-> 20)) -> i32 {
                    //      ^^^^^ tio resolvas la problemon
	foo_a
}

// Ne bezonas ke oni faru same por la funkcio 'bar', la problemo estas jam solvita
```

<br>
Rezultoj: 

```
Bar 20
Bar 31
Main 42
```

### Parametroj de la funkcio 'main'

La funkcio **`main`** povas havi unu parametron. Tiu parametro estas
de tipo **`[[c8]]`**, kaj enhavas la liston de argumentoj donitaj al
la programo, kiam ĝi estas lanĉita.

```ymir
import std::io;

def main (args : [[c8]]) {
	println (args);
}
```

<br>

Rezultoj: 

```bash
$ ./a.out foo bar 1
[./a.out, foo, bar, 1]
```

La norma biblioteko provizas analizilo de argumentoj en
**`std::args`**, kiu ne estos prezentita tie, sed kiu valoras mencion.

## Korpo de funkcio

La korpo de funkcio estas esprimo. Ĉiuj esprimoj en *Ymir* havas
tipon, sed tiu ne volas diri ke ĉiuj esprimoj havas valoron, ĉar ili
povas esti de tipo **`void`**. La valoro de la esprimo (korpo de la
funkcio) estas komputita, kiam oni eniras la funkcion, kaj tiu valoro
estas uzita kiel la valoro de la funkcio. Simple **`aldoni`** funkcio
povas esti skribita jene :

```ymir
def aldoni (x : i32, y : i32)-> i32 
	x + y
```

<br>

Aŭ uzante pli kompleksa esprimo, kiel kodbloko, kiu estas esprimo
enhavata liston da esprimoj. Kodbloko estas ĉirkaŭita de kunigaj
krampoj, kaj estis prezntita en la ĉapitro pri vivdaŭro kaj lokaj
variabloj. La lasta esprimo de kodbloko estas la esprimo uzita por
komputi la valoron de la kodbloko, do, en tiu ĉi okazo, la valoro de
la funkcio.

```ymir

def aldoni (x : i32, y : i32) -> i32 { // Komenco de kodbloko
    x + y // la lasta esprimo de la bloko estas la valoro de la bloko
} // fino de kodbloko

def main () 
	throws &AssertError
{
    let x = {
    	let y = aldoni (1, 2);
    	y + 8 
    };
	assert (x == 11);
}
```

Punktokomo **`;`** difinas ke esprimo finas en bloko, kaj ke sia
valoro devas esti ignorita. Se la lasta esprimo de kodbloko finas per
punktokomo, do malplena esprimo estas aldonita en la kodbloko. Tiu
malplena esprimo havas neniun valoron, kaj estas de tipo **`void`**.

```ymir

/**
 * La valoro de la funckio estas '9'
 */
def foo () -> i32 
    9


def main () {
    let x = {
         foo (); // Vokas la funckion 'foo', sed sia valoro estas ignorita
    } // La valoro de la bloko estas de tipo 'void'
}
```

<br>

Ĉar estas neebla deklari variablon, kies tipo estas **`void`**, pro ke
ĝi havas neniun valoron, la supra ekzemplo ne estas akceptita per la
kompililo. La eraro donita de la kompililo estas prezentata en la
malsupra kodbloko. Oni povas noti ke malgraŭe, variabloj kun neniu
valoro estas deklareblaj, sed ilia tipo devas esti malplena opo, ne
**`void`**, kies litero estas **`()`**.

```error
Error : cannot declare var of type void
 --> main.yr:(6,9)
    | 
 6  |     let x = {
    |         ^

ymir1: fatal error: 
compilation terminated.
```

