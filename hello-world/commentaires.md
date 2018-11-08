# Commentaires

**Ymir** offers different types of comments. 

* > `// A line of comment that stop at the end of the line`
* > `/* Multiple ling comments that go the closing delimiter */`

```ymir
def main () {
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
    assert (x == 4); // assert force the program to end if the test if false
}
```

