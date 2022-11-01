# Variabloj kaj ŝanĝebleco

Oni deklaras variablojn uzante la ĉefvorton **`let`** (estu). La
gramatiko de variabla deklaracio estas priskribita en la sekva bloko el
kodo.

```grammar
var_deklaro := 'let' en_var_dekl (',' en_var_dekl)*
en_var_dekl  := (dekoro)* identigo (':' tipo)? '=' esprimo
dekoro := 'mut' | 'dmut' | 'ref'
identigo := ('_')* [A-z] ([A-z0-9_])*
```

Variabla deklaro estas komponita el kvar partoj, 1) la identigo kiu
estos uzita por krei referencon al la variablo ie alia en la programo, 2) la dekoroj, kiuj donos malsamajn sintenojn al la programo kiam ĝi
uzas la variablon, 3) valoro, kiu difinas la komencan valoron de la
variablo, kaj 4) tipo, maldeviga parto, kiu kiam ĝi ne estas skribita,
estas deduktita uzante la tipon de la komenca valoro de la
variablo. Male, kiam le tipo estas skribe difinita, la tipo de la
variablo estas statike certigita kaj komparita al la tipo de la
komenca valoro de la variablo.

## Tipo de variablo

La tipo de la variablo, kiel prezentita je la enkonduko de tiu ĉi
ĉapitro, estas specifita je la deklaro de la variablo. Tio implicas ke
ĉiuj tipoj de ĉiuj variabloj estas statike difinitaj, do variablo ne
povas ŝanĝi sian tipon dum ĝia vivdaŭro. Por ilustri tiun ideon, la
sekva fontkodo deklaras variablon kies tipo estas **`i32`** kaj provas
meti valoron kies tipo estas **`f32`** en ĝi. Ymir programlingvo ne
permesas ke tio okazas, do la tradukilo redonos eraron.

```ymir
def main () {
	let mut x = 12; // 12 estas litero de tipo i32 (fikskoma valoro)
	//  ^^^ tiu dekoro, prezentita je la malantaŭa sekcio malgravas por la momento
	
	x = 89.0f; // 89.0f estas litero de tipo f32 (glitkoma valoro)
}
```

La tradukilo, ĉar la fontkodo ne estas akceptebla *Ymir* programo,
redonas eraron. La eraro prezentita je la sekva bloko, informas ke la
variablo **`x`** de tipo **`i32`** malkongruas kun la valoro de tipo
**`f32`**.

```error
Error : incompatible types mut i32 and f32
 --> main.yr:(5,4)
 5  ┃ 	x = 89.0f; // 89.0f estas litero de tipo f32 (glitkoma valoro)
    ╋ 	  ^


ymir1: fatal error: 
compilation terminated.
```

## Ŝanĝebleco de variablo 

La dekoroj estas uzitaj por difini la sintenon kiu devas esti adoptita
pri la variablo.  La ĉefvorto **`ref`** kaj **`dmut`** estos
prezentitaj en alia ĉapitro (*cf.* [Alnomoj, Referencoj kaj
pureco](https://ymir-lang.org/en/advanced/README.html)). Por la
momento, ni nur parolos pri la ĉevorto **`mut`**. Tiu ĉefvorto estas
uzata por specifi ke la valoro de variablo estas ŝanĝebla. La valoro
de variablo deklarita sen tiu ĉefvorto estas malŝanĝebla, farante ke
ĝi estas definitiva.

Alie, se variablo estas deklarita malŝanĝebla, tiam ĝi estas ligita al
valoro, kiun la variablo ne povas ŝanĝi dum sia vivdaŭro. La ideo
malantaŭ tiu implicita malŝanĝebleco estas ke tio permesas eviti
erarojn, per devigi programistoj difini la variablojn kiuj estas
ŝanĝeblaj per sintakso intence pli parolema, dum ĉiuj aliaj variabloj
estas malŝanĝeblaj.

En la sekva fontkodo, la variable **`x`** kies tipo estas **`i32`**
estas deklarita.  Tiu variablo estas malŝanĝebla, (ĉar la dekoro
**`mut`** ne estas uzita). Tiam je la linio **7**, kiu provas ŝanĝi la
valoron de la variablo **`x`** estas malakceptebla por la
programlingvo, do la tradukilo redonas eraron.

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X valoras : ", x); 
	
	x = 3; 
	println ("X valoras : ", x);
}
```

Por tiu fontkodo, la tradukilo redonas la sekvan eraron. Tiu eraro
informas ke la asigno estas malpermesita, pro la eco de la variablo
**`x`** kiu estas malŝanĝebla. In *Ymir*, variabla ŝanĝebleco, kaj
tipa ŝanĝebleco certigas, tra statikaj kontroloj, ke kiam oni deklaras
variablon malŝanĝebla, estas neniu maniero por ŝanĝi la valoron de tiu
ĉi variablo uzante ĝin. Eĉ se tio povas esti frustra por la
programisto. Ni vidos en alia ĉapitro ke malŝanĝebla variablo povas
kelkfoje ne sufiĉi, sed ke estas aliaj manieroj por certigi ke valoro
neniam ŝanĝas por variablo.

```error
Error : left operand of type i32 is immutable
 --> main.yr:(7,2)
    ┃ 
 7  ┃ 	x = 3; 
    ┃ 	^


ymir1: fatal error: 
compilation terminated.
```

La antaŭa ekzemplo povas esti ŝanĝita por fari ke la variablo **`x`**
estu ŝanĝebla. Tiu ŝanĝo implikas la ĉefvorton **`mut`**, kiu — kiam
lokita antaŭ variabla identigo — faras ke ĝi estu ŝanĝebla. Danke al
tiu ŝango, la sekva fontkodo stas nun akceptebla, kaj tiam akceptita
de la tradukilo.

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X valoras : ", x); 
	
	x = 3; 
	println ("X valoras : ", x);
}
```

Rezulto:

```
X valoras : 2
X valoras : 3
```

Fakte, ŝanĝebleco ne vere rilatas al variabloj sed pli al
tipoj. *Ymir* programlingvo havas kompleksan sistemon pri ŝanĝebleco
de tipo, kies kompreno necesas antaŭe la komprenon de datenaj
tipoj. En la sekvaj ĉapitroj, pro tiu kialo, ni prezentos la sistemon
de tipo, (kaj ĉiujn la tipojn kiuj povas esti kreita en *Ymir* — *cf.*
ĉapitro [Datenaj
tipoj](https://ymir-lang.org/eo/primitives/types.html)), antaŭ ol ni
revenos al la prezento de datena ŝanĝebleco - kaj ol ni havos
kompletan bildon pri la sistemo de ŝanĝebleco en la ĉapitro [Alnomoj,
Referencoj kaj pureco](https://ymir-lang.org/eo/advanced/README.html).

## Komenca valoro

Variabloj estas **ĉiam** deklaritaj kun valoro. La celo estas certigi
ke ĉiuj valoroj de programo venas de ie, kaj ne estas asignitaj per
hazarda stato de la memoro de la maŝino kiu rulas la programon (kiel
povas esti en C lingvo).

Oni povas argumenti ke statika kontrolo povas esti uzita por certigi
ke la valoro de variablo estas ĉiam difinita antaŭ ol ĝi estas uzita,
kaj argumenti ke devigi ke oni difinas valoron je la deklaro de la
variablo ne estas la plej bona maniero por certigi tiun aferon. Se tio
pli temas pri opinio ol scienca argumento, ni pensas ke disigi la
komencasignojn de la variabloj igas la fontkodon pli malfacilaj por
legi. Plie malŝanĝeblaj variabloj estus ŝanĝeblaj por unu asigno kaj
unu sole, farigante la sintenon de la programo ankoraŭ pli malfacila
por kompreni.

La sekva tabelo prezentas du ekzemplojn de fontkodo, kiuj havas la
saman sintenon. Je la maldekstra parto, akceptabla fontkodo, kaj je la
dekstra parto malakceptabla fontkodo pro la argumentojn kiujn ni
priskribis.

<table>
<tr>
<th> A </th>
<th> B </th>
</tr>
<tr>
<td style="width: 50%;"><pre class="language-"><code class="lang-ymir"><span class="code-line"><span class="token keyword">import</span> <span class="token path">std</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token path">io</span><span class="token punctuation">;</span></span>
<span class="code-line"></span>
<span class="code-line"><span class="token keyword">def</span> <span class="token function">main</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="code-line">    <span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token other-keyword">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="code-line">        <span class="token number">42</span></span>
<span class="code-line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="code-line">        <span class="token number">7</span></span>
<span class="code-line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="code-line"><span class="token punctuation">}</span></span></code></i></pre></td>
<td style="width: 50%;"><pre class="language-"><code class="lang-ymir"><span class="code-line"><span class="token keyword">import</span> <span class="token path">std</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token path">io</span><span class="token punctuation">;</span></span>
<span class="code-line"></span>
<span class="code-line"><span class="token keyword">def</span> <span class="token function">main</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="code-line">    <span class="token keyword">let</span> i <span class="token punctuation">:</span> <span class="token basic-types">i32</span><span class="token punctuation">;</span></span>
<span class="code-line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token other-keyword">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="code-line">        i <span class="token operator">=</span> <span class="token number">42</span><span class="token punctuation">;</span></span>
<span class="code-line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="code-line">        i <span class="token operator">=</span> <span class="token number">7</span><span class="token punctuation">;</span></span>
<span class="code-line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="code-line"><span class="token punctuation">}</span></span></code></pre></td>
</tr>
</table>

Oni povas noti - pro la maldekstra ekzemplo - ke **`if`** (se) esprimo
havas valoron. La valoro estas komputita kiel la rezulto de la esprimo
(en tiu ĉi okazo la valoro estas **`42`** de tipo **`i32`**). Fakte
ĉiuj esprimoj en *Ymir* havas valoron, forigante la limon enkondukita
per la devigo de komenca valoro dum variabla deklaro.

## Mallokaj variabloj

Eĉ se mallokaj variabloj havas relative malbonan reputacion pro multe
da pravigeblaj kialoj, ni decidis lasi la eblon deklari ilin, pro ke
krome ili permesas kelkajn programajn paradigmojn kiuj estus maleblaj
alie.

Mallokaj variabloj estas deklaritaj kiel lokaj variabloj, krom ke la
ĉefvorto **`let`** estas anstataŭita per la ĉefvorto **`static`**
(statika). La sekva fontkodo prezentas uzon de malŝanĝebla malloka
variablo. Tiu estas nur ekzemplo, fakte en tiu ĉi okazo la uzo de
enumeracio (*cf.*  [Enum](https://ymir-lang.org/eo/types/enum.html))
estus probable pli konvena.

```ymir
import std::io

static pi = 3.14159265359

def main () {
	println ("Pi valoro estas : ", pi);
}
```

Ĉiuj informoj prezentitaj pri lokaj variabloj koncernas mallokaj
variabloj -- statika tipo, ŝanĝebleco, kaj komenca valoro. Neniu limo
ekzistas pri la valoro kiun oni povas uzi en malloka variablo, kaj
neniu limo ekzistas pri la formo de la komencasigno de malloka
valoro. Voko de funkcio, kontrola fluo, kreo de klaso, ktp. nenio
estis forgesita.

La komenca valoro de mallokaj variabloj estas asignitaj antaŭ ol la
pogramo mem komencas, alivorte antaŭ ol la funkcio **`main`** estu
vokita. Por ilustri tiun ideon, la sekva fontkodo kreas mallokan
variablon kies tipo estas **`i32`** kaj kiu estas asignita komence per
la redona valoro de la funkcio **`foo`**. Tiu funkcio **`foo`**
vokante la funkcion **`println`** skribas mesaĝon je la ŝelo, kaj
poste la **`main`** funkcio faras la saman aĵon.

```ymir
import std::io;

static __GLOBAL__ = foo ();

/**
  * Tiu funkcio skribas la mesaĝon "foo", kaj redonas la valoron 42
  */
def foo ()-> i32 {
  println ("foo");
  42
}

def main () {
	println ("__GLOBAL__ = ", __GLOBAL__);
}
```



Rezulto:

```
foo
__GLOBAL__ = 42
```

### Ordo de komencasigno

Estas neniu garantio pri la ordo de la komencasignoj de mallokaj
variabloj. Tio eble estas la unua granda limo de
*Ymir*. **Kontribuo**, permesi garantion estus vere bonvena, sed estas
vere malprobabla ke tio estus farebla kiam mallokaj variabloj venas de
malsamaj pakaĵoj.(*cf.*
[Pakaĵoj](https://ymir-lang.org/eo/modules/README.html)).

Por la momento ĉar estas malebla certigi ke malloka variablo estas jam
asignita kiam referenci ĝin antaŭ la komenco de la programo, estas
malakceptebla uzi mallokan variablon por komencasigni alian mallokan
variablon. Bedaŭrinde tiu kontrolo estas tre limigita ĉar la valoron
de malloka variablo povas esti uzita kiel redona valoro de funkcio,
kaj esti do uzita kiel komencvaloro de alia malloka variablo. La sekva
fontkodo ilustras tiun ideon.

```ymir
static __A__ = 42;
static __B__ = __A__; 
static __C__ = foo ();

def foo () -> i32 {
	__A__
}
```

La tradukilo bedaŭrinde nur kapablas vidi ke la komencasigno de la
variablo **`__B__`** dependas de la komencasigno de la variablo
**`__A__`**, kaj permesos la komencasignon de la variablo **`__C__`**
tra la funkcio **`foo`** malgraŭ ĝia dependo al la variablo
**`__A__`**. Eĉ se en ĉi tiu okazo la dependo estas relative evidenta,
ĝi povas esti multe pli malevidenta kiam la funkcio **`foo`** venas de
eksteran pakaĵon, kiu eksponas nur prototipon.

```error
Error : the global var main::__B__ cannot be initialized from the value of main::__A__
 --> main.yr:(2,8)
 2  ┃ static __B__ = __A__; 
    ╋        ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(1,8)
    ┃  1  ┃ static __A__ = 42;
    ┃     ╋        ^^^^^
    ┃ Note : 
    ┃  --> main.yr:(2,16)
    ┃  2  ┃ static __B__ = __A__; 
    ┃     ╋                ^^^^^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

## Ombro kaj regionoj

### Vivdaŭro

La vivdaŭro de variablo estas difinita per ĝia regiono. Kunmentante
esprimojn apartigitaj per punktokomoj inter kunigaj krampoj, regiono
estas semantika komponaĵo fama en programlingvoj. Ĝi havas kelkajn
apartaĵojn en *Ymir*, sed tiuj apartaĵojn estos priskribitaj en aliaj
ĉapitroj (*cf.*
[Funkcioj](https://ymir-lang.org/eo/primitives/functions.html),
[Regionaj gardantoj](https://ymir-lang.org/eo/errors/scope.html)) kaj
ne interesas nin por la momento.

```ymir
import std::io;

def main () {
    {
		let x = 12;
    } // x ne plu ekzistas post tiu fermsigno
    println (x);
}
```

Kiam variablo estas deklarita en regiono sed neniam uzita dum ĝia
vivdaŭro, la tradukila redonas eraron. Por eviti tiun eraron, la
variablo povas esti nomata **`_`**. Eĉ se ŝajnas senutila krei
variablon kiun oni neniam uzas, tio estas kelkfoje utila (ekzemple
kiam oni deklaras parametrojn de funkcio transŝarĝanta *cf.*
[Heredeco de
klaso](https://ymir-lang.org/eo/objects/inheritance.html)).

Variablo kies nomo estas **`_`**, estas anonima, tial estas neniu
maniero por referenci ĝin aŭ ĝia valoro.

```ymir
import std::io;

def main () {
    let _ = 12; // deklaras anoniman variablon
}
```

### Ombreco

Oni ne povas deklari du variablojn kun la sama nomo en koliziantaj
regionoj, t.e. se variablo estas deklarita per la nomo de vivanta
variablo, la programo ne estos akceptebla, kaj la tradukilo redonos
eraron pri ombreco. La sekva fontkodo ilustras tiu ideo, per deklari
tri variablojn kun la sama nomo **`x`**.

```ymir
def main () {
	let x = 1;	
	let x = 2;	
	{ 
		let x = 3; 
	}
}
```

La tradukilo redonas la sekvan eraron. Eĉ la deklaro de la lasta
variablo en la regiono malfermita je la linio **4** esta
malpermesa. Multe da eraroj povas esti evitaj per simple forigi tiun
eblon. Eblo kiu laŭ nia opinio ne permesas gajni ion aŭ ian ajn bona.

```error
Error : declaration of x shadows another declaration
 --> main.yr:(3,9)
 3  ┃     let x = 2;    
    ╋         ^
    ┃ Note : 
    ┃  --> main.yr:(2,9)
    ┃  2  ┃     let x = 1;    
    ┃     ╋         ^
    ┗━━━━━┻━ 

Error : declaration of x shadows another declaration
 --> main.yr:(5,13)
 5  ┃         let x = 3; 
    ╋             ^
    ┃ Note : 
    ┃  --> main.yr:(2,9)
    ┃  2  ┃     let x = 1;    
    ┃     ╋         ^
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

Mallokaj variabloj ne kreas ombrecan problemon kiam ili kolizias kun
lokaj variabloj. Malloka variablo estas malloka simbolo kaj estas
atingebla de ĝia patra pakaĵo (*cf.*
[Pakaĵoj](https://ymir-lang.org/eo/modules/README.html)). Lokaj
variabloj aliflanke estas atingeblaj nur en la funkcio kiu deklaris
ilin. La prioritato estas donita al lokaj simboloj antaŭ mallokaj,
sinteno ilustrita en la sekva fontkodo.

```ymir
mod Main; // deklaro de la pakaĵo 'Main'

import std::io;

static pi = 3.14159265359

def main ()
    throws &AssertError
{
    {
		let pi = 3;
		assert (pi == 3); // using local pi
    } // per malfermi la regiono, loka 'pi' ne plu ekzistas
	
    // ĉar loka pi ne plu ekzistas
	// malloka pi estas atingebla
    assert (pi == 3.14159265359);
	
	// malloka pi ĉiam povas esti atingita uzante la nomo de ĝia patra pakaĵo
    assert (Main::pi == 3.14159265359);
}
```

