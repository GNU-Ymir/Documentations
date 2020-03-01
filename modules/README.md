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
└── sub_modules
    ├── bar.yr
    └── foo.yr

1 directory, 3 files
```

In this hierarchy we have three files, which contain modules, the
first module in the file `main.yr` will be named `main`. The second
one in the `sub_modules/bar.yr` file will be named `sub_modules::bar`,
and the third one in the `sub_modules/foo.yr` file will be named
`sub_modules::foo`.

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
mod sub_modules::foo
```

And, it will therefore be importable everywhere, for example in the
`main` module, when writing the import declaration :

```ymir
import sub_modules::foo
```


## Privacy

All symbols defined in a module are private by default. Only modules
that have declared the symbol have access to it. With the keyword
`pub` you can export the symbol for an external modules, which will then
have access to the symbol.

For example, with file `foo.yr` filled as follows : 

```ymir
mod sub_modules::foo;

pub def foo () {}

def bar () {}
```

And the file `main.yr` as follows : 

```ymir
import sub_modules::foo

def main () {
	foo ();
//  ^^^
// Try to replace foo by bar
}
```

The `main` module, will only have access to the `foo` function, which
is declared in the `sub_modules::foo` module. The keyword `pub` can be
used as a block to cover multiple declarations :

```ymir
mod sub_modules::foo

pub {
	def foo () {}
	
	def bar () {}
}
```

## Sub modules

It is possible to declare sub-module that are part of a global module,
with the keyword `mod`. Unlike global modules, you have to name them
when you want to access the symbols declared inside them. For example :

```ymir
mod main
import std::io

mod InnerModule {
	pub def foo () {
		println ("Foo");
		bar ();
	}
	
	def bar () {
		println ("Bar");
	}
}

def main () {
	InnerModule::foo ();
	//           ^^^
	// Try to replace by bar
}
```

The confidentiality system is the same as for the global module. A
module is a symbol, so its privacy is the same as the privacy of
functions, structure, class, etc. Only the main module will have
access to the sub-module `InnerModule` in the example above.

## Symbol conflict resolution

When two external global modules declare two symbols with the same name,
it may be impossible to know which symbol you want to use. In this
case, you can use the full name of the symbol to resolve the
ambiguity. For example, with the `bar.yr` file:

```ymir
mod sub_modules::bar
import std::io

pub def foo () {
	println ("Bar");
}
```

And the file `foo.yr` : 

```ymir
mod sub_modules::foo
import std::io

pub def foo () {
	println ("Foo");
}
```

When using the symbol foo in the `main` module : 

```ymir 
import sub_modules::bar, sub_modules::foo

def main () {
	foo ();
}
```

You should get the following error : 

```
Error : foo called with {} work with both
 --> main.yr:(4,9)
    | 
 4  |     foo ();
    |         ^
Note : candidate  --> main.yr:(4,9) : sub_modules::bar::foo ()-> void
Note : candidate  --> main.yr:(4,9) : sub_modules::foo::foo ()-> void

ymir1: fatal error: 
compilation terminated.
```

You can solve this problem, by replacing the call `foo()`, by `sub_modules::foo::foo ()`.

## Public importation

As for all declaration, importation are private. It means that the
importation is not recursive. For example, if the module
`sub_modules::foo` imports the module `sub_modules::bar`, and the
module `main` import the module `sub_modules::foo`, all the public
symbols declared in `sub_modules::bar` will not be accessible in the
module `main`.

You can of course, make a `pub` importation, to make the symbols of
the module `sub_modules::bar` visible for the module `main`.

- sub_modules/foo.yr

```ymir
mod sub_modules::foo

pub import sub_modules::bar
```

- sub_modules/bar.yr

```ymir
mod sub_modules::bar
import std::io

pub def bar () {
	println ("Bar");
}
```

- main.yr

```ymir
mod main
import sub_modules::foo;

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
import sub_modules::foo;

def main () {
	foo ();
}
```

- sub_modules/foo.yr

```ymir
mod sub_modules::foo

pub def foo () {}
```

```
$ gyc main.yr
/tmp/ccCOeXDq.o: In function `_Y4mainFZv':
main.yr:(.text+0x3e): undefined reference to `_Y11sub_modules3foo3fooFZv'
collect2: error: ld returned 1 exit status
```

This means that the symbol `foo` declared in the module `sub_modules::foo` cannot be
found. So you have to write the command line.


```
$ gyc main.yr sub_modules/foo.yr
```

The way `gyc` works is similar to all the compilers in the `GCC`
suite, so the way to create libraries, object files, etc. is the same.
