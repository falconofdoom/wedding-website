
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
const RSVP_GET_PARTY_API_ENDPOINT = 'https://ju331w77pk.execute-api.us-east-1.amazonaws.com/production/rsvp/inviteCode';
const RSVP_UPDATE_PARTY_API_ENDPOINT = 'https://ju331w77pk.execute-api.us-east-1.amazonaws.com/production/rsvp/parties';


$(".next").click(function(){
    $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are looking for your invite.'));
    var partyInfo = getPartyByInviteCode( $('#invite_code').val())
    partyInfo.then(data => {
        showRSVPForm($(this));
        setTimeout(() => {
            $('#alert-wrapper').html('');
        }, 1000);
        prefillRSVP(data)
    }).catch(error => {
        $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
        console.log(error);
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

$("#msform").bind("keypress", function(e) {
    if (e.keyCode == 13) {
        return false;
    }
});

$('#msform').on('submit', function (e) {
    e.preventDefault();
    $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are saving your details.'));

    var data = transformForUpdate(convertFormToJSON($(this)))
    updateRSVP(data).then(response => {
        $('#alert-wrapper').html(alert_markup('info', '<strong>Success!</strong> Your RSVP status has been updated.'));
    }).catch(error => {
        $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
        console.log(error);
    });
});


function transformForUpdate(data) {
    delete data.rsvp_form_guest_name
    delete data.rsvp_guest_id
    var rsvp_guest_ids = Object.entries(data).filter(([key, value])  => key.startsWith('rsvp_guest_id'));
    var rsvp_names = Object.entries(data).filter(([key, value])  => key.startsWith('rsvp_form_guest_name'));
    var rsvp_statuses = Object.entries(data).filter(([key, value])  => key.startsWith('rsvp_status'));
    var result = { "inviteCode": data.invite_code, "guests": [] };

    for (let i = 0; i < rsvp_names.length; i++) {
        result.guests.push({
            "id": rsvp_guest_ids[i][1],
            "rsvpStatus": rsvp_statuses[i][1]
        });
    }
    return result;
}

function getPartyByInviteCode(inviteCode) {
    console.log(inviteCode);
    return fetch(`${RSVP_GET_PARTY_API_ENDPOINT}/${inviteCode}`, {
        headers: {
            'x-api-key': 'j6dXUMr5I66iANmJFL5Iqm8TCh1xhsC3ayRsoyui'
        }
    }).then((response) => response.json());
}

function updateRSVP(data) {
    console.log("In update");
    console.log(JSON.stringify(data));
    return fetch(`${RSVP_UPDATE_PARTY_API_ENDPOINT}/${data.inviteCode}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-api-key': 'j6dXUMr5I66iANmJFL5Iqm8TCh1xhsC3ayRsoyui'
        },
      })
}

function prefillRSVP(data) {

    $('#plus_one_container').html(''); // clear container before prefilling
    data.guests.forEach(guest => {
        $('<div/>', {'class' : 'plus_one row', html: plusOneTemplateHTML()})
        .hide()
        .appendTo('#plus_one_container')
        .slideDown('slow');
    })
    
    data.guests.forEach((guest, index) => {
        var fullName = guest.firstName + " " + guest.lastName
        $(`[name=rsvp_form_guest_name${index}]`).val(fullName).trigger('change'); 
    })
    
    data.guests.forEach((guest, index) => {
        var rsvpStatus = guest.rsvpStatus
        if(rsvpStatus === 'ATTENDING') {
            $(`input:radio[name=rsvp_status${index}][value=ATTENDING]`).click();
        } else {
            $(`input:radio[name=rsvp_status${index}][value=DECLINED]`).click();
        }
    });

    data.guests.forEach((guest, index) => {
        var guestId = guest.id
        $(`[name=rsvp_guest_id${index}]`).val(guestId).trigger('change'); 
    });
}

function plusOneTemplateHTML() //Get the template and update the input field names
{
    var len = $('.plus_one').length;
    var $html = $('.plus_one_template').clone();
    $html.find('[name=rsvp_guest_id]')[0].name="rsvp_guest_id" + len;
    $html.find('[name=rsvp_form_guest_name]')[0].name="rsvp_form_guest_name" + len;
    var rsvpStatusHtml = $html.find('[name=rsvp_status]');
    rsvpStatusHtml[0].name="rsvp_status" + len;
    rsvpStatusHtml[0].id=`rsvp-status-accept${len}`;
    rsvpStatusHtml[1].name="rsvp_status" + len;
    rsvpStatusHtml[1].id=`rsvp-status-decline${len}`;

    return $html.html();    
}

function showRSVPForm(thisForm) {
    if(animating) return false;
	animating = true;
	
	current_fs = thisForm.parent();
	next_fs = thisForm.parent().next();
	
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
}
