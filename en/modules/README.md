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

In this hierarchy we have three files, which contain modules, the
first module in the file `main.yr` will be named `main`. The second
one in the `extern_modules/bar.yr` file will be named `extern_modules::bar`,
and the third one in the `extern_modules/foo.yr` file will be named
`extern_modules::foo`.

To be properly importable, the module must be defined from the
relative path of the compilation, i.e. if the file is located in
`$(pwd)/relative/path/to/file`, its module name must be
`relative::path::to::file`.

The name of a module is defined by the first line of the source code,
by keyword `mod`. If this line is not given by the user, the
path of the module will only be the file name, so you will not always
be able to import the module, depending on its relative path.

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
path := Identifier ('::' Identifier)*
```

## Privacy

All symbols defined in a module are private by default. Only modules
that have declared the symbol have access to it. With the keyword
`pub` you can export the symbol for an external modules, which will then
have access to the symbol.

For example, with file `foo.yr` filled as follows : 

```ymir
mod extern_modules::foo;

// foo is public, it can be accessed from external modules
pub def foo () {}

// The bar function is private by default
// Thus only usable in this module
def bar () {}
```

<br>

And the file `main.yr` as follows. The `main` module, will only have
access to the `foo` function, which is declared in the
`extern_modules::foo` module.

```ymir
// This importation will give access to all the symbols in the module
// 'extern_modules::foo' that have been declared 'public'
import extern_modules::foo

def main () {
    foo (); // foo is public we can call it
//  ^^^
// Try to replace foo by bar, it is not public
}
```

<br>

The keyword `pub` can be used as a block to cover multiple
declarations. The syntax of the pub qualifier is described in the
following code block, and an example of utilization is presented in
the block underneath.

```grammar
pub_statement := 'pub' ('{' declaration* '}')
                       | (declaration)
```

<br>

```ymir
mod extern_modules::foo

pub {
	def foo () {}
	
	def bar () {}
}

pub def baz () {}
```

## Sub modules

It is possible to declare sub-module that are part of a global module,
with the keyword `mod`. Unlike global modules, you have to name them
when you want to access the symbols declared inside them. An example
of inner module is presented in the following code block.

```ymir
mod main
import std::io

// Declaration of a module named InnerModule
// This module is private, thus only accessible for the module main
mod InnerModule {

    	// Declaration of a function foo inside the module
	// It is public, so the module main can access it
	pub def foo () {
		println ("Foo");
		bar ();
	}

	// Declaration of a private function bar
	// only symbols declared in the module InnerModule have access to it
	def bar () {
		println ("Bar");
	}
}

def main () {
    	 // There is no problem to access the function foo that is public
	InnerModule::foo ();

	// However the function bar is private
	InnerModule::bar ();
}
```

<br>

The above source code won't compile as 'main' function declared in
'main' module try to have access to the function 'bar' declared
private in the module 'InnerModule'. The compiler will return the
following error.

```error
Error : undefined sub symbol bar for element main::InnerModule
 --> main.yr:(27,16)
    ┃ 
27  ┃     InnerModule::bar ();
    ┃                ^^^^^
    ┃ Note : bar --> main.yr:(17,9) : bar is private within this context
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

The privacy system is the same as for the global module. A module is a
symbol, so its privacy is the same as the privacy of functions,
structure, class, etc. Only the main module will have access to the
sub-module `InnerModule` in the example above. Meaning that importing
the module `main` won't give access to `main::InnerModule`. This can
be changed by adding the qualifier `pub` to the module `InnerModule`.

## Symbol conflict resolution

When two external global modules declare two symbols with the same
name, it may be impossible to know which symbol you want to use. In
this case, you can use the full name of the symbol to resolve the
ambiguity. To give an example of symbol conflict, let's say that we
have two module `extern_modules::foo` and `extern_modules::bar`
declaring a function with the same signature `foo`.

```ymir
mod extern_modules::bar
import std::io

pub def foo () {
	println ("Bar");
}
```
<br>

```ymir
mod extern_modules::foo
import std::io

pub def foo () {
	println ("Foo");
}
```

In the `main` module, we import both modules `extern_modules::bar` and
`extern_modules::foo`, and try to call the function `foo`. In that
case, there is no way to tell which function will be used,
`extern_modules::foo::foo` or `extern_modules::bar::foo`. And the
compiler will return an error. One can note that this errors occurs
only because the signature of the two function `foo` is the same, if
there was a difference, for example the function in the
`extern_modules::bar` module took a `i32` as parameters, the conflict
would be resolved by itself, as the call expression will be different.

```ymir 
import extern_modules::bar, extern_modules::foo

def main () {
	foo ();
}
```

<br>

```error
Error : Multiple Symbols : {extern_modules::bar::foo ()-> void} x 2 called with {} work with both
 --> main.yr:(4,9)
    ┃ 
 4  ┃     foo ();
    ┃         ^
    ┃ Note : candidate foo --> extern_modules/bar.yr:(4,9) : extern_modules::bar::foo ()-> void
    ┃ Note : candidate foo --> extern_modules/foo.yr:(4,9) : extern_modules::foo::foo ()-> void
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

The conflict problem can be resolved by changing the calling
expression, and writting the full name of the function that we wan't
to call.

```ymir
import extern_modules::bar, extern_modules::foo

def main () {
    extern_modules::bar::foo (); // Bar
    extern_modules::foo::foo (); // Foo	
}
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
