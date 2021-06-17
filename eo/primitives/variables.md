# Variabloj kaj Ŝanĝebleco

Oni deklaras variablojn per la vorto **`let`**. La sintakso de deklaroj
de variablo estas prezentata en la sekva bloko da kodo.

```grammar
var_deklaro := 'let' ena_var_dekl (',' ena_var_decl)*
ena_var_dekl  := (dekoracio)* Nomo (':' tipo)? '=' esprimo
dekoracio := 'mut' | 'dmut' | 'ref'
Nomo := ('_')* [A-z] ([A-z0-9_])*
```

<br>

Deklaro de variablo konsistas el kvar partoj, 1) Iu nomo, kiu
estas uzita por referenci la variablon, 2) dekoracioj, kiuj donas
malsimilajn kondutojn al la programo rilate al la variablo, 3) valoro,
kiu estas la unua valoro de la variablo, 4) tipo, opcia parto de la
deklaro kiu, kiam ĝi mankas, estas induktita de la tipo de la unua
valoro asociita al la variablo. Alie, kiam la tipo estas donita, ĝi
estas kontrolita kaj devas kongrui kun la tipo de la unua valoro.

## Tipo de variablo

La tipo de la variablo, kiel prezentata je la enkonduko, estas
indikata je la deklaro de la variablo. Tio implicas statikan tipon por
ĉiuj variabloj, kies rezulto estas ke oni ne povas ŝanĝi la tipon de
variablo dum ĝia vivdaŭro. Por ilustri tiun ideon, la sekva fontkodo
deklaras variablon, kies tipo estas **`i32`**, kaj provas meti valoron
kies tipo estas **`f32`** en ĝi. La programlingvo ne akceptas tion, do
la kompililo ĵetas eraron.

```ymir
def main () {
	let mut x = 12; // 12 estas litero kun tipo i32
	//  ^^^ tiu dekoracio, prezentata en la sekva sekcio, ne gravas por la momento
	
	x = 89.0f; // 89.0f estas litero kies tipo estas f32 (valoro kun flosanta punkto)
}
```

<br> La kompililo, pro ke la fontkodo estas neakceptebla *Ymir*
programo, ĵetas eraron. La eraro, prezentata je la sekva bloko da
kodo, informas ke la variablo **`x`** de tipo **`i32`**, estas
malkongrua kun la valoro de tipo **`f32`**.

```error
Error : incompatible types mut i32 and f32
 --> main.yr:(5,4)
 5  ┃ 	x = 89.0f; // 89.0f estas litero kies tipo estas f32 (valoro kun flosanta punkto)
    ╋ 	  ^


ymir1: fatal error: 
compilation terminated.
```

<br>

## Ŝanĝebleco de variablo

Dekoracioj estas uzitaj por difini kiel trakti variablojn. La
ĉefvortoj **`ref`** kaj **`dmut`** estos priskribitaj en alia ĉapitro
(*kp.* [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/)). Por
la momento, ni nur parolos pri la vorto **`mut`**. Tiu ĉefvorto estas
uzita por difini ke la valoro de variablo estas ŝanĝebla. Variablo,
kiu estas deklarita sen tiu vorto **`mut`**, estas apriore
malŝanĝebla, farante ke ĝia valoro estas definitiva.

Alivorte, se variablo estas deklarita kiel malŝanĝebla, tiam ĝi estas
ligita al valoro, kiun la variablo ne povas ŝanĝi dum sia tuta
vivdaŭro. La ideo malantaŭ la apriora malŝanĝebleco estas malhelpi
nedeziratajn erarojn, per devigi la uzantojn, ke ili difinu kiujn
variablojn estas ŝanĝeblaj, kun la uzo de intece pli multvorta
sintakso, dum ĉiuj la aliaj variabloj estas malŝanĝeblaj.

En la sekva fontkodo variablo **`x`**, kies tipo estas **`i32`**,
estas deklarita. Tiu variablo estas malŝanĝebla, (ĉar la dekoracio
**`mut`** ne estas uzata). Poste la linio **7**, kiu konsistas el
provi ŝanĝi la valoron de la variablo **`x`**, estas malakceptita per
la programlingvo, do ankaŭ per la kompililo, kiu ĵetas eraron.

<br>

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X valoras : ", x); 
	
	x = 3; 
	println ("X valoras : ", x);
}
```

<br>

De la supra fontkodo, la kompililo ĵetas la sekvan eraron. Tiu eraro
informas ke la atribuo ne estas permesata, pro la naturo de la
variablo **`x`**, kiu estas malŝanĝebla. En *Ymir*, variabla
ŝanĝebleco, kaj tipa ŝanĝebleco certigas, per statikaj kontroloj, ke
kiam variablo estas deklarita kiel ne havanta skriban permeson al
valoro, do estas neniu maniero por gajni skriban permeson al tiu
valoro trans tiu variablo. Kvankam, tio povas esti kelkfoje frustra
por la uzanto.

```error
Error : left operand of type i32 is immutable
 --> main.yr:(7,2)
    ┃ 
 7  ┃ 	x = 3; 
    ┃ 	^


ymir1: fatal error: 
compilation terminated.
```

<br>

Oni povas ŝanĝi la antaŭan ekzemplon por farigi la variablon **`x`**
ŝanĝebla. Tiu ŝanĝo implicas la uzon de la ĉefvorto **`mut`**, kiu —
metita antaŭ la nomo de la variablo, je la deklaro — farigas ĝin
ŝanĝebla. Danke al tiu ŝanĝo, la sekva fontkodo estas nun akceptebla
programo, do estas akceptita de la kompililo.

<br>

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X valoras : ", x); 
	
	x = 3; 
	println ("X valoras : ", x);
}
```

<br>
Rezultoj:

```
X valoras : 2
X valoras : 3
```

<br> Fakte, ŝanĝebleco ne rilatas al variabloj, sed al tipoj. La
*Ymir* programlingvo proponas kompleksan sistemon de tipa ŝanĝebleco,
kies kompreno bezonas ke oni komprenas bone la datumajn tipojn
antaŭe. En la sekvaj sekcioj kaj ĉapitroj, pro tiu kialo, ni prezentos
la tipan sistemon (kaj la diversajn bazajn tipojn de datumo, kiujn oni
povas krei en *Ymir* - *kp.* [Datumaj
tipoj](https://gnu-ymir.github.io/Documentations/eo/primitives/types.html)),
antaŭ ol ni revenos al ŝanĝebleco, kaj ol ni havos tutan vidon de la
ŝanĝebleca sistemo en la ĉapitro [Ligoj kaj
Referencoj](https://gnu-ymir.github.io/Documentations/eo/advanced/).

## Unua valoro

Variablo **ĉiam** estas deklarita kun valoro. La celo estas ke oni
povu certigi ke ĉiuj datumoj venas de ie, kaj ne venas de hazarda
stato de memoro de la maŝino kiu plenumas la programon (kiel eblas en
*C* programlingvo).

Oni povas argumenti ke statikaj kontroloj povas esti uzitaj por
certigi ke variablo estu valorigita antaŭ ol ĝi estas uzita, kaj
argumenti ke devigi unuan valoron, ke ĝi ekzistu, ne estas la plej
bona maniero por plenumi datuman validecon. Se temas pli pri opinio ol
scienca rezono, ni pensas ke disigi la inicon de variablo, farigas
programon pli malfacila por legi. Plie, malŝanĝeblaj variabloj estus
ŝanĝeblaj dum unu asigno, farante la konduton de la programo ankoraŭ
pli malfacila por kompreni.


En la sekva tabulo estas montras du ekzemplojn de fontkodo, kies
kondutoj estas similaj. Je la maldekstra parto, valida fontkodo
akceptebla de la *Ymir* programlingvo, kaj je la dekstra parto,
fontkodo malakceptebla pro la argumentoj, kiujn ni prezentis.

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

Oni povas noti de la maldekstra programo, ke la **`if`** esprimo havas
valoron. Valoro komputita kiel la rezulto de la esprimo (je tiu okazo
la valoro **`42`** de tipo **`i32`**). Fakte, ĉiuj esprimoj povas havi
valoron en *Ymir*, forigante la limon, kiun ni enkondukis per la
devigo de unua valoro.




## Mallokaj variabloj

Kvankam mallokaj variabloj havas relative malbonan reputacion pro
multe da bonaj kialoj, ni decidis lasi la eblon difini ilin, pro tio
ke malgraŭ ĉio, ili permesas paradigmojn de programado, kiuj estus
maleblaj alie.

Mallokaj variabloj estas difinitaj kiel lokaj variabloj, krom ke oni
anstataŭigas la ĉefvorton **`let`** per la vorto **`static`**. La
sekva fontkodo prezentas uzon de malŝanĝebla malloka variablo. Tio
estas nur ekzemplo, ĉar uzo de enumeracio (*kp.*
[Enumeracio](https://gnu-ymir.github.io/Documentations/eo/types/enum.html))
estus probable pli bona por tiu speciala afero.

```ymir
import std::io

static pi = 3.14159265359

def main () {
	println ("La valoro de Pi estas : ", pi);
}
```

<br>

Ĉiuj informoj pri lokaj variabloj estas validaj por mallokaj
variabloj. Temas pri statika tipado, ŝanĝebleco, kaj unuaj valoroj. Ne
estas limoj pri la valoroj, kiuj povas esti uzitaj kiel unuaj valoroj
de mallokaj variabloj, nek estas limoj pri la formo de la inico. Voko
de funkcioj, kondiĉa esprimoj, kreo de objektoj, ktp. nenio estis
forgesita.


Mallokaj variabloj estas inicitaj antaŭ la komenco de la programo mem,
tio volas diri antaŭ ol la funkcio **`main`** estas vokita. Por
ilustri tiun punkton, la sekva fontkodo kreas mallokan variablon kies
tipo estas **`i32`**, kaj kiu estas inicita per voko de la funkcio
**`foo`**. Tiu funkcio **`foo`** per voki la funkcion **`println`**
skribas mesaĝon sur la **`ŝelo`**, poste la funkcion **`main`** faras
same.

```ymir
import std::io;

static __GLOBAL__ = foo ();

/**
  * Tiu funkcio skribas la mesaĝon "foo", kaj returnas la valoron 42
  */
def foo ()-> i32 {
  println ("foo");
  42
}

def main () {
	println ("__GLOBAL__ = ", __GLOBAL__);
}
```

<br>

Rezultoj:
```
foo
__GLOBAL__ = 42
```

### Ordo de inicoj

Estas neniu garantio pri la ordo de la inicoj de mallokaj
variabloj. Tiu estas verŝajne la unua granda limo, kiun oni povas noti
pri la programlingvo *Ymir*. **Kontribuo**, permesi tian garantion
estus tute bonvena kontribuo, sed ŝajnas malverŝajne ke tio estas ebla
kiam la mallokaj variabloj estas difinitaj en malsamaj pakaĵoj (*kp.*
[Pakaĵoj](https://gnu-ymir.github.io/Documentations/eo/modules)).

Por la momento, ĉar ne eblas certigi bonan ordon de inicoj de mallokaj
variabloj, antaŭ ol la program komencos, ne estas permesita inici
mallokan variablon per la valoro de alia malloka variablo. Tamen, tiu
kontrolo estas tre lima, ĉar la valoro de malloka variablo povas esti
kreita per voko de funkcio, kaj tiu funkcio povas uzi la valoron de
alia malloka variablo. La sekva fontkodo ilustras tiun konduton.

```ymir
static __A__ = 42;
static __B__ = __A__; 
static __C__ = foo ();

def foo () -> i32 {
	__A__
}
```

<br>

La kompililo bedaŭrinde nur kapablas vidi la dependan inicon de
**`__B__`**, kaj lasos la inicon de **`__C__`** funkcii. Eĉ se je tiu
speciala okazo la dependeco estas tre klare videbla, tio povas esti
pli malfacila se la funkcio **`foo`** estus difinita en malsama
pakaĵo, kaj se oni nur havus ĝian prototipon.



## Ombreco kaj amplekso

### Vivdaŭro

La vivdaŭro de variablo estas difinita per ĝia amplekso. Kunmetanta
esprimojn apartigitaj per punktokomoj, inter kunigaj krampoj, amplekso
estas semantika elemento, kiu estas bone konita en programlingvoj. Ĝi
havas kelkajn specialaĵojn en *Ymir*, sed tiuj estos prezentitaj en
venontaj ĉapitroj (*kp.*
[Funkcioj](https://gnu-ymir.github.io/Documentations/eo/primitives/functions.html),
[Gardanto de
amplekso](https://gnu-ymir.github.io/Documentations/eo/errors/scope.html)),
kaj ne interesas nin por la momento.



