# Version 

!! Work in progress, for the moment the only version than is usable is **Debug** !!

Version management is an important element in program implementation. The keyword `version` allows the definition of several versions of the same module in a single file.

```ymir
static always : i32;

version (Windows) {
	static onlyOnWindows : i32;
	static always : i32; // Error, always is already defined	
}

def main () {
	println (always);

	version (Windows) 
		println (onlyOnWindows);
}
```

The keyword `else` can be used for version management.

```ymir
version (x86) {
	// ...
} else {
	// ...
}
```

The following tables contain the predefined versions.

| Name | Definition |
| --- | --- |
| Debug |  The compiler will produce a debug build |


## User defined version 

The user can define his own version tag. There are two different ways to do this. 
- Pass the tag as a compilation option with the `--version` option
- Use the following syntax: 

```ymir:main.yr
version (Professional) {
	version = featureA;
	version = featureB;
} 

version (Demo) {
	version = featureA;
}

// Implement feature A
version (featureA) {  // ... } 
```

```bash
$ gyc --version=Demo main.yr
```

