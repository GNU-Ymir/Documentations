# Comments

**Ymir** offers different types of comments. 

* > `// A line of comment that stop at the end of the line`
* > `/* Multi-line comment that stops at the final delimiter */`

```ymir
def main () 
	throws &AssertError // Not what's important for the moment
{
    // This is an example of comment

    /* 
     * This is another example of comment
     * Where, the stars are optionnal
     */

    /*
	And this is the proof
    */

    // None of the comment lines have an influence on the compilation

    let x = 1 + /* 2 + */  3;
    assert (x == 4); 
}
```

In the above pogram, calling **`assert`** will throw an exception if
the test is false. Errors are presented in the [Error
Handling](https://gnu-ymir.github.io/Documentations/en/errors/main.html)
chapter. For the moment, we can consider that the exception simply
stops the program when the test fails.


We will see in the
[Documentation](https://gnu-ymir.github.io/Documentations/en/documentation/main.html)
chapter, that comments are very usefull, to generate documentations.
