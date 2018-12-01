# Scope guards

The scope guards, are defined thanks to a new syntax. 

```ymir
on exit => {
	println ("End of scope");
}
```

There are three different scope guards, `success` and `failure` and `exit`.

## Scope success

The instructions defined in a scope `success`, are executed at the exit of the scope, if no error has occurred.

```ymir
{
	on success => println ("Scope end");
	println ("Inside scope");
}
println ("After scope");
```

Will generate the following execution: 

```
Inside scope
Scope end
After scope
```

scope guards are very useful to ensure that an instruction will be executed, such as that a mutex has been released at the output of a scope.

```ymir
{
	mutex.lock ();
	on sucess => mutex.unlock ();

	some_atomic_computing ();
}	
```

## Scope failure

Scope `failure` are a sequence of instructions carried out when an error has occurred. 
The syntax is a little different, a form of matching is performed on the type of error.


```ymir
def foo () {
	throw 10;
}


foo ();
on failure {
	x : i32 => { 
		println ("Catch i32 : ", x); 
	}
	x : f32 => { 
		println ("Catch i32 : ", x); 
	}
	_ => println ("Catch anything");
}
```
 
If the scope guard is not able to retrieve the exception, it continues on its way.
Scope failures can perform polymorphic matching on objects.

```ymir
type A impl (i32) {
    self (a : i32) self.0 = a;
    def foo (self) println ("A : ", self.0);
}

type B over A {
    self (a : i32) self.super::init (a);
    over foo (self) println ("B :  ", self.0);
}

def foo () {
    throw B::init (12);
}

def main () {
    foo ();

    on failure {
        x : A => { x.foo (); } // B : 12
    }
}
```

Scope `failure` without matching stops the progress of any exception.


```ymir
on failure => println ("Failure");

// is a shortcut for 
on failure {
	_ => println ("Failure");
}
```

## Scope exit

scope `exit` works the same way as `success` scope, but ensures that when an error has occurred the scope guard instructions are still executed.

Unlike the `failure` scope, it does not stop the propagation of exceptions.

```ymir
def some_atomic_unsafe_computing () {
	throw 42;
}

{
	mutex.lock ();
	on exit => {
		println ("unlocking mutex");
		mutex.unlock ();
	}

	some_atomic_unsafe_computing ();
}	
println ("Will never append");
```

Will generate the following execution: 

```sh
unlock mutex
Unhandled exception
Exception in file "main.yr", at line 2.
Aborted (core dumped)
```
