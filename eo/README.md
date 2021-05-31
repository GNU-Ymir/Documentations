# Enkonduko

**Ymir** estas altnivela, statike tipata programlingvo, kies intenco
estas helpi savi tempon al la programistoj per provizi fortan kaj
sekuran semantikon. La semantiko de tiu programlingvo estas direkta al
sekureco, samtempeco kaj rapideco de plenumo. Tiuj celoj estas
plenumitaj danke al ĝia granda esprimpleneco kaj ĝia rekta traduko al
efika maŝinkodo.

Tiu dokumentado esploras la ĉefajn konceptojn de *Ymir*, liverante
aron da ekzemploj por demonstri la forton de tiu nova
programlingvo. Tiu dokumentado ankaŭ prezentas kelkajn erojn de la
norma biblioteko.

# Konsiderindaĵo

Antaŭ komenci priparoli la lingvon, bonvolu ekkompreni ke ĉio estas
ankoraŭ konstruanta kaj ke kelkfoje aĵoj povas misfunkcii. Se vi
renkontas erarojn aŭ aĵojn, kiujn vi ne komprenas aŭ pensas esti
malĝustaj, bonvolu kontakti nin al: <gnu.ymir@mail.com>. Ni antaŭĝuas
korespondi kun vi!

Aldone, kontribuoj estas bonvenegaj, aŭ por plibonigi la dokumentadon,
aŭ por proponi plibonigojn de la programlingvo aŭ de la norma
biblioteko. Ĉiuj deponejoj estas disponeblaj en
[github](https://github.com/GNU-Ymir). En tiu dokumentado, kelkaj
konataj limoj de la lingvo estas kelkfoje emfazataj, kaj vokas
kontribuojn.

## Instalo


La referenca kompililo de *Ymir* estas bazita sur la kompililo
**GCC**, kiu oferas fortajn statikajn optimumigojn, kaj vastan aron da
celaj arĥitekturoj subtenataj.


Estas du manieroj por instali la **gyc** (Gnu Ymir Compiler), denaske
aŭ per uzi Docker'a kontenero.

### Denaska instalo

La kompililo povas esti instalita sur linux debian operacia sistemo,
per sekvi tiujn simplajn etapojn:
- Unue, vi bezonos elŝuti la du pakojn :
  - [libmidgard-9-dev](https://gitea.emile-cadorel.fr/Emile/Ymir-Docker/src/branch/master/builder_image/9/amd64/bin/libgmidgard_9.3.0_amd64.deb)
  - [GYC](https://gitea.emile-cadorel.fr/Emile/Ymir-Docker/src/branch/master/builder_image/9/amd64/bin/gyc-9_9.3.0_amd64.deb)
  
- Kaj, instali ilin per uzi la ordonon dpkg: 
  
```bash
$ sudo dpkg -i libgmidgard_9.3.0_amd64.deb
$ sudo dpkg -i gyc-9_9.3.0_amd64.deb
```

<br>

Tiuj pakoj dependas de :
- g++-9
- gcc-9-base
- libc6 >= 2.21
- libgmp10 >= 2:5.0.1~
- libmpc3
- libmpfr6 >= 3.1.3
- zlib1g >= 1:1.1.4
- libgcc1
- zlib1g-dev
- zlib1g >= 1:1.2.0
- libgc-dev >= 1:7.4.2

Se unu aŭ pli el tiuj estas malinstalita, vi akiros eraron. Tiu povas esti
solvita per lanĉi la sekvan ordonon:

```bash
sudo apt --fix-broken install
```
<br>

Kaj poste reinstali la pakon kiu antaŭe malsukcesis (uzante dpkg). La
kompililo esta nun instalita sub la nomo `gyc`.


```bash
$ gyc --version

gyc-9 (GCC) 9.3.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>


### Malinstali la denaskan version

Kiel por iu ajn debian' pako, la malinstalo estas farita tiel : 

```bash
$ dpkg -r gyc-9
$ dpkg -r libgmidgard-9-dev
```

<br>

**Averto**. La malinstalo povas forigi vian instalon de *gcc* (eĉ se
mi neniam fakte observis tion). Sed vi povas simple reinstali ĝin, se
estas problemo, per skribi:

```bash
sudo apt install --reinstall gcc-9
```

## Docker' instalo

Por komenci, vi bezonos Docker'n.

```bash
$ sudo apt install docker.io
```
<br>

Tiam, elŝuti la docker'n bildon el la oficiala deponejo : 
```bash
$ docker pull gnuymir/9.3.0-amd64
```

<br>

La kompililo esta nun atingebla tra la kontenero: 
```bash
$ docker run -t -v $(pwd):/tmp -w /tmp gnuymir/9.3.0-amd64 --version 
gyc-9 (GCC) 9.3.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

<br>

Por farigi la uzon de la kontenero pli facila, vi povas aldoni
alnomon en la dosierujo `~/.local/bin`. Unue malfermu la dosieron
`~/.local/bin/gyc` kaj algluu la sekvan linion:

```bash
docker run -t -v $(pwd):/tmp -w /tmp gnuymir/9.3.0-amd64 $*
```
<br>


Certigu ke via `PATH` variablo enhavas la dosierujon
`~/.local/bin`. Malfermu novan ŝelon kaj lanĉu la sekvajn ordonojn:

```bash
$ chmod +x ~/.local/bin/gyc
$ gyc --version

gyc (GCC) 9.3.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```





