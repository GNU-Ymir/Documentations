# Comments

**Ymir** offers different types of comments. 

* > `// A line of comment that stop at the end of the line`
* > `/* Multi-line comment that stops at the final delimiter */`

```ymir
def main () 
	throws &AssertError
{
    // This is an example of comment

    /* 
     * This is another example of comment
     * Where, the stars are optionnal
     */

    /*
	And this is the proof
    */

    // None of the line will influence the compilation

    let x = 1 + /* 2 + */  3;
    assert (x == 4); 
}
```

In the above pogram, calling **`assert`** will throw an exception if
the test is false. Errors are presented in the [Error
Handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html)
chapter.

Comments can be used to generate documentation of the code. The
documentation is explained in the
[Documentation](https://gnu-ymir.github.io/Documentations/en/documentation/main.html)
chapter.