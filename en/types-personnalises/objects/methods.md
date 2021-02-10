# Methods

Methods are special functions that apply to instances of objects. They make it possible to apply a particular treatment to a type and facilitate the structuring of the code.

## Pure methods

As for functions, methods are separated into two categories, pure methods and impure methods (see [Functions](.../../functions/main.md)).

Pure methods are defined in a class using the keyword `def`. The first parameter of a method is always `self`, its type is a reference of an object, and is always inferred.

```ymir

type MyType impl (i32) {

	self (x : i32) { self.0 = x; }
	
	def foo (self, z : i32) {
		println ("Replace ", self.0, " by ", z);
		self.0 = z;
	}

}

// ...

let myvar = MyType::init (10);
myvar.foo (12); // This prints : 'Replace 10 by 12'```

It is possible to define several methods with the same name, as for functions. The method that is closest to type specialization during a call, or reference, will be used.

We will see later that it is also possible to override a method with inheritance.
Only pure methods can be overrided by inheritance, because they alone are virtual.

## Impure methods

As for the declaration of pure methods, the keyword `def` allows to declare an impure method. The difference between a pure method and an impure method is the same as the difference between pure and impure functions, so you can refer to the section [Function](.../../functions/main.md), for more details.

```ymir

type MyType impl (i32) {

	// ...
	
	def foo (self, x) { // Foo is an impure method
		// ...
	}	
}
```

As specified above, impure methods are not virtual and therefore cannot be overloaded by inheritance.


## Static methods

The name "static method" is an abuse of language to define functions defined within a class and which can be used without an object instance.

A static method is accessible through the operator `::`.

Unlike methods, these functions do not take the `self' parameter as the first argument.

```ymir
type MyType impl (i32) {

	// ...
	
	def foo (x : i32) { // This method is static
		// ...
	}

}

// The type can be directly used to call static methods
MyType::foo (12); // Ok


let myvar = MyType::init ();

// We can also use a variable of this type 
myvar::foo (12); // Ok

// The static method cannot be accessed using the dot operator
myvar.foo (12); // Error, type MyType does not have any method named foo
```


As with any function declaration, static methods can be pure or impure, and also template as we will see in the section dedicated to [Templates](../.../templates/fonctions.md).

#### Limitations 

Since the constructor of an object is called in the same way as a static method, it is impossible to define a static method called `init`.

## Operator overloading

Operator overloading can be defined within a class. Nevertheless, the operation of these overloads is fully similar to that defined outside a class. Therefore, the details of these overloads are defined in the following section [Operator overloading](.../../templates/operators.md).
