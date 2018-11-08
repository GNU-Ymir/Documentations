# Hello World

The following source code, is the **Ymir** version of the famous `Hello World!!` program.

```ymir
// This is a comment 

// This is a function declaration 
// The main function, is the first one called 
def main () {
    // Print 'Hello World !!' to the console
    println ("Hello World !!");
}
```


A binary can be generated using **GYC**.

```bash
$ gyc hello.yr
``` 

This command produce a binary `a.out` that can be executed 

```
$ ./a.out
Hello World !!
```

