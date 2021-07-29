# Regaj fluoj

Kiam oni skribas programkodon, la kapablo de decidi ĉu ruli parton de
kodo, aŭ ĉu ripeti parton de kodo, estas baza skemo, kiu estas necesa.

## 'If' esprimo

La **`if`** vorto (*'se' esperante*), difinas esprimon kiu ebligas
disbranĉigon de la programo farante decidojn, bazitaj sur kondiĉoj. La
**`else`** vorto (*'alie' esperante*) povas esti lokita malantaŭ *if*
esprimo, por ruli parton de kodo, se la kondiĉo de la *if* esprimo ne
estas vera.

La sintakso de la *if* esprimo estas prezentata malsupre.

```grammar
if_esprimo := 'if' esprimo esprimo ('else' esprimo)?
```

<br>

La sekva programkodo prezentas bazan uzon de la *if* esprimo. En ĉi
tiu ekzemplo, la valoro de la variablo **`x`** estas testita. Se ĝia
valoro estas malpli granda ol `5`, tiam la kodo je la linio `5` estas
rulita, alikaze se ĝia valoro estas egala al `5` la kodo je la linio
`7` estas plenumita. Se ambaŭ tiuj testoj malsukcesas, la linio `9`
estas rulita. En ĉi tiu ekzemplo, **`x`** egalas `5`, do la rezulto
estas `X estas ekzakte 5`.

```ymir
def main () {
	let x = 5;
	
	if x < 5 {
	   println ("X estas malpli granda ol 5");
	} else if (x == 5) { // la krampoj ne estas devigaj
	  println ("X estas ekzakte 5");
	} else {
	  println ("X estas pli granda ol 5");
	}
}
```

<br>

La valoro de *if* esprimo estas komputita kiel la valoro de la bloko
da kodo kiu estas rulita, kiam la programo elektas branĉon laŭ
kondiĉo. Ĉiuj branĉoj de la *if* esprimo devas havi valorojn, kies
tipoj estas similaj. Alie la kompililo ĵetas eraron, pro ke la tipo de
la *if* esprimo ne povas esti induktita. La tipo de *if* esprimo
evidente povas esti **`void`**, kiu estas la tipo uzita kiam ne estas
valoro.

```ymir
def main () {
	let kondicxo = true;
	let x = if kondicxo {
		5 
	} else {
		7
	};
}
```

<br>

Se eblas ke neniu el la branĉoj de *if* esprimo estus rulita, tiam la
tipo de la esprimo devus esti **`void`**. Ekzemple, en la sekva
programkodo, la variablo **`kondicxo`** povas enhavi ambaŭ la valorojn
**`true`** aŭ **`false`**. Se ĝia valoro estas **`false`**, tiam la
kondiĉo de la *if* esprimo estas malvera, kaj en la solan branĉon de
la esprimo oni ne eniras, kaj la valoro de la variablo **`x`** ne
estas difinita, kio estas malpermisata per la programlingvo.

```ymir
def foo () -> bool { // ... } // redonas bool'n valoron

def main () {
	let kondicxo = foo ();
	let x = if kondicxo { // la kondiĉo povas esti malvera
		5 
	}; // do la esprimo havas neniun valoron
	   // sed la variablo 'x' ne povas esti tipigita kiel 'void'
}
```
<br>

Eraroj: 
```error
Error : incompatible types void and i32
 --> main.yr:(5,10)
 5  ┃ 	let x = if kondicxo { // la kondiĉo povas esti malvera
    ╋ 	        ^^
    ┃ Note : 
    ┃  --> main.yr:(6,3)
    ┃  6  ┃ 		5 
    ┃     ╋ 		^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

## Bukloj

### Senfinaj ripetoj

La **`loop`** vorto (*'buklo' esperante*) estas uzita por deklari ke
bloko da kodo devas esti ripetata senfine. La sintakso de la
**`loop`** esprimo estas prezentata en la sekva blokkodo.

```grammar
loop_esprimo := 'loop' esprimo
```

<br>

En la sekva ekzemplo, la programo neniam finos, kaj presos, senfinan
nombron da fojoj, la ĉenon `"Mi estos presita senfine"`.

```ymir
def main () {
	loop { 
		println ("Mi estos presita senfine");
	}
}
```

<br>

*loop* esprimo povas esti uzita por ripeti agon, ĝis ĝi sukcesas,
ekz. atendi la finon de fadeno (*de plenumado*), atendi retan konekton,
ktp. La vorto **`break`** (*rompu esperante*) haltigas buklon. Ĝi ĉiam
estas asociata al valoro, kiu estas donita ĵus malantaŭ la **`break`**
vorto. Tiu valoro estos la valoro de la buklo, se la programo rulas
la *break* deklaron. Ĉiuj *break* deklaroj de sama buklo devas havi
valorojn, kies tipoj estas similaj, por garantii la koherecon de
tipoj.


```ymir
import std::io

def main () {
	let mut kalkulanto = 0;
	
	let rezulto = loop { 
		kalkulanto += 1;
		if kalkulanto == 10 {
			break kalkulanto + 1; // Haltigas la buklon, kaj donas la valoron 'kalkulanto + 1'
		}
	};
	println ("Rezutlo : ", rezulto);
}
```
<br>

Rezulto: 
```
Rezulto: 11
```

<br>

### Bukli dum kondiĉo estas plenumita

La vorto **`while`** (*'dum' esperante*) kreas buklon, kiu ripetiĝas
ĝis kondiĉo ne plu etas plenumita. Kiel por la *loop* esprimo, *break*
deklaroj povas esti uzitaj por haltigi ĝin. Krome, malkiel *loop*
esprimoj, *while* esprimoj ĉiam estas de la tipo **`void`**, pro ke
eblas ke oni neniam eniris tiajn buklojn. La *break* deklaroj en tiaj
buklojn devas sekvi tiun regulon, do la valoroj asociataj al *break*
deklaroj en *while* esprimoj, ĉiam estas **`void`** valoroj.
*Kontribuo:* Ni planas aldoni **`else`** blokon al *while* bukloj, por
doni valoron al tiaj bukloj, kiam ĝi ne estas eniritaj.

La sintakso de *while* buklo estas prezentata en la sekva bloko da kodo.

```grammar
while_esprimo := 'while' esprimo esprimo
```

<br>

La sekva ekzemplo, presentas uzon de *while* buklon, kie la buklon
iteracias 10 fojojn, dum la valoro de **`i`** estas malpli granda ol
**10**.

```ymir
import std::io

def main () {
	let mut i = 0;
	while i < 10 {
		i += 1;	
	};
	
	println ("I estas : ", i);
}
```

<br>
Rezulto:

```
I estas : 10
```

### Iteracii trans valoro

La lasta speco de buklo estas la *for* buklo (*'por' esperante*),
deklarita per la vorto **`for`**. Kiel por *while* bukloj, la valoro
de *for* buklo ĉiam estas **`void`**, pro ke ne eblas garantii ke la
buklo eĉ unu fojon estos enirita. *Kontribuo:* ankoraŭ kiel por la
*while* buklo, ni planas aldoni *else* bloko al *for* buklo por doni
valoron al bukloj, kiuj neniam estas enirita.

*for* bukloj iteracias trans valoro, kies tipo estas iteraciebla. La
bazaj tipoj, kiuj estas iteracieblaj estas, intervaloj, opoj, tranĉoj
kaj statikaj tabuloj.

La sintakso de la *for* buklo estas prezentata en la sekva bloko da kodo.

```grammar
for_esprimo := 'for' ('(' var_deklj ')' | var_deklj) 'in' esprimo esprimo

var_deklj := var_dekl (',' var_dekl)
var_dekl := (dekoracio)* nomo (':' tipo)?

dekoracio := 'ref' | 'mut' | 'dmut'
```

<br>

**1) Iteracio trans intervalo.** En la sekva ekzemplo, la *for* buklo
estas uzita por iteracii trans tri intervaloj. La unua buklo je la
kvara linio, iteracias inter la valoroj **0** kaj **8**
(malinkluzivita), je paŝo de **2**. La dua buklo iteracias inter la
valoroj **10** kaj **0** (malinkluzivita) per paŝo de **-1**. La tria
buklo interacias inter la valoro **1** kaj **6** (inkluzivita ĉi-foje).

```ymir
import std::io
    
def main () {
    for i in (0 .. 8).step_by (2) {
		println (i);
    }	
	
	for i in 10 .. 0 {
		println (i);
	}
	
	for i in 1 ... 6 {
		println (i);
	}
}
```

<br>

**2) Iteracio trans tranĉoj kaj statikaj tabuloj.** Tranĉoj estas
iteracieblaj tipoj. Ili povas esti iteraciita uzante unu aŭ du
variabloj. Kiam oni uzas nur unu variablon, tiu variablo estas
asociata al la valoroj enhavitaj de la tranĉo. Kiam du variabloj estas
uzitaj, la unua estas asociata al la nuna indekso de la iteracio, kaj
la dua estas asociata al la valoroj enhavitaj de la tranĉo. Iteracioj
trans statikaj tabuloj funkcias simile.

```ymir
import std::io;

def main () {
	let a = [10, 11, 12];
	for i in a {
		print (i, " ");
	}
	
	println ("");
	for i, j in a {
		print (i, "-> ", j, " ");
	}
	println ("");
}
```

<br>

Rezultoj:

```
10 11 12 
0-> 10 1-> 11 2-> 12
```

<br>

*Kontribuo:* Iteracii per referenco trans ŝanĝeblaj tranĉoj, kaj
ŝanĝeblaj statikaj tabuloj estas ankoraŭ ellaboriĝanta.

**3) Iteracio trans opoj.** Opoj estas iteracieblaj tipoj. Sed malkiel
tranĉoj aŭ intervaloj, la *for* buklo estas disvolvita dum la
kompilado. La opoj estas iteracieblaj kun nur unu variablo, kiu estas
asociata al la valoroj enhavitaj de la opoj.

```ymir 
import std::io 

def main () {
	let x = (1, 'r');
	for i in x { 
		println (i);
	}
	
	// supra buklo estas ekvivalenta al 
	println (x.0);
	println (x.1);
}
```

<br>

Oni povas noti ke la tipo de la variablo **`i`**, en la *for* buklo de
la supra ekzemplo, ŝanĝas de unu iteracio al la alia, estinte
**`i32`** tipo, kaj poste **`c32`** tipo je la sekva iteracio. Pro tiu
kialo, kaj por malgraŭe esti ebla, *for* bukloj trans opoj ne estas
malstatikaj, sed nur disvolvitaj dum kompilado. Tiu ŝanĝas nenion por
la uzantoj, sed valoras mencion, por malhelpi miskomprenon pri la
statika sistemo de tipoj, kiu povas ŝajni malstatika tie, sed tute ne
estas.


