# Relation between exception and option type


We have seen in the chapter [Basic programming
concept](https://gnu-ymir.github.io/Documentations/en/primitives/),
that the *Ymir* language have a primitive option type. This type has a
really close relation with exceptions. Indeed, any value can be store
inside an option type, and any failing scope can be used to create an
empty option value. The token **`?`** is used to transform a value
into an option type. 

In the following example, the **`foo`** function can throw an
exception. The **`main`** function calls it, but use enclose the
result inside an option type, to handle the errors. The type of the
variable **`x`** is then **`(i32)?`**, meaning option of **`i32`**.  A
pattern matching, is then used to check wether the **`x`** contains a
value or not. In this example, a new pattern of the pattern matching
is presented. This pattern is specific to the case of option type, and
adds two keywords **`Ok`**, and error **`Err`**. They can be used with
or without internal pattern (never named), to get the content of the
option (in case of **`Ok`**), or the exception (in case of **`Err`**).

```ymir
import std::io;

def foo (i : i32)-> i32 
	throws &AssertError
{
	assert (i < 10, "i must be lower than 10");
	i + 12
}

def main () {
	let x = foo (10) ?
	match x {
		Ok (y : _) => { 
			println ("x contains the value : ", y);
		}
		Err (err : _) => {
			println ("x has no value, because : ", err);
		}
	}
}
```

<br>

Results (in release mode) : 

```
x has no value, because : core::exception::AssertError (i must be lower than 10)
```

<br>

One can note from the previous example, that the **`main`** function
is safe. The option enclosing catches every exceptions. The exception
can then be retreived by using a pattern matching, as presented above.
**Warning** Unfortunately, the accuracy of the exception type that is
thrown is lost at compile time, (i.e. the type contained inside an
option type is **`Exception`**). Even, if the type can be specifically
retreived at execution time. To remove this limitation, the different
type of exception would have to be written in the definition of the
option type. This would be extremely verbose. *Contribution* Maybe
adding the possibility to write it, but optionaly, in order to store
it if possible. I don't know if it is a good idea.

## Empty option without exception

It is possible to initialize an empty option value without throwing an
exception. This can be done using the type specific attribute
**`err`**. In that case, the option does not have a value, even if it
is an **`Err`** value. 

```ymir
import std::io;

def foo ()-> i32? {
	(i32?)::__err__
}

def main () {
	match foo () {
		Err (err : _) => {
			println ("Empty but with exception : ", err);
		}
		Err () => {
			println ("Totally empty, init with __err__");
		}
	}
}
```

<br>

Results: 

```
Totally empty, init with __err__
```

## Void option type

Option type can store values of type **`void`**, in that case the
**`Ok`** pattern has no value to get. This can be usefull to execute a
function, and verify afterwards if it succeeded or not.

```ymir
import std::io;

def foo (i : i32)-> void 
	throws &AssertError
{
	assert (i < 10, "i must be lower than 10");
	println (i);
}

def main () {
	let x : void? = foo (10) ?
	match x {
		Ok () => { 
			println ("Foo succeeded");
		}
		Err (err : _) => {
			println ("Foo failed, because : ", err);
		}
	}
}
```

<br>
Results: 

```
Foo failed, because : core::exception::AssertError (i must be lower than 10)
```
