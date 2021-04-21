# Modules

When creating a large project, it is very important to organize your
code. **Ymir** offers a system of modules, which is used to manage
different parts of the code that have different purposes. Each source
file in **Ymir** is a module.

## File hierarchy 

Let have a look at the following file hierarchy : 

```
.
├── main.yr
└── extern_modules
    ├── bar.yr
    └── foo.yr

1 directory, 3 files
```

<br>
In this file hierarchy there are three files, which contain modules, the
first module in the file `main.yr` will be named `main`. The second
one in the `extern_modules/bar.yr` file will be named `extern_modules::bar`,
and the third one in the `extern_modules/foo.yr` file will be named
`extern_modules::foo`.

To be properly importable, the module must be defined from the
relative path of the compilation, i.e. if the file is located in
`$(pwd)/relative/path/to/file`, its module name must be
`relative::path::to::file`.

The name of a module is defined by the first line of the source code,
by keyword `mod`. If this line is not given by the user, the path of
the module will only be the file name, so you will not always be able
to import the module, depending on its relative path. You can consider
this line mandatory for the moment. 

For example, in the file `foo.yr`, the first line must look like : 

```ymir
mod extern_modules::foo
```

<br>

And, it will therefore be importable everywhere, for example in the
`main` module, when writing the import declaration :

```ymir
import extern_modules::foo
```

<br> 

The syntax of the import statement is the following :

```grammar
import_statement := 'import' path (',' path)* (';')?
path := Identifier ('::' Identifier)* ('::' '_')?
```

## Sub modules

Sub modules are local modules, declared inside a global modules, are
inside another sub module. Unlike global module, the access to the
symbols defined inside them is not implicit. For that reason they have
to be explicitely mentionned when trying to access to their
symbols. This mention is done with the double colon binary operator
**`::`**, where the first operand is the name of the module, and the
second the name of the symbol to access.

```ymir
mod main
import std::io;

mod InnerModule {

	pub def foo () {
		println ("Foo");
	}

}

def main () {
	InnerModule::foo (); // access of the function declared in InnerModule
}
```

The access operator **`::`**, can also be used to access to symbols
declared inside global modules. This will be discussed after talking
about privacy of symbols.

## Privacy

All symbols defined in a module are private by default. The privacy of
a given symbol *s* refer to the possibility for foreign modules, and
symbols to access to this given symbol *s*. When a symbol *s* is
declared private in a module *s*, then only the other symbols of the
module *m* have access to it. Module privacy can be seen as a tree,
where a global module is a root, and module symbols are the branches
and leaves of the tree. In such a tree, symbols have access to their
parent, siblings, and the siblings of their parents. 

In the following figure an example of a module tree is presented,
where a global module named *A*, has three symbols, 2 sub modules
*A::X* and *A::Y*, and a function *A::foo*. In this tree, we assume
that every symbols are declared private. For that reason, the function
*A::foo* has access to *A*, *A::X*, *A::Y*, but not to *A::X::bar*,
nor *A::Y::baz*. The symbol *A::X::bar*, has access to every symbols
(*A*, *A::X*, *A::Y*, *A::foo*), except *A::Y::baz*.

<br>

<img src="https://gnu-ymir.github.io/Documentations/en/modules/tree.png" alt="drawing" height="300" style="display: block; margin-left: auto;  margin-right: auto;">

<br>

Global modules are always tree roots, for that reason they don't have
parents. For example, the module **`extern_modules::foo`**, does not
have access to the symbols declared inside the module
**`extern_modules`**, (if they are privates).

The keyword **`pub`** flag a symbol as *public*, and accessible by
foreign modules. This keyword can be used as a block, or for only one
symbol. Its syntax grammar is presented in the following code block.

```grammar
pub :=   'pub' '{' symbol* '}' 
       | 'pub' symbol	
```

### Example

1) Module *`extern_modules/foo.yr`*

```ymir
mod extern_modules::foo;

/**
 * foo is public, it can be accessed from foreign modules
 */
pub def foo () {}

/**
 * The bar function is private by default
 * Thus only usable in this module
 */
def bar () {}
```

<br>

2) Module *`main.yr`*

```ymir
/**
 * This importation will give access to all the symbols in the module
 * 'extern_modules::foo' that have been declared 'public'
 */
import extern_modules::foo

def main () {
    foo (); // foo is public we can call it
	bar (); // however, bar is private thus not accessible
}
```
Errors:
```error
Error : undefined symbol bar
 --> main.yr:(7,5)
 7  ┃     bar (); // however, bar is private thus not accessible
    ╋     ^^^
    ┃ Note : bar --> extern_modules/foo.yr:(8,5) : extern_modules::foo::bar is private within this context
    ┗━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

## Symbol conflict resolution

When two external global modules declare two symbols with the same
name, it may be impossible to know which symbol the user is refereing
to. In this case, the double colon operator **`::`** can be used with
the name of the module declaring the symbol to resolve the
ambiguity. To give an example of symbol conflict, let's say that we
have two module `extern_modules::foo` and `extern_modules::bar`
declaring a function with the same signature `foo`.

1) Module *`extern_modules/bar.yr`*
```ymir
mod extern_modules::bar
import std::io

pub def foo () {
	println ("Bar");
}
```
<br>

2) Module *`extern_modules/foo.yr`*
```ymir
mod extern_modules::foo
import std::io

pub def foo () {
	println ("Foo");
}
```

<br>

In the `main` module, both modules `extern_modules::bar` and
`extern_modules::foo`, are imported. The main function presented below
refers to the symbol **`foo`**. In that case, there is no way to tell
which function will be used, `extern_modules::foo::foo` or
`extern_modules::bar::foo`. The compiler returns an error. One can
note that this errors occurs only because the signature of the two
function `foo` are the same (taking no parameters), and they are both
public. If there was a difference in their prototypes, for example if
the function in the module `extern_modules::bar` would take a value of
type `i32` as parameter, the conflict would be resolved by itself, as
the call expression will be different.

3) Module *`main.yr`*

```ymir 
import extern_modules::bar, extern_modules::foo

def main () {
	foo ();
}
```
Errors:
```error
Error : {extern_modules::bar::foo ()-> void, extern_modules::foo::foo ()-> void, mod extern_modules::foo} x 3 called with {} work with both
 --> main.yr:(4,6)
 4  ┃ 	foo ();
    ╋ 	    ^
    ┃ Note : candidate foo --> extern_modules/bar.yr:(4,9) : extern_modules::bar::foo ()-> void
    ┃ Note : candidate foo --> extern_modules/foo.yr:(4,9) : extern_modules::foo::foo ()-> void
    ┗━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>


.page-inner {
  width: 95%;
}
In the above error, we can see that three modules are presented. The
two functions **`foo`** — in **`extern_modules::bar`**, and
**`extern_modules::foo`** — and the **`extern_modules::foo`** module
itself. Obviously, it is not possible to use the call operator
**`()`** on a module, that is why it is not presented as a possible
canditate in the notes of the error.

The conflict problem can be resolved by changing the calling
expression, and using the double colon operator **`::`**. In the
following example, the full name of the module is used. This is not
always necessary, as **`bar::foo`** is sufficient to refer to
**`extern_modules::bar::foo`**, and **`foo::foo`** for function
**`foo`** in **`extern_modules::foo`**.

```ymir
import extern_modules::bar, extern_modules::foo

def main () {
    extern_modules::bar::foo (); 
    extern_modules::foo::foo (); 
	
	foo::foo (); 
	bar::foo ();
}
```
Results:
```
Bar
Foo
Foo
Bar
```

<br>

## Public importation

As for all declaration, importation are private. It means that the
importation is not recursive. For example, if the module
`extern_modules::foo` imports the module `extern_modules::bar`, and the
module `main` import the module `extern_modules::foo`, all the public
symbols declared in `extern_modules::bar` will not be accessible in the
module `main`.

You can of course, make a `pub` importation, to make the symbols of
the module `extern_modules::bar` visible for the module `main`.

- extern_modules/foo.yr

```ymir
mod extern_modules::foo

pub import extern_modules::bar
```

- extern_modules/bar.yr

```ymir
mod extern_modules::bar
import std::io

pub def bar () {
	println ("Bar");
}
```

- main.yr

```ymir
mod main
import extern_modules::foo;

def main () {
	bar ();
}
```

## Include directory


You can use the `-I` option, to add a path to the include
directory. This path will be used as if it was the current `$(pwd)`. In
other words, if you add the `I -path/to/modules` option, and you have a
file in `path/to/modules/relative/to/my/file`, the name of the module
must be `relative::to::my::file`.

```bash
gyc -I ~/libs/ main.yr
```

This is how the standard library is included in the build, and how you
can access modules in `std::` that are not located in `$(pwd)/std/`.

## Compilation of modules

All modules must be compiled, the `import` declaration will not
compile external modules.  For example, if you compile only the `main`
module, you will get an error.

- main.yr 

```ymir
mod main
import extern_modules::foo;

def main () {
	foo ();
}
```

- extern_modules/foo.yr

```ymir
mod extern_modules::foo

pub def foo () {}
```

<br>

```
$ gyc main.yr
/tmp/ccCOeXDq.o: In function `_Y4mainFZv':
main.yr:(.text+0x3e): undefined reference to `_Y14extern_modules3foo3fooFZv'
collect2: error: ld returned 1 exit status
```

This means that the symbol `foo` declared in the module `extern_modules::foo` cannot be
found. So you have to write the command line.


```
$ gyc main.yr extern_modules/foo.yr
```

The way `gyc` works is similar to all the compilers in the `GCC`
suite, so the way to create libraries, object files, etc. is the same.
