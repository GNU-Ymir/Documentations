# Bazaj tipoj

En la *Ymir* programlingvo, ĉiuj valoroj havas difinitan tipon, kiu
indikas kiel la programo devas konduti sin, kaj kiel ĝi devas agi kun
la valoroj. *Ymir* estas statika programlingvo, tio volas diri le ĉiuj
tipoj de ĉiuj la valoroj devas esti konita je la momento de la
kompilo. Kutime, la kompililo kapablas detukti la tipojn el la
valoroj, kaj ĝenerale ne necesas ke oni specifu ilin deklarante la
variablojn. Se kelkfoje, kiam temas pri ekzemple ŝanĝebleco de
variabloj aŭ heredeco de kalso, la dedukto povas esti malprava kaj la
konduto de la programo ne taŭga al tio, kion oni volas fari. 

Konsekvence, la tipon oni povas aldoni kiam oni deklaras variablon,
kiel prezentas la sekva fontkodo.

```ymir
let mut x : [mut i32] = [1, 2];
let mut y = [1, 2];
```

<br>

Por kompreni la malsimileco inter la tipo de la variablo **`x`**, kaj
tiu de la variablo **`y`**, ni invitas vin legi la ĉapitro [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/).

Ĉiuj tipoj havas atributojn. Oni povas atingi tiujn atributojn uzante
la operatoron du dupunktoj **`::`** sur esprimo priskribanta tipon.

```ymir
let a = i32::init;  // i32 (0)
```

<br>

Ĉiuj bazaj tipoj havas komunajn atributojn, kiuj estas listitaj en la
tabelo malsupre. Atributoj povas esti ĉirkaŭtaj per la signo **`_`**,
por eviti ambiguecon kun kelkaj tipoj (*kp.*
[Enumeracio](https://gnu-ymir.github.io/Documentations/eo/types/enum.html)). Ekzemple,
la atribuo **`typeid`** estas ekvivalenta al **`__typeid__`** aŭ
**`_typeid`**.

| Nomo | Signifo |
| --- | --- |
| `init` | La baza valoro de la tipo (ĝi dependas de la tipo) |
| `typeid` |  La nimo de la tipo, enmetita en valoro kies tipo estas **`[c32]`** |
| `typeinfo` | Strukturo de tipo TypeInfo, enhavanta informojn pri la tipo |

Ĉiuj informoj pri **`TypeInfo`** estas prezentataj en la ĉapitro
[Dinamikaj
tipoj](https://gnu-ymir.github.io/Documentations/eo/types_advanced/).

## *typeof* kaj *sizeof*

1) La ĉefvorto **`typeof`** ekstraktas la tipon de valoro je la
momento de la kompilado. Tiu tipo, tiam povas esti uzita por iu ajn
kunteksto, por ekstrakti la tipan informon. Ekzemple, je variabla
deklaro, funkcia parametro, tipo de returno, struktura kampo, etc...

```ymir
import std::io;

def bar () -> i32 {
	42 
}

def foo () -> typeof (bar ()) {
	bar ()
}

def main () {
	let x : typeof (foo ()) = foo ();
	
	println (typeof (x)::typeid, " (", x, ")");
}
```

<br>

Rezultoj: 
```
i32 (42)
```

<br>

2) La ĉefvorto **`sizeof`** ekstraktas la grandecon de tipo en bitokoj
je la momento de la kompilado. Ĝi estas nur uzeblaj sur tipoj, ne sur
valoroj, sed la tipo de valoro povas ĉiam esti ekstraktita per la
ĉefvorto **`typeof`**. La grandeco estas stokita en valoro de tipo
**`usize`** (tiu skalara tipo estos prezentata malsupre).

```ymir
import std::io;

def main () {
	let x : usize = sizeof (i32);
	println (x, " ", sizeof (typeof (x)));
}
```

<br>

Rezulto: (uzante x86-64 maŝinon)

```
4 8
```

<br>

## Skalaraj tipoj

Skalaraj tipoj priskribas ĉiujn tipojn, kiuj enhavas nur unu
valoron. *Ymir* havas kvin bazajn skalarajn tipojn: entjeroj,
glitkomoj, skribsigno, buleo, kaj montriloj. Tiuj tipoj havas
malsamajn grandecojn, kaj estas uzataj por malsamaj celoj.

### Entjeraj tipoj

Entjero estas numbro, kiu ne havas flusanta punkto. Estas pluraj
entjeraj tipoj en *Ymir*, tiuj kiuj estas signaj kaj tiuj kiuj estas
malsignaj. Signaj kaj malsignaj temas pri la eblo de tiu tipo
reprezenti negativajn valorojn. La signaj entjeraj tipoj komencas kun
la litero **`i`**, kiam malsignaj entjeraj tipoj komencas kun la
litero **`u`**. La jena tabelo listas ĉiujn la entjerajn tipojn, kaj
ordigas ilin laŭ ilia grandeco en memoro.

| Grandeco | Signa | Malsigna |
| --- | --- | --- |
| 8 bitoj | i8 | u8 |
| 16 bitoj | i16 | u16 |
| 32 bitoj | i32 | u32 |
| 64 bitoj | i64 | u64 |
| arch | isize | usize |

La **`usize`** kaj **`isize`** tipoj dependas de la arĥitekturo de la
maŝino kiu rulas la programon, kaj havas la saman grandecon ol
montrilojn.

Ĉiuj signaj entjeraj tipoj povas stoki valorojn etendiĝante de
*-(2<sup>n - 1</sup>)* ĝis *2 <sup>n - 1</sup>*, kie *n* estas la
grandeco de la entjero en memoro. Malsignaj tipoj aliflanke, povas
stoki numbrojn kies amplekso etendiĝas de *0* ĝis *2<sup>n</sup> -
1*. Ekzemple, la tipo **`i8`** povas stoki valorojn etendiĝante de
*-128* ĝis *127*, kaj la tipo **`u8`** povas stoki valorojn
etendiĝante de *0* ĝis *255*.

Oni povas skribi entjerajn literojn laŭ du formoj, decimale `9_234` aŭ
deksesume `0x897A`. La signo **`_`** estas simple ignorita.


Kiel antaŭe indikita, ĉiuj tipoj havas atribuojn. La sekva tabelo
listas la atribuojn specifaj de la entjeraj tipoj.

| Name | Meaning |
| --- | --- |
| `max` | La plej granda valoro |
| `min` | La malplej granda valoro |

Kontrolo de Superfluo estas plenumita sur literoj dum la kompilado,
kaj eraro estas ĵetita de la kompililo se la entjera tipo uzita ne
povas kodi la valoron, pro ke ĝi estas tro larĝa. Ekzemple:

```ymir
def main () {
	let x : i8 = 934i8;
}
```

Ĉar **`i8`** povas nur stoki valoron, kiu iras de **`-127`** ĝis
**`128`**, la valoro **`934`** ne taŭgus. Pro tiu kialo, la kompilo
ĵetas la sekvan eraron.

```error
Error : overflow capacity for type i8 = 943
 --> main.yr:(12,18)
    ┃ 
12  ┃     let x : i8 = 943i8;
    ┃                  ^^^

ymir1: fatal error: 
compilation terminated.
```

<br>

**Averto** Se la valoron oni ne povas koni je la kompilada momento, la
superfluon oni ne povas kontroli, kaj stranga konduto povas
okazi. Ekzemple, se oni provas aldoni **`1`** al variablo de tipo
**`i16`**, kiu enhavas la valoron **`32767`**, la rezulto estos
**`-32768`**. **Kontribuo**: Krei dinamikan manieron por kontrolo
superfluo de aritmetika operacio (almenaŭ je sencimigado).

### Tipoj kun flusanta punkto


Tipoj kun flusanta punkto temas pri numbroj kiun oni ne povas kodi
per entjero, pro ke ili havas decimalan parton. *Ymir* proponas du
tipojn kun flusanta punkto, **`f32`** kaj **`f64`**, kiuj havas
grandecon de respektive 32 kaj 64 bitoj.

La prefikso **`f`** povas esti aldonita al la fino de litero, por
specifi ke ĝi temas pri **`f32`** anstataŭe **`f64`**, kiel estas
apriore.

```ymir
def main () {
	let x = 1.0; 
	let y : f32 = 1.0f;
}
```

La jena tabelo listas la atribuojn specifaj de la tipoj kun flusanta
punkto.

| Nomo | Signifo | 
| --- | --- |
| `init` | La unua valoro - `nan` | 
| `max` | La plej granda finia valoro, kiun la tipo povas kodi | 
| `min` | La malplej granda finia valoro, kun la tipo povas kodi | 
| `nan` | La valoro __Not a Number__ (ne iu nombro) |
| `dig` | La nombro de decimaloj de precizeco| 
| `inf` | La pozitiva valoro de nefinio | 
| `epsilon` | La malplej granda pliigo al la valoro **`1`** |
| `mant_dig` | Nombro da bitoj en la __mantiso__ |
| `max_10_exp` |  La plej granda entjera valoro, tiel ke $$10^{max\_10\_exp}$$ estas kodebla |
| `max_exp` | La plej granda entjera valoro, tiel ke $$2^{max\_exp-1}$$ estas kodebla | 
| `min_10_exp` | La malplej granda entjera valoro tiel ke $$10^{min\_10\_exp}$$ estas kodebla kiel norma valoro | 
| `min_exp` | La malplej granda entjera valoro, tiel ke $$2^{min\_exp-1}$$ estas kodebla kiel norma valoro | 


### Bulea tipo

Buleo estas tre simpla tipo, kiun havas nur du eblajn valorojn, aŭ
**`true`** (vera) aŭ **`false`** (malvera). Ekzemple : 

```ymir
def main () {
	let b = true;
	let f : bool = false;
}
```

<br>

La jena tabelo listas la atribuojn specifaj de la bulea tipo.

| Nomo | Signifo | 
| --- | --- |
| `init` | La unua valoro - `false` | 

### Skribsignaj tipoj

La **`c8`** kaj **`c32`** estas la tipoj uzitaj por kodi la
signojn. La **`c32`** skribsignoj havas grandecon de kvar bitokoj, kaj
povas stoki iun ajn unikodan valoron. Skribsignaj literoj povas esti
skribitaj laŭ du formoj, kaj estas ĉiam ĉirkaŭigitaj per la signo
**`'`**. La unua formo estas la signo ĝi mem ekzemple **`r`**, kaj la
dua estas la unikoda valoro de la signo, skribita kiel entjera litero,
kiel sekvas **`\u{12}`**, aŭ **`\u{0xB}`**.

Kiel kun entjeraj literoj, estas necesa ke oni aldonu prefikson je la
fino de la litero por sciigi la kompililon pri kiu tipo temas la
litero. La prefiksoj uzitaj por la skribsignaj tipoj estas **`c8`**,
se nenio estas precizigita, tiel la tipo estas **`c32`**.


```ymir
def main () {
	let x = '☺';	
	let y = '\u{0x263A}';
}
```

<br>

Se la signo en la litero estas tro larĝa por esti stokita en la
skribsigna tipo, eraron ĵetas la kompililo. Ekzemple:

```ymir
def main () {
	let x = '☺'c8; 
}
```

<br>

La sekva eraro, kiun estas ĵetita per la kompililo kompilante la
antaŭan ekzemplon, volas diri ke almenaŭ 3 bitokoj estas necesaj por
stoki la valoron, do ĝi ne taŭgas en nur unu bitoko (grando de
**`c8`**).

```error
Error : malformed literal, number of c8 is 3
 --> main.yr:(2,10)
    | 
 2  | 	let x = '☺'c8; 
    | 	        ^

ymir1: fatal error: 
compilation terminated.
```

<br>

La jena tabelo listas la atribuojn specifaj de la skribsignaj tipoj.

| Nomo | Signifo | 
| --- | --- |
| `init` | La unua valoro - `\u{0}` | 



### Montrilojn

Montriloj estas valoroj, kiuj stokas memorajn adresojn. Ili povas esti
uzitaj por stoki la lokon de datumo. En *Ymir*, oni konsideras ke
montrilo estas tre malalta programa konstruo, kaj estas ĉefe uzata en
la norma biblioteko, por interfaci kun semantiko de maŝina alteco. Oni
komplete povas srkibi programon sen bezoni montrilojn, kaj ni
rekomandas ke vi ne uzu ilin.

Montriloj estas difinitaj per la signo **`&`** sur tipo, aŭ sur
valoro. Ili estas ligeblaj valoroj (*kp.* [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/)).

```ymir
import std::io;

def main ()
    throws &SegFault, &AssertError
{
    let mut i = 12;
    let p : &i32 = &i; // kreo de montrilo stokanta la adreson de i
    i = 42;
    assert (*p == 42); // malreferenco de la montrilon, por atingi la valoron estanta al la adreso
}
```

<br>

Montriloj estas malsekuraj, kaj malreferenci montrilon povas krei
nedifineblan konduton, dependante de kie ĝi montras. Tio povas kelkfoje
ĵeti eraron de segmentado (*segmentation fault*) je la rulado de la
programo. Tiaj eraroj povas esti traktitaj, kiel estas prezentata en
la ĉapitro [Traktado de
eraroj](https://gnu-ymir.github.io/Documentations/eo/errors/main.html).


**Averto** Gardu enmense ke la eraro de segmentado povas ne okazi
kvankam la montrilo iras al disa adreso. La plej bona maniero por
eviti nedifineblan konduton estas ke oni ne uzu montrilojn kaj
anstataŭe uzu normajn funkciojn, aŭ semantike certigitajn konstruojn
(*kp.* [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/)).

<br>


La jena tabelo listas la atribuojn specifaj de la montrila tipo.

| Nomo | Signifo | 
| --- | --- |
| `inner` | La interna tipo - ekzemple : `i32` por `&i32` | 

## Kombinaj tipoj

Malkiel skalaraj tipoj, kombinaj tipoj povas enhavi plurajn
valorojn. Estas tri kombinaj tipoj en *Ymir*: opoj, amplekso, kaj
tabeloj.

### Opo

Opo estas finia vico de valoroj de malsimilaj tipoj. Opoj havas
fiksitan valenton. La valento de opo estas difinitaj je la kompila
momento, kaj priskribas la nombron de valoro, kiuj estas enhavitaj de
la opo. Ĉiuj elementoj de opo havas topon, kaj ordo. Opa litero estas
skribita uzante rondaj krampoj, kun komoj apartigante la valorojn. Opo
de unu valoro povas esti difinita, per meti komon post la unua valoro,
tuje sekvita de fermanta ronda krampo. Tiel la kompilo povas kompreni
ke temas pri opo, kaj ne nur pri prioritata esprimo.

```ymir
def main () {
	let t : (i32, c32, f64) = (1, 'r', 3.14);  // opo kun tri valoroj
	let t2 : (i32,) = (1,); // opo de unu valoro
	let t3 : i32 = (1); // simpla i32'a valoro
}
```

<br>

En la antaŭa ekzemplo, la opo **`t`** estas sola elemento, kaj povas
esti uzita kiel funkcia parametro aŭ kiel returna valoro de
funkcio. Oni povas ĝin apartigi, por repreni la valorojn, kiuj
komponas ĝin. Estas tri manieroj por disigi opon.


1) La punkto operatoro **`.`**, sekvita de entjera valoro, kiu estas
konita je la kompila momento. Tiu valoro povas esti komputita per
kompleksa esprimo tiel longe, kiel oni povas komputi ĝin je la kompila
momento (*kp.* [Rulado je kompila
momento](https://gnu-ymir.github.io/Documentations/en/templates/cte.html)).

```ymir
import std::io;

def main () {
	let t = (1, 'r', 3.14);
	let z : i32 = t._0;
	let y : c32 = t. (0 + 1); 
	println (t.2);
}
```

<br>

2) La sintakso de opa disigo. Tiu sintakso estas proksima al ties de
variabla deklaro, pro ke ĝi kreas novajn variablojn kiuj enhavos
parton de la opo, kiu estas disigota. En la sekva ekzemplo, oni povas
noti ke la sintakso de opa disigo povas esti uzita por disigi nur
kelkajn el la valoroj de la opo. La tipo de la variablo **`e`** estas
opo, kies ekzakta tipo estas **`(c32, f64)`**, kaj ĝiaj valoroj estas
**`('r', 3.14)`** kiam la variablo **`f`** enhavas la valoron **`1`**
de tipo **`i32`**.

```ymir
def main () {
	let t = (1, 'r', 3.14);
	let (x, y, z) = t;
	
	let (f, e...) = t;
	println (f, " ", e.0);
}
```

<br>

3) La ĉefvorto **`expand`** (etendi). Tiu ĉefvorto kreas reskribon je
la momento de la kompilado, kiu etendas la valorojn de la opo en
liston de valoroj. Tiu listo estas tiam uzita por krei aliajn opojn,
voki funkcion, ktp. La jena ekzemplo montras du uzon de la ĉefvorto
**`expand`**, unue por voki funkcion, kiu akceptas du parametrojn, kaj
dur por krei alian opon enhavanta tri valorojn.

```ymir
import std::io

def add (a : i32, b : i32) -> i32 
	a + b


def main () {
    let x = (1, 2);
	println (add (expand x)); 
	// ^^^^^^^^^^^^^^^^^^^^^^
	// Estos reskribita kiel 
	// println (add (x.0, x.1));
	
	let j : (i32, i32, i32) = (1, expand x);	
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	// reskribita en : (1, x.0, x.1)
}
```

<br>

Estas du aliaj manieroj por disigi opojn. Tiuj manieroj estas
prezentataj en alia ĉapitro. La jena tabelo listas la atribuojn
specifaj de opa tipo.

| Nomo | Signifo | 
| --- | --- |
| `arity` | La nombro da elemento, kiun la opo enhavas (en **`u32`** valoro) |
| `init` | Opa valoro, kie ĉiuj elementoj estas valorizitaj per `init` | 

### Amplekso

Amplekso estas tipo kiu enhavas valorojn difinantaj
intervalon. Ampleksa tipo estas nomita **`r!T`** kie **`T`** estas la
tipo de la valoroj kodantaj la limoj de la intervalo. Ampleksa litero
estas kreitaj per la signoj **`..`** aŭ **`...`**. Estas kvar valoroj
en amplekso, kiu estas stokitaj en kampoj, montrataj en la jena
tabelo. Tiuj kampoj estas atingeblaj per la punkto operatoro **`.`**.

| Nomo | Tipo | Valoro | 
| --- | --- | --- |
| fst | T | La unua limo |
| scd | T | La dua limo |
| step | mut T | La paŝo de la intervalo |
| contain | bool | Vera se kaj nur se la dua limo estas inkluzivita de la intervalo |

```ymir
def main () {
	let range : r!(i32) = 1 .. 8; 	
	let c_range : r!(i32) = 1 ... 8;
}
```

<br>

La funkcio **`step_by`** (per_paŝo), prenas amplekson kiel parametro,
kaj returnas alian amplekson kun alia paŝo. Tiu funkcio estas kerna
funkcio, do estas nenio por importi.

```ymir
def main () { 
	let range = (1 .. 8).step_by (2); 
} 
```

<br>

La ĉapitro [Gvidaj
fluoj](https://gnu-ymir.github.io/Documentations/en/primitives/control.html)
prezentas ekzemplojn kie la tipo amplekso estas uzinda.

### Tabelo

Tabelo estas kolekto da valoroj de la sama tipo, en koneksa
memoro. Malkiel opoj, la grandeco de tabelo estas nekonata je la
kompila momento, kaj en *Ymir*, tabeloj estas similaj al tranĉoj, do
ni nomos ilin tiel ekde nun. Tranĉaj literoj estas difinitaj kun
sintakso proksima al ties de opo, sed kun rektaj krampoj antastaŭ
rondaj, ekzemple **`[1, 2, 3]`**. La tipo de tranĉô estas ankaŭ
difinita kun rektaj krampoj, ekzemple **`[i32]`**, kiu volas diri ke
temas pri tranĉo enhavanta **`i32`**'ajn valorojn.

Litero de Signoĉeno, ĉirkaŭigita de duopaj citiloj **`"`** estas
specialaĵo de litero de tranĉo. Ne estas signoĉena tipo en *Ymir*, sed
nur tranĉaj tipoj. Pro tio, la tipo de signoĉeno estas **`[c32]`**, aŭ
**`[c8]`**, dependante de la tipo, kiun enhavas la tranĉo. Signoĉena
litero povas esti prefiksigita per la ĉefvorto **`s8`** aŭ **`s32`**
por determini la kodan sistemon, kiu estas uzata (utf-8 aŭ
utf-32). Apriore, kiam ne estas prefikso la signoĉena litero estas de
tipo **`[c32]`**.

```ymir
import std::io;

def main () { 
	let x = [1, 2, 3]; //  [i32] tranĉo
	let y = "Hello World !!"; // [c32] tranĉo
	let z = "Hello World !!"s8; // [c8] tranĉo
}
```

<br>

**Averto**: la longo de **`[c8]`** literoj povas ŝajni malvera pro la
koda sistemo. Ekzemple, la tranĉo **`"☺"s8`** havas longon de
**`3`**. Por resumi, **`[c8]`** tranĉoj estas kodata per la utf-8
sistemo, kiam **`[c32]`** per la koda sistemo.

Tranĉo estas duvortaj objekto, la unua vorto estas la longo de la
tranĉo, kaj la dua estas montrilo al la datumo stokita en la
tranĉo. Tranĉo estas ligebla tipo, kiu volas diri ke ĝia ŝanĝebleco
estas pli komplika ol la ŝanĝebleco de skalara tipo (krom montrilo),
ĉar ĝi pruntas memoron, kiu ne estas aŭtomate kopiita kiam atribuo al
alia variablo estas farita. Tio estas priskribita en la ĉapitro [Ligoj
kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/).

La kampo **`len`** permesas atingi la longon de la tranĉo uzante la
punkta operatoro **`.`**. La longo de tranĉo estas stokita kiel
**`usize`**'a valoro.

```ymir
import std::io
 
def main () {
   let x = [1, 2, 3];
   println ("The value of x : ", x); 
   println ("The length of x : ", x.len);
}
```

<br>

Simile, la **`ptr`** kampo, donas atingeblecon al la montrilo de la
tranĉo. La tipo de tiu montrilo dependas de la tipo de la tranĉo mem,
kaj estas neniam ŝanĝebla. Montrilo estas tute malgrava por preskaŭ
ĉiuj *Ymir*'aj programoj, kaj ni suspektas ke vi neniam bezonos
ilin. Ili estas difinitaj por fari malaltajn programadajn operaciojn,
kaj estas ĉefe uzitaj en la norma biblioteko.

Por atingi elementojn de la tabelo, la rektaj krampaj operatoro
**`[]`** estas uzata. Ĝi prenas aŭ entjera valoro aŭ amplekso kiel
parametro. Kiam amplekso estas donita, alia tranĉo, kiu pruntas parton
de la unua tranĉo estas kreita. La paŝo de la amplekso ne havas
efikon. **Kontribuo** eble oni povu aldoni tion. Alie, kiam entjera
valoro estas uzata, kiun ni nomos **`i`**, la valoro je la **`i`**'a
indekso estas returnita.

```ymir
import std::io;

def main () 
	throws &OutOfArray 
{
	let x = [1, 2, 3];
	let y = x [0 .. 2];
	let z = x [0];
	
	println (x, " ", y, " ", z); 
}
```

<br>

La longo de tranĉo estas nekonata je la momento de la kompilado, kaj
atingi la valorojn de la tranĉo povas esti farita kun dinamikaj
entjeroj, kies valoroj estas ankaŭ nekonataj je la kompila
momento. Pro tiu kialo, eblas ke la parametro uzita en la operatoro
iras post la longo de la tranĉo. Kun tio enmense, tranĉo estas
konsiderita malsekura, kaj povas ĵeti escepton de tipo
**`&OutOfArray`**. La escpeta sistemo, kaj traktado de eraroj estas
priskribita en la ĉapitro [Traktado de
eraroj](https://gnu-ymir.github.io/Documentations/eo/errors/main.html).

Tranĉoj povas esti kroĉitaj, por formi alian tranĉon. La kroĉo estas
farita per la tilda operatoro **`~`** sur du tranĉoj. Por konvene
funkcii kaj esti akceptebla de la programlingvo, la du tranĉoj devas
esti de la sama tipo (sed ne nepre kun la sama ŝanĝebleco, la
ŝanĝebleco la plej limiga estas uzata, *kp.* [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/)).

```ymir
import std::io

def foo () -> [i32] {
	[8, 7, 6]
}

def main ()  {
	println ([1, 2, 3] ~ foo ());
}
```

<br>
Rezultoj: 
```
[1, 2, 3, 8, 7, 6]
```
<br>

La tildan operatoron ni elektis, por eviti ambiguecon. En kelkaj
programlingvoj, kiel Java, la kroĉo estas farita uzante la adician
operatoron **`+`**, kio kelkfoje kreas kelkajn ambiguaĵojn kiam ĝi
kroĉas signoĉenojn kun aliaj elementoj kiel entjeroj. Ekzemple, la
esprimo **`"foo" + 1 + 2`** estas ambigua. Oni povas noti malgraŭe ke
ĉar kroĉo nur funkcias se oni uzas du tranĉojn de la sama tipo, la
esprimo **`"foo" ~ 2`** estas malakceptebla. Efektive **`"foo"`**
estas de tipo **`[c32]`** kaj **`2`** de tipo **`i32`**.

Alia sintakso povas esti uzata por krei tranĉojn. Tiu sintakso nomita
**`asigno de tranĉo`** asignas memoron en la amaso, kaj atribuas la
saman valoron al ĉiuj indeksoj de la tranĉo.

```ymir
import std::io
import std::random;

def main () {
	let a : [i32] = [0 ; new 100u64]; // tiu evitas ke oni skribu 100 nulojn
	                                  // sed la rezulto estas simila
							  
	let b = [12 ; new uniform (10, 100)]; 
	//                ^^^^^^^ kreas numbron hazarde inter la valoro 10 kaj 100
	println (a, " ", b);
}
```

<br>

La jena tabelo listas la atribuojn speciafaj de la tranĉa tipo.

| Nomo | Signifo | 
| --- | --- |
| `inner` | La interna tipo |
| `init` | Malplena tranĉo, kies longo estas 0 |

### Statika tabelo

Malkiel tranĉo, statika tabelo estas stokita en la stako anstataŭ sur
la amaso. Por ke tio eblas, la longo de statika tabelo devas esti
konata je la momento de la kompilado. La sintakso uzata por krei
statikajn tabelojn estas proksima al tiu de *asigno de tranĉo*, sed
sen la ĉefvorto **`new`**.

```ymir
import std::io

/**
  * Akceptas statikan tabelon de longo 12
  */
def foo (a : [i32 ; 12]) {
    println (a);
}

def main ()
    throws &OutOfArray
{
    let mut a : [mut i32 ; 12] = [0 ; 12];

    for i in 0 .. 12
        a [i] = i

    let b = [1; 12];

    foo (a);
    foo (b);
}
```

<br>

Statika tabelo povas esti transformita al tranĉo uzante la ĉefvortoj
**`alias`**, **`copy`** aŭ **`dcopy`**. La ĉapitro [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/en/advanced/)
prezentas tiujn vortojn.

```ymir
import std::io

def main () {
	let x : [i32; 12] = [0; 12];
	
	let a : [i32] = alias x;
	let b = copy x;
	
	println (a, " ", b);
}
```

<br>

Oni povas argumenti ke tranĉaj literoj devus krei valorojn de statikaj
tabeloj. Ni faris la malan elekton por eviti multvortecon, pro tio ke
laŭ nia opinio, tranĉoj estas multe pli oftaj ol statikaj tabeloj. Ni
estas konsideranta la eblon de aldoni prefikson al tranĉaj literoj por
krei statikan tabelon anstataŭe, sed la problemo ne estas jam solvita.

<br>

La jena tabelo listas la atribuojn specifaj de la tipo de statika
tabelo.


| Nomo | Signifo | 
| --- | --- |
| `inner` | La interna tipo |
| `len` | La longo de la tableo (`usize` valoro) |
| `init` | Statika tabelo, kie ĉiuj indekso estas valorizitaj kun la **`init`** valoro de la interna tipo | 

### Opcio

La opcia tipo estas uzata por difini ke valoro povas ekzisti aŭ
ne. Ili estas difinitaj kun la signo **`?`** sur tipo aŭ sur
valoro. Pliaj informoj pri opcioj estas prezentataj en la ĉapitro
[Traktado de
eraroj](https://gnu-ymir.github.io/Documentations/eo/errors/main.html),
pro tio ke ili estas tute ligitaj al la sistemo de traktado de eraroj.

```ymir
import std::io;

def main () {
    let i : i32? = (12)?; // opcia valoro enhavanta la valoro 12
    let j : i32? = (i32?)::err; // opcia valoro enhavanta neniun valoron
}
```

<br>

La valoro de opcia tipo povas atingebla uzante funkciojn de la norma
biblioteko, aŭ *skema kongruo*. En tiu ĉapitro, ni nur fokusiĝas sur
la funkcion **`unwrap`** (malvolvi), *skema kongruo* estas lasita por
alia ĉapitro (*kp.* [Skema
kongruo](https://gnu-ymir.github.io/Documentations/en/pattern)). La
funkcio **`unwrap`** de la pakaĵo **`std::conv`**, atingas la valoron
en la opcia valoro. Se neniu valoro estas en la opcio, la funkcio
ĵetas eraron de tipo **`&CastFailure`**.

```ymir
import std::io;
import std::conv;

def foo (b : bool)-> (i32)? {
	if b { 
		19? // returnas la valoron 19, volvita en opcio
	} else {
		(i32?)::__err__ // returnas malplenan valoron
	}
}


def main () 
	throws &CastFailure 
{
	let x = foo (true);
	println (x.unwrap () + 23);
}
```

<br>

La jena tabelo listas la atribuojn specifaj de la opcia tipo.

| Name | Meaning | 
| --- | --- |
| `err` | Malplena opcia valoro | 

## Kasto (konverto de tipo)

Kelkaj valoroj povas esti konvertitaj al valoroj de malsimilaj
tipoj. Tiu operacio estas farita uzante la ĉefvorto **`cast`**, kies
sintakso estas prezentata en la sekva kodbloko.

```grammar
cast_esprimo := 'cast' '!' ('{' tipo '}' | tipo) '(' esprimo ')'
```

<br>

En la sekva ekzemplo, la kasto de valoro de tipo **`i32`** al valoro
de tipo **`i64`** estas farata. Kiel oni diris pli frue, implicita
kasto estas malpermesita. La ŝanĝebleco de kastita valoro estas ĉiam
la saman ol la antaŭa valoro. **Averto** kasto povas krei perdon de
precizeco, aŭ eĉ signuma problemo.

```ymir
let a = 0;
let b : i64 = cast!i64 (a);
```

<br>

La jena tabelo listas la permesitajn kastojn de la bazaj tipoj : 

| De | Al |
| --- | --- |
| `i8` `i16` `i32` `i64` `isize` | `i8` `i16` `i32` `i64` `u8` `u16` `u32` `u64` `isize` `usize` |
| `u8` `u16` `u32` `u64` `usize` | `i8` `i16` `i32` `i64` `u8` `u16` `u32` `u64` `isize` `usize` `c8` `c32` |
| `f32` `f64` | `f32` `f64` |
| `c8` | `c8` `c32` `u8` |
| `c32` | `c8` `c32` `u32` |
| `&(X)` por `X` = iu ajn tipo | `&(void)` |

Kasto estas vere baza konverto de tipo, kaj devas esti uzata kun
zorgeco por bazaj operacioj. Ni vidos en venonta ĉapitro (*kp.*
[Dinamikaj konvertoj]()) kompleksan sistemon de konverto, provizita
per la norma biblioteko. Tiu sistemo povas esti uzita por transformi
valorojn al vere malsimilaj tipoj kaj kodaj sistemoj.

