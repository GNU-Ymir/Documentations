require(["gitbook", "jquery"], function(gitbook, $) {
    gitbook.events.bind("page.change", function(){

	$('.spoiler_head').hover(function(){
	    $(".spoiler").show ();
	}, function(){
	    $(".spoiler").hide ();
	});

    });
});
