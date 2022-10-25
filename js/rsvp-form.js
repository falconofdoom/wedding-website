
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			// current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

  /**************** Get URI Parameter for Invite Code *****************/
  var urlParams = new URLSearchParams(window.location.search);
  var inviteCode = urlParams.get('inviteCode');
  console.log(inviteCode);
  $('#invite_code').val(inviteCode).trigger('change');

  /********************** RSVP **********************/
  $('#msform').on('submit', function (e) {
      e.preventDefault();
      var data = convertFormToJSON($(this))
      console.log(data);

      // $.post('https://farrabswedding.free.beeceptor.com/error', data)
      $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are saving your details.'));
      delay();

      $.get('http://localhost:8080/rsvp/parties/63550e7789355bcca9b57bc8')
              .done(function (data) {
                  if (data.error) {
                      $('#alert-wrapper').html(alert_markup('danger', data.message));
                  } else {
                      $('#alert-wrapper').html('');
                      // $('#rsvp-modal').modal('show');
                      $("#rsvp-guest-form-container").show();
                      $("#rsvp-form-guest-name").val(data.guests[0].firstName + " " + data.guests[0].lastName).trigger('change');
                  }
              })
              .fail(function (data) {
                  console.log(data);
                  $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
              });

      // $.get('http://localhost:8080/rsvp/parties/63550e7789355bcca9b57bc8')
      //         .done(function (data) {
      //             if (data.error) {
      //                 $('#alert-wrapper').html(alert_markup('danger', data.message));
      //             } else {
      //                 $('#alert-wrapper').html('');
      //                 $('#rsvp-modal').modal('show');
      //             }
      //         })
      //         .fail(function (data) {
      //             console.log(data);
      //             $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
      //         });

      // $.post('https://farrabswedding.free.beeceptor.com/error', data)
      // $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are saving your details.'));

      // if (MD5($('#invite_code').val()) !== 'b0e53b10c1f55ede516b240036b88f40'
      //     && MD5($('#invite_code').val()) !== '2ac7f43695eb0479d5846bb38eec59cc') {
      //     $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> Your invite code is incorrect.'));
      // } else {
      //     $.post('https://script.google.com/macros/s/AKfycbzUqz44wOat0DiGjRV1gUnRf4HRqlRARWggjvHKWvqniP7eVDG-/exec', data)
      //         .done(function (data) {
      //             console.log(data);
      //             if (data.result === "error") {
      //                 $('#alert-wrapper').html(alert_markup('danger', data.message));
      //             } else {
      //                 $('#alert-wrapper').html('');
      //                 $('#rsvp-modal').modal('show');
      //             }
      //         })
      //         .fail(function (data) {
      //             console.log(data);
      //             $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
      //         });
      // }
  });