(TeX-add-style-hook
 "memory"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("standalone" "tikz" "border=15mm")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("fontenc" "T1") ("algpseudocode" "noend")))
   (TeX-run-style-hooks
    "latex2e"
    "figures/memory_x_ref_x_foo"
    "standalone"
    "standalone10"
    "lmodern"
    "inputenc"
    "fontenc"
    "hyperref"
    "amsmath"
    "graphicx"
    "verbatim"
    "moreverb"
    "geometry"
    "textcomp"
    "xcolor"
    "pgfplots"
    "algorithm"
    "algpseudocode"
    "amssymb"
    "amsfonts"
    "adjustbox"
    "fancyvrb"
    "tikz"
    "etoolbox"
    "multicol"
    "mathtools"))
 :latex)

