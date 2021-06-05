Prism.languages.ymir = {
    'comment': [	
	{
	    pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
	    lookbehind: true
	},
	{
	    pattern: /(^|[^\\:])\/\/.*/,
	    lookbehind: true
	}
    ],
    'string': [
	    /b?r(#*)"(?:\\?.)*?"\1/,
	    /b?("|')(?:\\?.)*?\1/
    ],
    
    'keyword': /\b(?:break|else|enum|extern|fn|for|if|in|let|match|mod|return|sizeof|static|self|struct|super|def|dg|typeof|while|with|import|assert|macro|move|copy|dcopy|class|throws|over|aka|trait|throw)\b/,
    
    'other-keyword' : /\b(?:mut|dmut|false|true|pub|prv|prot|ref|with|new|alias|is|impl)\b/,
    'basic-types' : /\b(?:i8|i16|i32|i64|u8|u16|u32|u64|bool|c8|c32)\b/,
    'path' : [
	{
	    pattern: /(::)(?:[A-z0-9_]+)/i,
	    lookbehind: true
	},
	{
	    pattern: /[A-z0-9_]+(?=::)/i
	}
    ],

    'type' : [
	{
	    pattern: /(\s:\s)(?:[^\[][A-z0-9_]+)/i,
	    lookbehind: true
	},
	{
	    pattern: /(\s&)(?:[A-z0-9_]+)/i,
	    lookbehind: true
	}
    ],
    
    'attribute': {
	pattern: /#!?:\[.+?\]/,
	alias: 'attr-name'
    },

    'function': [
	    /[A-z0-9_]+(?=\s*\()/i,
	// Macros can use parens or brackets
	    /[A-z0-9_]+!(?=\s*\(|\[)/i
    ],
   

    // Hex, oct, bin, dec numbers with visual separators and type suffix
    'number': /\b-?(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,
    'punctuation': /[{}[\];(),:]|\.+|->/,
    'operator': /[-+*\/%!^=]=?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/	

}
