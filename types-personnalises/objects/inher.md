# Héritage

L'héritage est un système qui permet d'appliquer un traitement différent à des versions étendu d'un type. L'héritage en ymir est sécurisé, ne requiert aucune allocation mémoire et par conséquent garantie que le programme ne va pas connaître d'échec. Il donc possible d'utiliser l'héritage et le polymorphisme dans un contexte `safe`. 

Contrairement à d'autre language objet, l'héritage en ymir ne concernent que les méthodes, et ne permet pas de modifier les attributs. En effet la modification des attributs entrainerait un changement de la taille du type des héritier et ne permettrait plus de faire de polymorphisme sans allocation.

Il existe néamoins d'autre forme d'héritage en **Ymir**, qui garantisse également la sécurité des types mais possèdent d'autre limitation et ne permettent pas de polymorphisme comme on pourrait le faire dans d'autre language objet comme le Java ou le C++. Ce système sera détaillé dans une autre section et se nomme le [mixin](../../mixin/main.md).

## Héritage et construction 

L'héritage se fait grâce au mot clé `over`. Un type héritier va posséder tout les attributs `protected` et `public` de la classe parent, ainsi que toutes les méthodes également `protected` ou `public`. 
Un constructeur doit être définis dans l'héritier et celui ci doit appeler le constructeur de la classe parent avant d'effectuer une quelconque opération.


```ymir

type MyAncestor impl (i32) {

	protected let _x : self.0;

	self (x : i32) {
		self._x = x;
	}
	
}

type MyInheriter over MyAncestor {

	self () {
		self.super::init (12); // super give access to ancestor type
		println (self.0); // Error, parent fields are private
		println (self._x); // Ok, _x is protected
	}

}

```
