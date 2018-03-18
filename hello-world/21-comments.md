# Comments

**Ymir **support differents types of comments. Those comments will be ignored by the compiler.

* > `// Line comments wich go to the end of the line `
* > `/* Multiple lines comments which go to the closing delimiter */`

```ymir
def main () {
    // This is an example of line comment
	
    /*
     * This is another type of comment
     * Where the stars are optional
     */

    /* That is a proof */

    // None of the line of comment will be read by the compiler

    let x = 1 + /* 2 + */  3;
    assert (x == 4);
}
```



