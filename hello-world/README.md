# Hello World

Le code source suivant est la version **Ymir** du celebre programme Hello World.

{% code-tabs %}
{% code-tabs-item title="hello-world.yr" %}
```rust
// This is a comment

// The first function that will be called at execution
def main () {
    // Print test to the console
    println ("Hello World !!");
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

L'exécutable peut être généré grâce au compilateur **GYC**

```bash
$ gyc hello.yr
$ ./a.out
Hello World !!
```

