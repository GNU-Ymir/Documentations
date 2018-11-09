# Module creation

When you write a program in the **Ymir** language, you start by creating a file. This file is a module declaration, and its name is the path relative to the location of the compilation command execution.

For example, if we have the following file tree structure:
```ymir
.
├── main.yr
└── shapes
    ├── rectangle.yr
    └── square.yr
```

We have the declaration of 3 different global modules, one per file. Their names are as follows: 
- `main`
- `shapes.rectangle`
- `shapes.square`

The `import` instruction allows you to import a global module (defined by a file) from another module.
This instruction can be placed anywhere in a program, and its lifetime corresponds to that of the scope in which it was executed.

```ymir
// main.yr

import shapes.rectangle; // Global import, shapes.rectangle declarations are accessible throughout the module

def foo () {
	{
		import shapes.square; // all declaration of shapes.square are now accessible
	} 
	// 	// This is no longer the case here, the shapes.square declarations are no longer defined
}

```

## Caution

The `mod` instruction allows to define the name of a module and to avoid any confusion by the compiler (at the time of link edition). These confusions can occur when importing a module from a different directory using an absolute path defined by the `-I` compilation option (see[Compilation options]()).

```ymir
mod shapes.shape;

type Shape impl (void) {
	// ...
}

```

## Local modules 

Local modules are modules defined by the keyword `mod` when it has a body.

```ymir

mod myLocalModule {
	
	def foo () {
	}
	
}
```

All declarations defined in this module are accessible from the outside but these accesses must be explicitly defined with the operator `::`.

```ymir
foo (); // Error, foo is undefined

myLocalModule::foo (); // Ok
```

The `use` keyword allows you to define that you are using a module, and that therefore all the declarations present in this module are accessible without having to say it explicitly at each referencing.

```ymir
use myLocalModule;

foo (); // Ok
```


Local modules are imported when importing a global module. They are therefore accessible from the outside (unless otherwise specified).


## Specific access 

It can happen that two modules declare the same function, and there are collisions. The module system is a way of avoiding collisions, as it allows access to the declaration via an explicit description of the reference. If the module `shapes.square` and `shapes.rectangle` both define the function `bar`.

In the `main` module, it is possible to specify which of these functions to refer to, using the operator `::`.

```ymir

import shapes.square;
import shapes.rectangle; // No problem, the definition is located at the module, no collision


bar (); // Error, Impossible to know which function is referred to
shapes::square::bar (); // Ok, the function in the shapes.square module will be called

shapes::rectangle::bar (); // Ok, same as above but with shapes.rectangle

```
