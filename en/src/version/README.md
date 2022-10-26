# Version

Version is another conditional compilation process (in addition to
*compile time execution* with templates), that select parts of the
code that must be compiled or not. The following code block presents
the grammar of the *version* declaration and expression.

```grammar
version_decl := '__version' Identifier '{' declaration '}' ('else' declaration)?
version_expr := '__version' Identifier block ('else' expression)?
```

<br>

The identifier used in the version block are in their own name space,
meaning that they do not conflict with the other identifiers
(variable, types, etc...). **Warning** the identifier of the version
is not case sensitive, thus **`Demo`** and **`DEMO`** are
identical. The version are activated by the command line using the
option **`-fversion`**. In the following example the version
**`Demo`**, and **`Full`** are used.

```ymir
import std::io;

__version Demo {
	def foo () {
		println ("Foo of the demo version");
	}
} else {
	__version Full {
		def foo () {
			println ("Foo of the full version");
		}
	}	
}

def main () {
	foo ();
}
```

<br>

```bash
$ gyc main.yr -fversion=Demo
$ ./a.out
Foo of the demo version

$ gyc main.yr -fversion=Full
$ ./a.out
Foo of the full version
```

<br>

To use multiple version, the option must be set for each version. 
```bash
$ gyc main.yr -fversion=Demo -fversion=Full
```

## Debug version

The debug option of the command line **`-g`** activates the
**`Debug`** version even without the option **`-fversion`**.

```ymir
import std::io;

def foo () {
	__version DEBUG {
		println ("Entering foo");
	}
	
	println ("foo");
}

def main () {
	foo ();
}
```

<br>
```bash
$ gyc main.yr -g
$ ./a.out
Entering foo
foo

$ gyc main.yr
$ ./a.out
foo
```

## Predefined versions

**Contribution** There is no predefined version for the moment, but it
is a work in progress. These versions will depend on the compiler, os,
etc..
