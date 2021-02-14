# Copy data to make them mutable

Sometimes you may not want to allow certain data to be borrowed. Or
some data is immutable, but you still want to change it and return a
modified value. To solve this problem, **Ymir** provides two keywords,
`copy` and `dcopy`. 

## Copy

The copy keyword will make a copy of the first level of an aliasable
type. The following table shows some examples of copy types:

| Type | Type of copied value |
| --- | --- |
| [i32] | mut [mut i32] |
| mut [i32] | mut [mut i32] |
| mut [[i32]] | mut [mut [i32]] |

An example of what you can achieve with `copy` is shown in the
following code. The representation of the memory is also shown in the
following figure.

```ymir
import std::io
    
def main () {
    let x = [1, 2, 3];
	let dmut y = copy x;
}
```

<br>

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x_copy_main.png" alt="drawing" width="700"/>

**Exercise :** Modify `x` that is initialised with an imutable string literal : 

```ymir
import std::io

def main () 
	throws &OutOfArray 
{
	let x = "hello !";
	x [0] = 'H'; // Make this line work
	println (x);
}
```

<div class="spoiler_head"> <strong>Correction</strong> (spoiler) : </div>
{%s%}
<pre class="language-" style="position: relative;" class="spoiler"><code class="lang-ymir">import std::io

def main () 
	throws OutOfArray 
{
	let dmut x = copy "hello !";
	x [0] = 'H'; // Well done
	println (x);
}
</code></pre>
{%ends%}

## Deep copy

The deep copy will make a copy of the value and all internal values,
it must be used in special cases because it is much less efficient
than the simple copy, which copies only one level of the data. There
is nothing complex to understand in deep copy, it simply creates a
value, deeply mutable, which is an exact copy.

```ymir
import std::io

def main () {
    let x = [[1], [2, 3], [4]];
    let dmut y = dcopy x;
    let mut z : [mut [i32]] = copy x;
    println (x, " ", y, " ", z);
}
```
