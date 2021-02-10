(TeX-add-style-hook
 "developer-notes"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("article" "11pt")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("fontenc" "T1") ("ulem" "normalem")))
   (TeX-run-style-hooks
    "latex2e"
    "article"
    "art11"
    "inputenc"
    "fontenc"
    "graphicx"
    "grffile"
    "longtable"
    "wrapfig"
    "rotating"
    "ulem"
    "amsmath"
    "textcomp"
    "amssymb"
    "capt-of"
    "hyperref")
   (LaTeX-add-labels
    "sec:orgb23b426"
    "sec:orge462128"
    "sec:orgb9c8aac"
    "sec:orge1f737a"
    "sec:orgb84d0d3"
    "sec:org643496d"
    "sec:org76b4c8f"
    "sec:org9325d3a"
    "sec:orgdc842ff"
    "sec:org05fb0d0"
    "sec:org40473bc"
    "sec:org9ee93d1"))
 :latex)

