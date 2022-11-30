# Bazaj datenaj tipoj

En *Ymir* programlingvo, ĉiuj valoroj havas statikan tipon de dateno,
kiu indikas kiel la programo devas funkcii kaj kiel ĝi devas operacii
kun la valoro. *Ymir* estas statike tipa programlingvo, tio volas diri
ke ĉiuj tipoj de ĉiuj valoroj estas konataj je la momento de la
traduko. Ĝenerale la tradukilo kapablas dedukti la tipojn de la
detanoj per ĝiaj valoroj, kaj ne necesas specifi la tipojn kiam oni
deklaras la variablojn. Sed kelkfoje, kiam temas pri ŝanĝebleco aŭ
heredeco de klaso ekzemple, la dedukto povas esti malvera kaj la
sinteno de la programo povas ne konveni al tio kion oni volas fari.

Pro tiu kialo, la tipo povas esti aldonita kiam oni deklaras
variablon, kiel ilustrita je la sekva fontkodo.

```ymir
let mut x : [mut i32] = [1, 2];
let mut y = [1, 2];
```

Por kompreni la diferencon inter la tipo de la variablo **`x`** kaj la
tipo de la variablo **`y`**, ni invitas vin legi la ĉapitron [Alnomoj,
Referencoj kaj pureco](https://ymir-lang.org/eo/advanced/README.html).

Ĉiuj tipoj havas tipan atributon. Tiuj atributoj estas atingeblaj
uzante la operacisimbolon dupunktoj **`::`** post la esprimo de tipo.

```ymir
let a = i32::init;  // i32 (0)
```

Ĉiuj bazaj tipoj havas komunajn atributojn kiuj estas listitaj en la
tabelo sube. Atributoj povas esti ĉirkaŭitaj de la signo **`_`**, por
eviti ambiguecon por kelkaj tipoj (*cf.*
[Enumeracio](https://ymir-lang.org/eo/types/enum.html). Ekzemple, la
atributo **`typeid`** (identigilo de tipo) estas ekvivalenta al
**`__typeid__`** aŭ al **`_typeid`**.

| Nomo | Senco |
| --- | --- |
| `init` | La norma valoro por la tipo (ekz. 0 por i32) |
| `typeid` |  la nomo de la tipo en **`[c32]`** valoro |
| `typeinfo` | Strukturo de tipo **`TypeInfo`** (informo pri tipo), enhavanta informojn pri la tipo |

La tipo **`TypeInfo`** estas priskribita en la ĉapitro [Dinamikaj
tipoj](https://ymir-lang.org/eo/objects/cast.html).

## *typeof* kaj *sizeof*

1) La ĉefvorto **`typeof`** (tipo de) permesas retrovi la tipon de
valoro je la momento de la traduko. Tiu tipo povas esti uzita kiel
ĉiuj ajn aliaj tipoj, por retrovi informi pri tipo. Ekzemple por
deklari variablon, deklari redonan tipon, aŭ deklari kampon de
strukturo, ktp..

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

Rezulto : 

```
i32 (42)
```

2) La ĉefvorto **`sizeof`** retrovas la dimension de tipo en bitokoj
je la momento de la traduko. Tio estas aplikebla nur al tipoj, ne al
valoroj, sed la tipo ĉiam povas esti retrovita per la ĉefvorto
**`typeof`**.  La dimensio de la tipo estas redonita en valoro de tipo
**`usize`** (tiu skalara tipo estas prezentita sube).

```ymir
import std::io;

def main () {
	let x : usize = sizeof (i32);
	println (x, " ", sizeof (typeof (x)));
}
```

Rezulto: (se oni rulas la programon sur x86-64 arĥitekturo)

```
4 8
```

## Skalaraj tipoj

Skalara tipo priskribas ĉiuj la tipoj enhavantaj nur unu
valoron. *Ymir* programlingvo havas kvin bazajn skalarajn tipojn:
fikskomaj, glitkomaj, tekstaj, bulea kaj adresaj tipoj. Ili povas havi
malsamajn dimensiojn depende de la sinteno kiun oni volas.

### Fikskomaj tipoj

Fikskoma tipo estas entjero kaj ili estas ĝenerale kontraŭstaritaj al
glitkomaj tipoj. Estas pluraj fikskomaj tipoj en *Ymir* programlingvo
kun aŭ sen signumo. Kun signumo aŭ sen signumo temas pri la ebleco por
entjero esti negativa. Fikskomaj tipoj jkn signumo komencas per la
litero **`i`**, kiam fikskomaj tipoj sen signumo komencas per la
litero **`u`**. La sekva tabelo listas la fikskomajn tipojn, ordigante
ilin laŭ datena dimensio.


| dimensio | kun signumo | sen signumo |
| --- | --- | --- |
| 8 bitoj | i8 | u8 |
| 16 bitoj | i16 | u16 |
| 32 bitoj | i32 | u32 |
| 64 bitoj | i64 | u64 |
| arĥ | isize | usize |

La tipoj **`usize`** kaj **`isize`** havas la saman dimension ol
adrestipon, kies dimensio dependas de la cela arĥitekturo (ekzemple 64
bitoj sur x86_64).

Fikskomaj tipoj kun signumo povas konservi valoron etendiĝante de *-(2
<sup>n - 1</sup>)* al *2 <sup>n - 1</sup> - 1*, kie *n* estas la
dimensio de la tipo je bitoj en memoro. Aliflanke fikskomaj tipoj sen
signumo povas konservi valoron etendiĝante de *0* al *2 <sup>n</sup> -
1*. Ekzemple la tipo **`i8`** povas konservi valoron etendiĝante de
*-128* al *127*, kaj tipo **`u8`** povas konservi valoron kurante
gamon de *0* al *255*.

Oni povas skribi entjeron je du malsimilaj formoj, decimala `9_234`
kaj deksesuma `0x897A`. La litero **`_`** estas simple ignorita kiam
estante en entjero.

Por certigi ke la litera valoro havu la ĝustan tipon, prefikso povas
esti aldonita je ĝia fino. Ekzemple por krei **`i8`**'n kun la valoro
**`7`**, la ĝusta litero estas **`7i8`**. Kiam neniu prefikso estas
aldonita je la fino de la litero, la programlingvo ĉiam elektas la
tipon **`i32`**.

Kiel oni indikis pli frue, ĉiuj tipoj havas atributojn. La sekva
tabelo listas la atributojn proprajn al fikskomaj tipoj.

| Nomo | Signifo |
| --- | --- |
| `max` | La plej granda valoro kiun la tipon povas konservi |
| `min` | La plaj malgranda valoro kiun la tipon povas konservi |

Kiam oni povas koni la valoron de la literoj je la momento de traduko,
la tradukilo kontrolas ĉu la valoro ne superŝutas la kapablon de la
tipo kiu estis elektita por enteni ĝin. Ekzemple en la sekva
fontkodo, la tipo ne taŭgas por la valoro :

```ymir
def main () {
	let x : i8 = 934i8;
}
```

Ĉar i8 nur povas enhavi valoron kurante gamon de `-127` ĝis `128`, la
valoro tipo ne taŭgas por `934`, do la tradukilo redonas la sekvan
eraron.

```error
Error : overflow capacity for type i8 = 943
 --> main.yr:(12,18)
    ┃ 
12  ┃     let x : i8 = 943i8;
    ┃                  ^^^

ymir1: fatal error: 
compilation terminated.
```

**Atentu** Kiam la valoron oni ne povas koni je la momento de la
traduko, la kontrolo ne povas esti farita kaj povas krei strangan
konduton. Ekzemple, se oni provas aldoni `1` al variablo de tipo `i16`
kies valoro estas `32767`, la rezulto estos `-32768`. *Kontribuo:*
Trovi manieron por dinamike kontrili kiam valoroj superfluas (almenaŭ
en *Debug* modo).

### Glitkomaj tipoj

Floating-point types, refer to numbers with a decimal
part. *Ymir* provides two types of floating point numbers, **`f32`**
and **`f64`**, which have a size of 32 bits and 64 bits respectively.

You can add the prefix **`f`**, at the end of a literal floating point
to specify that you want a **`f32`**, instead of a **`f64`** as it is
by default.

```ymir
def main () {
	let x = 1.0; 
	let y : f32 = 1.0f;
}
```

The following table lists the attributes specific to floating point
types.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `nan` | 
| `max` | The maximal finite value that this type can encode| 
| `min` | The minimal finite value that this type can encode| 
| `nan` | The value __Not a Number__ |
| `dig` | The number of decimal digit of precision | 
| `inf` | The value positive infinity | 
| `epsilon` | The smallest increment to the value `1` |
| `mant_dig` | Number of bits in the  __mantissa__ |
| `max_10_exp` | 	maximum int value such that $$10^{max\_10\_exp}$$ is representable |
| `max_exp` | maximum int value such that $$2^{max\_exp-1}$$ is representable| 
| `min_10_exp` | minimum int value such that $$10^{min\_10\_exp}$$ is representable as a normalized value| 
| `min_exp` | minimum int value such that $$2^{min\_exp-1}$$ is representable as a normalized value| 

### Boolean type 

A boolean is a very simple type that can take two values, either `true` or `false`.  For example:

```ymir
def main () {
	let b = true;
	let f : bool = false;
}
```

<br>

The following table lists the attributes specific to boolean type.

| Name | Meaning | 
| --- | --- |
| `init` | The initial value - `false` | 

### Tekstaj tipoj

La tipo **`c8`** and **`c32`** estas la tipoj uzitaj por kodigi la
tekstajn signokodojn. La dimensio de la **`c32`** estas kvar bitokoj,
kaj povas esti uzita por konservi unikodan valoron. Literaj signokodoj
povas esti skribita laŭ du malsamaj formoj, sed estas ĉiam
ĉirkaŭigitaj de la signo **`'`**. La unua formo estas la signokodo
mem, ekzemple `'r'`, kaj la dua estas uzante la unikodan valoron
ekzemple `\u{12}` aŭ `\u{0xB}`. Kiam la dua formo estas uzita, ambaŭ
decimala kaj deksesuma formoj povas esti uzitaj por priskribi la
unikodan valoron. Kiel por fikskomaj literoj deksesuma litero ĉiam
komencas per `0x`.

Kiel por alias literoj kiel fikskomaj literoj, necesas aldoni
prefikson je la fino de la litero por difini ke temas pri **`c8`**
anstataŭ **`c32`**. Se oni aldonas neniun prefikson la programlingvo
ĉiam elektas **`c32`**.

```ymir
def main () {
	let x = '☺';	
	let y = '\u{0x263A}';
}
```

Se la litero estas tro granda por taŭgi en la tipo, la tradukilo ĵetas
eraron, ekzemple:

```ymir
def main () {
	let x = '☺'c8; 
}
```

Le tradukilo ĵetas la sekvan eraron. Tiu eraro volas diri ke oni
bezonas tri bitokoj por konservi la valoron, sed nur unu estas
disponebla en la tipo **`c8`**, do ĝi ne taŭgas.

```error
Error : malformed literal, number of c8 is 3
 --> main.yr:(2,10)
    | 
 2  | 	let x = '☺'c8; 
    | 	        ^

ymir1: fatal error: 
compilation terminated.
```

Le sekva tabelo listas la atributojn proprajn al tekstaj tipoj.

| Nomo | Signifo | 
| --- | --- |
| `init` | La unua valoro - `\u{0}` | 

### Pointers

Pointer are values that stores an address of memory. They can be used
to store the location of a data in memory. In *Ymir*, pointers are
considered low level programming and are mainly used in the std, and
runtime to interface with machine level semantics. You can perfectly
write any program without needing pointers, and for that reason we
recomand to not use them.

Pointers are defined using the token **`&`** on types, or on
values. They are aliasable types, as they borrow memory (*cf.* [Aliasable
and
References](https://ymir-lang.org/eo/advanced/)).

```ymir
import std::io;

def main ()
    throws &SegFault, &AssertError
{
    let mut i = 12;
    let p : &i32 = &i; // creation of a pointer on i
    i = 42;
    assert (*p == 42); // dereference the pointer and access the value
}
```

<br>

Pointers are unsafe, and dereferencing a pointer can result in undefined
behavior depending on where it points. It can also sometimes raise a
segmentation fault. In **`Ymir`**, segmentation fault are recovered,
and an exception is thrown. Error handling is presented in chaper
[Error
Handling](https://ymir-lang.org/eo/errors/main.html).

**WARNING**, Note that the segmentation fault may not occur even if
  the pointer is not properly set. The easiest way to avoid undefined
  behavior is to not use pointers and use `std` verified functions, or
  other semantically verified elements (cf [Aliasable and
  References](https://ymir-lang.org/eo/advanced/)).

<br>

The following table lists the attributes specific to pointer types.

| Name | Meaning | 
| --- | --- |
| `inner` | The type of the inner value - for example : `i32` for `&i32` | 


## Compound types 

Unlike scalar types, the compound can contain multiple values.  There are
three types of compounds: the tuple, the range and the arrays.

### Tuple 

A tuple is a set of values of different types. Tuples have a fixed
arity. The arity of a tuple is defined at compilation time, and
represent the number of values contained inside the tuple. Each
element of a tuple has a type, and a given order. Tuples are built
between parentheses, by a comma-separated list of values. A tuple of
one value can be defined, by putting a coma after the first
value. This way the compiler can understand the desire of creating a
tuple, and do not confuse it with a normal expression between
parentheses.

```ymir
def main () {
	let t : (i32, c32, f64) = (1, 'r', 3.14);  // three value tuple
	let t2 : (i32,) = (1,); // single value tuple
	let t3 : i32 = (1); // single value of type i32
}
```

<br>

In the above example, the tuple `t`, is a single element, and can be
used as a function parameter or as a return value of a function. It
can also be destructured, to retrieve the values of its component
elements. There are three ways of tuple destructuring.

1) the dot operator **`.`**, followed by an integer value, whose value
is known at compilation time. This value can be computed by a complex
expression, as long as the compiler is able to retreive the value at
compilation time (*cf.* [Compilation time
execution](https://ymir-lang.org/eo/templates/cte.html)).

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

2) the tuple destructuring syntax. This syntax, close to variable
declaration, creates new variables that contains parts of the tuple
that is destructured. In the following example, one can note that the
tuple destructuring syntax allows to extract only some of the tuple
values. The type of the variable **`e`** is the tuple **`(c32,
f64)`**, and its values are **`('r', 3.14)`**, when the variable
**`f`** contains the value **`1`** of type **`i32`**.

```ymir
def main () {
	let t = (1, 'r', 3.14);
	let (x, y, z) = t;
	
	let (f, e...) = t;
	println (f, " ", e.0);
}
```

<br>

3) the keyword **`expand`**. this keyword is a compile-time rewrite,
that expands the values of a tuple into a list of values. This list is
then used to create other tuples, call functions, etc. The following
example shows the use of the keyword **`expand`** to call a function
taking two parameters, with the value of a tuple containing two
values. 

```ymir
import std::io

def add (a : i32, b : i32) -> i32 
	a + b


def main () {
    let x = (1, 2);
	println (add (expand x)); 
	// ^^^^^^^^^^^^^^^^^^^^^^
	// Will be rewritten into : 	
	// println (add (x.0, x.1));
	
	let j : (i32, i32, i32) = (1, expand x);	
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	// rewritten into : (1, x.0, x.1)
}
```

<br>

There is two other ways to destructurate a tuple. These ways are
presented in forthcoming chapters. The following table lists the
attributes specific to tuple types.

| Name | Meaning | 
| --- | --- |
| `arity` | The number of elements contained in the tuple (in a **`u32`**) |
| `init` | a tuple, where each element values are set to `init`  | 

### Ranges

Ranges are types that contain values defining an interval. A range is
named **`r!T`**, where **`T`** is the type of the range limits. They
are created by the token **`..`** and **`...`**. A range consists of
four values, which are stored in the fields shown in the following
table. These fields can be accessed using the dot operator **`.`**.

| name | type | value | 
| --- | --- | --- |
| fst | T | the first bound |
| scd | T | the second bound |
| step | mut T | the step of the interval |
| contain | bool | Is the scd bound contained in the interval ? |

```ymir
def main () {
	let range : r!(i32) = 1 .. 8; 	
	let c_range : r!(i32) = 1 ... 8;
}
```

<br>

The `step_by` function takes a range as a parameter and returns a new
range, with a modified step. This function is a core function, thus
there is nothing to import.

```ymir
def main () { 
	let range = (1 .. 8).step_by (2); 
} 
```

<br>

The [Control
flows](https://ymir-lang.org/eo/primitives/control.html)
section shows a use of these types.

### Arrays 

An array is a collection of values of the same type, stored in
contiguous memory.  Unlike tuples, the size of an array is unknown at
compile time, and in *Ymir*, they are similar to slices, and will be
refered as such. Slices are defined with a syntax close to the one of
tuple, but with brackets instead of parentheses, for example **`[1, 2,
3]`**.  The type of a slice is also defined using the brackets, for
example **`[i32]`**, meaning a slice containing **`i32`** values.

String literals, enclosed between double quotes are a special case of
slice literals. There is no string type in *Ymir*, but only slices
type. Because of this, string values are typed **`[c32]`** or
**`[c8]`** depending on the type of values contained in the
slice. String literals can be prefixed with the keyword **`s8`** or
**`s32`** to define the encoding system used. By default, when no
prefix is specified a string literal have a type **`[c32]`**. 

```ymir
import std::io;

def main () { 
	let x = [1, 2, 3]; // a [i32] slice
	let y = "Hello World !!"; // a [c32] slice
	let z = "Hello World !!"s8; // a [c8] slice
}
```
<br>

**Warning**: The length of a **`[c8]`** literals can seem incorrect
due to the encoding system. For example, the slice **`"☺"s8`** have a
length of **`3`**. To summarize, **`[c8]`** slices are utf-8 encoded
string literals, when **`[c32]`** are encoded in utf-32.
 
A slice is a two-word object, the first word is the length of the
slice, and the second is a pointer to the data stored in the slice. A
slice is an aliasable type, its mutability is a bit more complicated
than the mutability of scalar types (except pointers), because it
borrows memory which is not automatically copied when an assignment is
made. This section will not discuss the mutability of internal types
or aliasable types. This is discussed in the chapter [Aliases and
References](https://ymir-lang.org/eo/advanced/).
 
The field **`len`** records the length of the slice and can be
retrieved with the dot operator **`.`**.  The length of the slice is
stored in a **`usize`** field.
 
```ymir
import std::io
 
def main () {
   let x = [1, 2, 3];
   println ("The value of x : ", x); 
   println ("The length of x : ", x.len);
}
```

<br>

Similarly, the **`ptr`** field, gives access to the pointer of the
slice and its types depend on the inner type of the slice, and is
never mutable. Pointer type are absolutely not important for a
*Ymir* program, and we suspect that you will never have use of
them. They are defined to allow low level programming paradigms, and
are used in the std and runtime. 

To access the elements of an array, the **`[]`** operator is used. It
takes either an integer value or a range value as parameter. If a
range value is given, a second slice that borrows a section of the
first is created. For now, the step of the range does not affect the
borrowing of the array. *Contribution* can be made here. On the other
hand if an integer value **`i`** is given as parameter, the value at
the index **`i`** is returned.
 
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

The length of a slice is unknown at compilation time, and access can
be made with dynamic integers whose values are also unknown at
compilation time. For that reason, it may happen that the parameters
used go beyond the slice length. With this in mind, slice access is
considered unsafe, and can throw an exception of type
**`&OutOfArray`**. The exception system, and error handling is
detailed in the chapter [Error
Handling](https://ymir-lang.org/eo/errors/main.html).

Slices can be concatenated, to form another slice. The concatenation
is made using the operator tilde on two operands. To work properly and
be accepted by the language, the two slice used as operands must share
the same type (but not necessarily mutability level, the mutability of
the operand with the lowest mutability level is choosed for the result
of the operation *cf.* [Aliases and
References](https://ymir-lang.org/eo/advanced/)).

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
Results: 

```
[1, 2, 3, 8, 7, 6]
```

<br>

The tilde token was chosen to avoid some ambiguity. In some languages
such as Java, the concatenation is made using the token **`+`** that
sometimes creates some ambiguity when concatenating strings, and other
elements such as integers. For example, the expression **`"foo" + 1 + 2`**, is ambiguous. 
One can note however, that since concatenation only works on slices of
the same type, the following expression `"foo" ~ 2`, is invalid as
"foo" is of type **`[c32]`**, and **`2`** of type **`i32`**.

Another syntax can be used to create slices. This syntax called *slice
allocation*, allocates a slice on the heap and set the same value to
every element of the slice.

```ymir
import std::io
import std::random;

def main () {
	let a : [i32] = [0 ; new 100u64]; // this avoids the write of 100 zeros
	                                  // but the result is the same
							  
	let b = [12 ; new uniform (10, 100)]; 
	//                ^^^^^^^ generates a random value between 10 and 100
	println (a, " ", b);
}
```

<br>

The following table lists the attributes specific to slice types.

| Name | Meaning | 
| --- | --- |
| `inner` | the inner type |
| `init` | an empty slice (with `len == 0us`) |

### Static Arrays

Unlike the slice, static arrays are stored in the stack rather than on
the heap. To be possible, their size must be known at compilation
time. The syntax used to create a static array is close to the syntax
of a *slice allocation*, but the keyword **`new`** omitted.

```ymir
import std::io

/**
  * Takes an array of size twelve as parameter
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

A static array can be transformed into a slice using the `alias`,
`copy` and `dcopy` keywords. The chapter [Aliases and
references](https://ymir-lang.org/eo/advanced/)
explains the difference between these keywords.

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

One can argue that slice literals should be of static array type. We
made the choice to create slices from array literals rather than
static arrays to avoid verbosity, as we claim that slices are way more
commonly used than arrays with a static size. We are for the moment
considering the possibility to prefix slice literals, to define static
array literals, but the question is not yet decided.

<br>

The following table lists the attributes specific to array types.

| Name | Meaning | 
| --- | --- |
| `inner` | the inner type |
| `len` | the len of the array (`usize` value) |
| `init` | an array where each element is set to the `init` value of the inner type | 

### Option

The option typed values are values that may be set or not. They are
defined using the token **`?`** on types or values. Further
information on option type are given in the chapter [Error
handling](https://ymir-lang.org/eo/errors/main.html),
as they are completely related to error management system. 

```ymir
import std::io;

def main () {
    let i : i32? = (12)?; // an option type containing the value 12
    let j : i32? = (i32?)::err; // an option value containing no value
}
```

<br>

The value of an option type can be retreived using functions in the
std, or pattern matching. In this chapter, we only focus on the
**`unwrap`** function, pattern matching being left for a future
chapter (*cf.* [Pattern
matchin](https://ymir-lang.org/eo/pattern)).  The
function **`unwrap`** from the module **`std::conv`**, get the value
contained inside an option type. If no value is contained inside the
option, the function throws an error of type **`&CastFailure`**.

```ymir
import std::io;
import std::conv;

def foo (b : bool)-> (i32)? {
	if b { 
		19? // return the value 19, wrapped into an option
	} else {
		(i32?)::__err__ // return an empty value
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

The following table lists the attributes specific to option types.

| Name | Meaning | 
| --- | --- |
| `err` | An empty option value | 

## Cast 

Some value can be transformed to create value of another type. This
operation is done with the **`cast`** keywords, whose syntax is
presented in the code block below.

```grammar
cast_expression := 'cast' '!' ('{' type '}' | type) expression
```

<br>

In the following example, a cast of a value of type **`i32`** to a
value of type **`i64`** is made. As said earlier, implicit casting is
not allowed. The mutability of the casted value is always lower or
equal to the mutability of the original value (for obvious reason).
**Warning** cast can cause loss of precision, or even sign problems.

```ymir
let a = 0;
let b : i64 = cast!i64 (a);
```

<br>

The following table list the authorized casts of the primitive types : 

| From | To |
| --- | --- |
| `i8` `i16` `i32` `i64` `isize` | `i8` `i16` `i32` `i64` `u8` `u16` `u32` `u64` `isize` `usize` |
| `u8` `u16` `u32` `u64` `usize` | `i8` `i16` `i32` `i64` `u8` `u16` `u32` `u64` `isize` `usize` `c8` `c32` |
| `f32` `f64` | `f32` `f64` |
| `c8` | `c8` `c32` `u8` |
| `c32` | `c8` `c32` `u32` |
| `&(X)` for `X` = any type | `&(void)` |


Cast if a very basic type transformation, and must be used with
precaution for basic operations. We will see in a forthecoming chapter
(*cf*. [Dynamic conversion]()) a complex system of conversion, provided
by the standard library. This conversion system can be used to
transform value of very different type and encoding.
