# Antaŭparolo

*Ymir* estas altnivela programlingvo kies tipoj estas statikaj, kaj
kiu estas formita tiel ke ĝi helpu programistojn savi tempon donante
fortan kaj sekuran semantikon. La semantiko de tiu programlingvo estas
direktita al sekureco, kunrulado kaj rapideco. Tiuj celoj estas
plenumitaj danke al ĝia granda esprimpleneco, kaj ĝia direkta traduko
al efika denaska maŝinlingvo.

Tiu dokumento esploras la ĉefajn konceptojn de *Ymir*, provizante aron
da ekzemploj kiuj demonstras la fortojn de tiu nova programlingvo. Ĝi
ankaŭ prezentas kelkajn elementojn de la norma biblioteko.

# Gravaĵo

Antaŭ ol oni komencu paroli pri la programlingvo, bonvolu ne forgesi
ke ĝi estas laboro kiu ankoraŭ povas progresi, kaj ke kelkfoje aĵoj
povas ne funkcii laŭvole. Se vi renkontas aĵon kiun vi ne komprenas aŭ
kiu estas eraro laŭ vi, bonvolu kontakti nin je retmesaĝo
<gnu.ymir@mail.com>. Ni jam ĝojos pri legi viajn mesaĝojn!

Aldone, ĉiuj kontribuaĵoj estas varme bonvenaj, ĉu temas pri plibonigi
la dokumentaron, proponi plibonigon de la programlingvo mem aŭ de la
norma biblioteko, de la kerno aŭ eĉ de la aŭtomata procedo de kreado
de nova versio. La fonto estas dispona je
[github](https://github.com/GNU-Ymir). En tiu ĉi dokumento, konataj
limoj de la programlingvo estas kelkfoje emfazitaj, kaj vokas
kontribuaĵojn.

## Instalo

La referenca tradukilo de *Ymir* estas bazita je la tradukilo **GCC**
kiu oferas fortan statikan optimumigon, kaj vastan aron da subtenitaj
celaj arĥitekturoj.

Tiu tradukilo povas esti instalita je linux sistemo per sekvi tiujn simplajn etapojn:
- Unue, vi bezonos elŝuti tiun pakaĵon : 
  - [gyc-11](https://ymir-lang.org/release/gyc/11.3.0/gyc_11.3.0_amd64.deb)

Aliaj versioj de gyc uzante aliaj versioj de gcc estas disponeblaj je
[release](https://ymir-lang.org/release/).

- Kaj poste, vi povas instali ĝin uzante `dpkg` aŭ `apt-get`: 

```bash
$ sudo dpkg -i gyc_11.3.0_amd64.deb
```
<br>

Tiu pakaĵo dependas de : 
- g++-11
- gcc-11
- libgc-dev

Se almenaŭ unu el tiuj ne estas instalita, vi akiros eraron, kiu povas esti solvita per lanĉi la sekvan ordonon:

```bash
sudo apt --fix-broken install
```
<br>

Kaj poste reinstali la pakaĵon kiu malsukcesis (uzante `dpkg` aŭ `apt-get`)
La tradukilo estas nun instalita je la nomo `gyc`.

```bash
$ gyc --version

gyc (GCC) 11.3.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

### Malinstali

Kiel por iu ajn debian'a pakaĵo, la malinstalo estas farita kiel sekve : 

```bash
$ dpkg -r gyc
```

