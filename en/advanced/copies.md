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
figure underneath. In this example, the variable **`x`** is copied in
the variable **`y`**, and thus the two variable borrows different
data, but have an exact same value.

```ymir
import std::io
    
def main ()
    throws &AssertError, &OutOfArray
{
    let x = [1, 2, 3];
    let dmut y = copy x; // create a copy of x
    assert (x == y); // y and x have the same value, but at different location

    y [0] = 9; 
    assert (x == [1, 2, 3]); // modifying y does not affect x
    assert (y == [9, 2, 3]); // but still affects y
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
	assert (x == "Hello !");
}
```

<div class="spoiler_head"> <strong>Correction</strong> (spoiler) : </div>
{%s%}
<pre class="language-" style="position: relative;" class="spoiler"><code class="lang-ymir">import std::io

def main () 
    throws &OutOfArray, &AssertError
{
	let dmut x = copy "hello !";
	x [0] = 'H'; // Well done
	assert (x == "Hello !");
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
