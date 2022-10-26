$( document ).ready(function() {
    var menu = document.getElementById ("menu-bar");
    var right_buttons = menu.querySelector (".right-buttons");

    var print_button = right_buttons.firstElementChild;
    var lang_button = document.createElement ("i");
    lang_button.setAttribute ("id", "lang-toggle");
    lang_button.classList.add ("fa")
    lang_button.classList.add ("fa-language");
    lang_button.setAttribute ("title", "change language");

    right_buttons.removeChild (print_button);
    right_buttons.appendChild (lang_button);
    right_buttons.appendChild (print_button);
    
    $("#lang-toggle").click(function(){
        if($('.lang-popup').length) {
            $('.lang-popup').remove();
        } else {
            var popup = $('<div class="lang-popup"></div>')
                .append($('<div class="lang" id="en">English <span class="default">(default)</span><div>'))
                .append($('<div class="lang" id="eo">Esperanto</div>'));


            popup.insertAfter(this);

            $('.lang').click(function(){
		var lang = $(this).attr('id');
		set_lang (lang);
            });
        }
    });


    function set_lang (lang) {
	var url = window.location.href;
	var domain = window.location.host;
	var pos = url.search (domain);
	
	var page = url.substring (pos + domain.length + 1);
	var protocol = url.substring (0, pos);
	var current_lang_pos = page.search ("/");
	if (current_lang_pos != 0) {
	    var current_lang = page.substring (0, current_lang_pos);
	    if (current_lang == "en") { page = page.substring (current_lang_pos + 1); }
	    else if (current_lang == "eo") { page = page.substring (current_lang_pos + 1); }
	}

	n_page = protocol + domain + "/" + lang + "/" + page;
	console.log (n_page);
	window.location.href = n_page;
    }

});
