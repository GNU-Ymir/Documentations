Prism.languages.error = {
    'comment': [	
	{
	    pattern: /(?:-->.*)/
	}
    ],    
    'path': /\b(?:Error|fatal error)\b/,    
    'other-keyword' : /\b(?:Note)\b/,
    'function' : /\b(?:Warning)\b/,
}
