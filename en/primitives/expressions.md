# Expressions

In Ymir, everything is an expression : 

```ymir
def main () {
	let x = {
		let z = foo (); 
		if (z) 0 
		else 8
	} + {
		98 + 43
	};
}
```

The token `;` can be used to end an expression, and specify that there is no value : 

```ymir
def main () {
	let x = {
		1; 
	} // Error, the block has no value;
	
	let z = {
		1
	} // Ok, the value of the block is 1
}
```
