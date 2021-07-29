# Documentation

The *Ymir* compiler is able to generate documentation files
automatically. These documentation files in *json* format are easier
to read for a documenation generator than a source code. The option
**`-fdoc`** generates documentation file for each compiled
modules. The name of the *json* file is the path of the module, where
the double colon operators **`::`** are replace with underscores
**`_`**.

```bash
$ tree
.
└── foo
    └── bar
        └── baz.yr

2 directories, 1 file

$ gyc foo/bar/baz.yr -fdoc
$ ls 
foo  foo__bar__baz.doc.json
```

<br>

The following chapters present the json format of the different
declarations (functions, class, etc...). The first chapter presents
the encoding of the types, and the second the encoding of the symbols.


**Contribution** A very basic standard documentation website generator
is under development [ydoc](https://github.com/GNU-Ymir/ydoc).
