# Variables and Mutability

Variables are declared with the keyword **`let`**. The grammar of a
variable declaration is presented in the following code block.

```grammar
var_declaration := 'let' inner_var_decl (',' inner_var_decl)*
inner_var_decl  := (decorator)* identifier (':' type)? '=' expression
decorator := 'mut' | 'dmut' | 'ref'
identifier := ('_')* [A-z] ([A-z0-9_])*
```

<br>

The declaration of a variable is composed of four parts, 1) the
identifier that will be used to refer to the variable in the program,
2) the decorators, that will give a different behavior to the program
regarding the variable, 3) a value, that sets the initial value of the
variable, and 4) a type, optional part of a variable declaration,
which when omitted is infered from the type of the initial value of
the variable. Conversely, when specified the type of a variable is
statically checked and compared to the initial value of the variable.

## Variable type

The type of the variable, as presented in the introduction, is
specified in the variable declaration. This implies a static typing of
each variable, whereby a variable cannot change its type during its
lifetime. To illustrate this point, the following source code declares
a variable of type **`i32`**, and tries to put a value of type
**`f32`** in it. The language does not accept this behavior, and the
compiler returns an error.

```ymir
def main () {
	let mut x = 12; // 12 is a literal of type i32
	//  ^^^ this decorator, presented in the following sub section, is not the point of this example
	
	x = 89.0f; // 89.0f is a literal of type f32 (floating point value)
}
```

<br>

The compiler, because the source code is not an acceptable *Ymir*
program, returns an error. The error presented in the following
block, informs that the variable **`x`** of type **`i32`**, is
incompatible with a value of type **`f32`**.

```error
Error : incompatible types mut i32 and f32
 --> main.yr:(5,4)
 5  ┃ 	x = 89.0f; // 89.0f is a literal of type f32 (floating point value)
    ╋ 	  ^


ymir1: fatal error: 
compilation terminated.
```

<br>

## Variable mutability 

The decorators are used to determine the behavior to adopt with the
variable. The keyword **`ref`** and **`dmut`** will be discussed in
another chapter (*cf.* [Aliases and
References](https://gnu-ymir.github.io/Documentations/en/advanced/)). For
the moment, we will be focusing on the keyword **`mut`**. This keyword
is used to define a mutable variable, whose value can be changed. A
variable declared without the **`mut`** keyword is declared immutable
by default, making its value definitive.

In another word, if a variable is declared immutable, then it is bound
the a value, that the variable cannot change throughout the
life of the variable. The idea behind default immutability is to avoid
unwanted behavior or errors, by forcing the developpers to determine
which variables are mutable with the use of a deliberately more
verbose syntax, while making all the other variables immutable.

In the following source code a variable **`x`** of type **`i32`** is
declared. This variable is immutable, (as the decorator **`mut`** is
not used). Then the line **7**, which consist in trying to modify the
value of the variable **`x`** is not accepted by the language,
that's why the compiler does not accept to compile the program.
<br>

```ymir
import std::io

def main () {
	let x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

<br>

For the given source file, the compiler generates the following
error. This error informs that the affectation is not allowed, due to
the nature of the variable **`x`**, which is not mutable. In *Ymir*,
variable mutability and, type mutability ensure, through static
checks, that when one declares that a variable has no write access to
a value, there is no way to get write access to the value through
this variable. Although this can sometimes be frustrating for the
user.

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

The above example can be modified to make the variable **`x`**
mutable. This modification implies the use of the keyword **`mut`**,
which — placed ahead of a variable declaration — makes it
mutable. Thanks to that modification, the following source code is an
acceptable program, and thus will be accepted by the compiler.

<br>

```ymir
import std::io

def main () {
	let mut x = 2;	
	println ("X is equal to : ", x); 
	
	x = 3; 
	println ("X is equal to : ", x);
}
```

<br>
Result:

```
X is equal to : 2
X is equal to : 3
```

<br> In reality, mutability is not related to variables, but to
types. This language proposes a complex type mutability system, whose
understanding requires the comprehension of data types beforehand. In
the following sections, we will, for that reason, present the type
system, (and the different types of data that can be created in *Ymir* — *cf.*  chapter [Data
types](https://gnu-ymir.github.io/Documentations/en/primitives/types.html)),
before coming back to the data mutability, — and have a full overview
of the mutability system in chapter [Aliases and
references](https://gnu-ymir.github.io/Documentations/en/advanced/).


## Initial value

A variable is **always** declared with a value. The objective is to
ensure that any data in the program came from somewhere, and are not
initialized from a random memory state of the machine executing the
program (as we can have in C language). 

One can argue, that static verification can be used to ensure that a
variable is set before being used, and argue that forcing an initial
value to a variable is not the best way to achieve data validity.  If
at this point, this is more a matter of opinion than of sound
scientific reasoning, we think that scattering the initialization of a
variable, makes programs more difficult to read. More, immutable
variables would be mutable for one affectation, making the
behavior of a program even more difficult to grasp. 

In the following table, is presented two examples of source code, with
the same behavior. On the left, a valid source code accepted by the
Ymir language, and on the right, a source code that is not accepted
based on the arguments we put forward. 

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


One can note from the left
program, that an **`if`** expression has a value. Value computed by
the result of the expression (in that case the value **`42`** of type
**`i32`**). In point of fact, every expression can have a value in
Ymir, removing the limitation, introduced by the forcing of an initial
value to variables.


## Global variables

Even if global variables have a rather bad reputation for many
justified reasons, we choose to let the possibility to define them,
since in spite of all, they allow some programmation paradigms that
would be undoable otherwise.

Global variables are defined as any local variable, except that the
keyword **`let`** is replaced by the keyword **`static`**. The
following source code presents an utilization of an immutable global
variable. This example is just a showcase, as the use of an
enumeration (*cf.*
[Enum](https://gnu-ymir.github.io/Documentations/en/types/enum.html))
would probably be more appropriate in this specific case.

```ymir
import std::io

static pi = 3.14159265359

def main () {
	println ("Pi value is : ", pi);
}
```

<br>

All information presented on local variables are relevant to the case
of global variables. Here, we are refering to static typing,
mutability behavior, and default value initialization. No limitation
exists on the value that can be stored inside a global variable, nor
there exists on the nature of the initialization. Call of functions,
conditional expressions, class initializations, etc., nothing was left
out.

Global variables are initialized before the start of the program,
before the call of the `main` function. To illustrate that, the
following source code, creates a global variable of type **`i32`**
initialized from the value of the function **`foo`**. This function
**`foo`** by making a call of the function **`println`**, prints a
message to the console, and the **`main`** function also does it.


```ymir
import std::io;

static __GLOBAL__ = foo ();

/**
  * This function print the message "foo", and returns the value 42
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

Result:

```
foo
__GLOBAL__ = 42
```

### Initialization order

There is no warranty on the order of initialization of global
variables. This is probably, the first limitation that we can point
out on the Ymir languages. **Contribution**, to allow such warranty would
be very welcomed, but seems unlikely to be possible when global
variables come from multiple modules (*cf.*
[Modules](https://gnu-ymir.github.io/Documentations/en/modules)).

For the moment, because it is impossible to certify the good
initialization of a global variable, before the start of the program, it
is not allowed to initialize a global variable from the value of
another global variable. However, this verification is very limited,
as the value of a global variable can be used inside a function, and
this same function used to initialize the value of another global
variable. In the following source code, this behavior is illustrated.

```ymir
static __A__ = 42;
static __B__ = __A__; 
static __C__ = foo ();

def foo () -> i32 {
	__A__
}
```

<br>

The compiler will unfortunetaly be able to see only the dependent
initialization of **`__B__`**, and will let the initialization of
**`__C__`** from the function **`foo`** occur. Even if in that
specific case, the dependency appears very clearly, it may not be that
clear when the function **`foo`** come from an external module, that
only provides its prototype.

## Shadowing and scope

### Lifetime

The lifetime of a variable is defined by a scope. Regrouping
expressions separated by semi-colons between curly brackets, a scope
is a semantic component well known in programming languages. It has
some particularities in Ymir, but these particularities will be
presented in forthcoming chapters
(*cf.* [Functions](https://gnu-ymir.github.io/Documentations/en/primitives/functions.html),
[Scope
guards](https://gnu-ymir.github.io/Documentations/en/errors/scope.html))
and are not of interest to us at this point.

```ymir
import std::io;

def main () {
    {
		let x = 12;
    } // x does not exists past this scope end
    println (x);
}
```

<br>

When a variable is declared inside a scope and is never used during
its lifetime the compiler returns an error. To avoid this error, the
variable can be named **`_`**. If it may seem useless to declare a
variable that is not used, it can be useful sometimes (for example
when declaring function parameters of an overriden function, *cf.*
[Class
inheritence](https://gnu-ymir.github.io/Documentations/en/objects/inheritance.html)).

A variable whose name is **`_`**, is anonymus, then there is no way to
retreive the value of this variable.

```ymir
import std::io;

def main () {
    let _ = 12; // declare a anonymus variable
}
```

### Shadowing

Two variables with the same name cannot be declared in colliding
scopes, i.e. if a variable is declared with the name of a living
variable in the current scope, the program is not acceptable, and the
compiler returns a shadowing error. The following source code
illustrates this point, where two variables are declared in the same
scope with the same name **`x`**.

```ymir
def main () {
	let x = 1;	
	let x = 2;	
	{ 
		let x = 3; 
	}
}
```

<br>

The compiler returns the following error. Even the last variable in
the scope opened at line **4** is not authorized. Many errors can be
avoided, by simply removing this possibility. Possibility, in our
opinion, that is not likely to bring anything of any benefit.

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

<br>

Global variables do not create variable shadowing problems on local
variables. A global variable is a global symbol, and is accessible
through its parent module definition (*cf.*
[Modules](https://gnu-ymir.github.io/Documentations/en/modules/)). Local
variables on the other hand, are only accessible for the function in
which they are declared. Symbol access gives the priority to local
variables, behavior illustrated in the following example.

```ymir
mod Main; // declaration of a module named Main

import std::io;

static pi = 3.14159265359

def main ()
    throws &AssertError
{
    {
		let pi = 3;
		assert (pi == 3); // using local pi
    } // by closing the scope, local pi does not exist anymore
	
    // because local pi does no longer exists
	// global pi is accessible
    assert (pi == 3.14159265359);
	
	// global pi can also be accessed from its parent module
    assert (Main::pi == 3.14159265359);
}
```

