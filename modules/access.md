# Access Specifier 


It sometimes happens that certain function declarations must remain local to a module in order to keep clarity, consistency and security in a program. The modules offer an access verification system, using the keyword `private` and `public`.

By default, declarations are public except for declarations of external functions, which are special cases and rarely need to be accessible from the outside.

## Private access 

The keyword `private` allows you to determine that a declaration should not be called from an external module.

```ymir

mod myModule {

	private def foo () {
	}
	
	def bar () {
		foo (); // Ok
	}
	
	private mod myInnerModule {
		def baz () {
			foo (); // Ok
		}
	}
}

myModule::foo (); // No
myModule::myInnerModule::baz (); // No
```

Declarations can be set to several in a private block.

```ymir
	private {
		def foo () {}
		def bar () {}		
	}
```


## Public access

The keyword `public` allows you to do the exact opposite of the private keyword and define that a statement is public.

```ymir
mod myModule {

	public extern (C) printf (const c : p!char, ...);

}

myModule::printf ("Hi !!".ptr); // Ok
```


## Friends access

Friends access allows you to define that a module is a friend, and that therefore it has the right to access the private declaration of the current module. **Work in progress!!**

