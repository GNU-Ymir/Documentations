# Copy

Sometimes, you may don't want to allow a borrow of some data. To
resolve that problem, **Ymir** provide two keyword, `copy` and
`dcopy`.

## Copy

The copy keyword will perform a copy of the first level of a aliasable
type. And return a value, with a mutability level increased by 1. The
following table presents some example of copied type :

| Type | Type of copied value |
| --- | --- |
| [i32] | mut [mut i32] |
| mut [i32] | mut [mut i32] |
| mut [[i32] | mut [mut [i32]] |

An example, of what you can achieve with the `copy` is presented in
the following code. The memory representation is also presented in the
figure that follows it.

```ymir
import std::io
    
def main () {
    let x = [1, 2, 3];
	let dmut y = copy x;
}
```

<img src="https://gnu-ymir.github.io/Documentations/advanced/memory_x_copy_main.png" alt="drawing" width="700"/>

