# Best practice

The *copy* is never hidden in the source code that is available to the
user. However, many codes that we are using on a daily basis, are
provided by libraries. In libraries, only the prototypes of the
functions are presented to the user, and therefore if a copy is made
inside a function, the copy is hidden from the user. We cannot
guarantee that such copy are not made (at least for the moment), so we
propose a best practice advice to avoid hidden copies inside
libraries.

This advice is simple, never take a immutable parameter in a function,
if you have to make a copy of it inside the function. For example, let
say we have a function that sorts a slice. This function should
preferably take a mutable slice as input and modify it directly.

```ymir
def good (dmut slc : [i32])-> dmut [i32] {
	// perform the sort on slc
	alias slc
}

def bad (slc : [i32])-> dmut [i32] {
	let dmut res = copy slc;
	// perform the sort on res
	alias res}
	
```
<br>

This way, the function calling the sort function has the choice of
making the *copy* or not. In the following example, the user has the
choice when calling the function **`good`**, but never when calling
the function **`bad`**, making the copy hidden. One can note from the
following example, that the copy is never hidden when calling
**`good`**, and that it is also possible to make no copy at all.

```ymir
def main () {
	let dmut slc = [9, 3, 7];
	let dmut aux = good (copy slc); // slc is unchanged, and aux is sorted
	let dmut slc2 = good (alias slc); // slc is sorted, and slc2 points the data of slc
	
	good (slc); // impossible, implicit alias is not allowed
	
	bad (slc); // here there is not need for alias, nor copy, 
		       // the data of slc won't be modified in bad
	           // the copy is alway made and hidden
}
```

<br>

From the above example, the compiler returns an error, when trying to
call the function **`good`** without *aliasing* nor *copying* at line
**6**. This error prevents from copying values implicitely without
writting it down, nor making *aliasing* of the values and giving the
write permission to foreign functions without informing the compiler
of our agreement. All the other calls are valid, the wish of the user
being totally explicit.

```error
Error : the call operator is not defined for main::good and {mut [mut i32]}
 --> main.yr:(17,7)
17  ┃ 	good (slc); // impossible, implicit alias is not allowed
    ╋ 	     ^   ^
    ┃ Note : candidate good --> main.yr:(1,5) : main::good (slc : mut [mut i32])-> mut [mut i32]
    ┃     ┃ Error : discard the constant qualifier is prohibited, left operand mutability level is 2 but must be at most 1
    ┃     ┃  --> main.yr:(17,8)
    ┃     ┃ 17  ┃ 	good (slc); // impossible, implicit alias is not allowed
    ┃     ┃     ╋ 	      ^^^
    ┃     ┃     ┃ Note : implicit alias of type mut [mut i32] is not allowed, it will implicitly discard constant qualifier
    ┃     ┃     ┃  --> main.yr:(17,8)
    ┃     ┃     ┃ 17  ┃ 	good (slc); // impossible, implicit alias is not allowed
    ┃     ┃     ┃     ╋ 	      ^^^
    ┃     ┃     ┗━━━━━┻━ 
    ┃     ┃ Note : for parameter slc --> main.yr:(1,16) of main::good (slc : mut [mut i32])-> mut [mut i32]
    ┃     ┗━━━━━━ 
    ┗━━━━━┻━ 


ymir1: fatal error: 
compilation terminated.
```

<br>

*Contribution*: Maybe it is possible to complitely avoid hidden copies ? (I don't have any clue for the moment).
