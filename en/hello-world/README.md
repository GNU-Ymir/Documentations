# Hello World

The following source code is the **Ymir** version of the famous program "Hello world !"

```ymir
import std::io // importation of the module containing io functions

// This is a comment 

/** This is a function declaration
  * The main function, is the first one to be called
  */
def main () {
    // Print 'Hello World !!' to the console
    println ("Hello World !!");
}
```

A binary can be generated using **GYC**.

```bash
$ gyc hello.yr
``` 

This command produces a binary `a.out` that can be executed.

```bash
$ ./a.out
Hello World !!
```

The command line options of gyc are the same as those of all [gcc
suite
compilers](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html#Overall-Options),
with few exceptions that will be clarified in this documentation.

The option **`-o`** can be used to define the name of the output executable.

```bash
$ gyc main.yr -o main
$ ls
main  main.yr
$ ./main
Hello World !!
```

