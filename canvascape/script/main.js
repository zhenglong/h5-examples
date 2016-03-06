// make sure website is not running in a frame:
try{
    if (top!=window)
    {
        top.location.replace(location.href)
    }
}
catch(ignore){}

$(function(){
	var KEY = 'GAMELIST_SUBSCRIBED';

	if (localStorage.getItem(KEY)) {
		// already subscribed
		return;
	}


	var form = $('#gamelist');
	var email = $('#gamelist input');
	var submit = $('#gamelist button');
	// stop games taking over
	email.on('keypress keydown input', function(evt){
		evt.stopPropagation();
	});
	form.on('submit', function(evt){
		evt.preventDefault();
		var val = email.val();
		if ( ! val) {
			alert('You haven\'t put in your email address!');
			email.focus();
			return;
		}
		if ( ! val.match(/[^@]*@[^@]*\.[^@]*/)) {
			alert('Oops! Looks like there\'s a typo in your email address.');
			email.focus();
			return;
		}
		subscribe();
	});

	function subscribe()
	{
		email.attr('disabled', true);
		submit.attr('disabled', true);

		$.ajax({
			url: '/gamelist',
			method: 'post',
			data: {
				email: email.val()
			},
			dataType: 'json',
			success: function(data)
			{
				if ( ! data.success) {
					error();
					return;
				}

				$('#gamelist').hide();
				alert("Great! Thanks for subscribing.\nI'll be in touch when I've got something to show.\n\nCheers,\nBen")

				localStorage.setItem(KEY, true);
			},
			error: function()
			{
				error();
			},
		});
	}

	var errorCount = 0;
	function error()
	{
		var str = 'Hmmm, something went wrong, please check your internet connection and try again.';
		if (++errorCount > 1) {
			str += '\n\nIf this keeps happening please get in touch on the contact form, maybe this thing is broken!';
		}
		alert(str);
		email.attr('disabled', false);
		submit.attr('disabled', false);
	}
});
