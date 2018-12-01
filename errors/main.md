# Error handling

This section will introduce error handling in the **Ymir** language. As with many languages, we have opted for error handling by throwing exceptions. Error recovery is done in a localized way at the scope thanks to a system called scope guard.


The exceptions in **Ymir** are very simple, as they do not have to meet any particular criteria.
It is possible to throw any value as an exception, using the keyword `throw`.

```ymir
throw "error"; 
```

The keyword `throw` indicates that an error has occurred, a jump is made to the first scope guard able to process the error that occurred.
If no scope guard is present, the error causes the program to stop.

```ymir
def foo () {
	throw 10;
}

def main () {
	foo ();
}
```

Will generate the following execution: 

```sh
$ ./a.out
Unhandled exception
Exception in file "main.yr", at line 2.
Aborted (core dumped)
```
