# Introduction

**Ymir** est un langage moderne haut niveau fortement typé qui a pour objectif d'aider les developpeurs à gagner du temps en proposant un système de sureté de typage. Le langage est axé sur la sureté, la concurrence et la vitesse d'execution. Ces objectifs peuvent être atteint grâce à son expressivité et la compilation direct vers un langage machine natif performant.

**Ymir** Tour parcours les différents concept de **Ymir** grâce à un collection d'exemples afin de démontrer les apports du langage. Cette exploration sera également l'occasion de présenter la bibliothèque standard.

## Installation

Le compilateur de référence de **Ymir** est basé sur le compilateur **GCC** qui offre des optimisations statique performantes ainsi qu'un vaste ensemble d'architecture supportée.

Le compilateur est toujours en version bétâ, mais il est possible de l'installer sur un linux debian. 
Il faut pour cela, installer la bibliothèque standard, qui permet au compilateur de lier les symboles, et aux programmes générés de s'exécuter. 
- [libgmidgard-7-dev](https://github.com/GNU-Ymir/Ymir-release/raw/master/7.3.0/libgmidgard_7.3.0_amd64.deb)

La procédure d'installation est très simple : 
- ```bash
sudo dpkg -i libgmidgard_7.3.0_amd64.deb
```

Certaine dépendance peuvent être manquantes, elles sont affiché, il suffit de les installer.

Ensuite, un fois la bibliothèque installé, on peut installer le compilateur : 

- [GYC](https://github.com/GNU-Ymir/Ymir-release/raw/master/7.3.0/gyc-7_7.3.0_amd64.deb)

Comme pour la bibliothèque, la procédure d'installation est très simple : 

- ```bash
sudo dpkg -i gyc-7_7.3.0_amd64.deb
```

Le compilateur est installé, et se nomme `gyc-7` (en référence à la version de GCC utilisée).

## Désinstallation 

Comme pour tout les paquets debian, la desinstallation se fait de la manière suivante : 
```
dpkg -r gyc-7
dpkg -r libmidgard-7-dev
```
