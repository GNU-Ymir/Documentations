# Commentaires

**Ymir** propose différent types de commentaires. Ces commentaires sont pour le moment ignoré à la compilation, mais vont - dans un futur proche - servir à écrire la documentation.

* > `// Une ligne de commentaire qui s'arrête à la fin de la ligne`
* > `/* Plusieurs lignes de commentaire qui s'arrête au caractère de fermeture */`

```text
def main () {
    // Ceci est un exemple de commentaire

    /* 
     * Ceci est un autre type de commentaire 
     * Où les étoiles sont optionnel
     */

    /*
    Ceci en est la preuve    
    */  

    // Aucune de ces lignes ne va influencer la compilation

    let x = 1 + /* 2 + */  3;
    assert (x == 4); // assert fait planter le programme si le test est faux.
}
```

