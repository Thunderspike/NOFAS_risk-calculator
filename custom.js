$( document ).ready(function() {

	$('[data-toggle="tooltip"]').tooltip(); /*tooltip*/

	$("i.fa-sun-o").hover( /*disables tooltip from fa-icon for mouse users*/
		function(){
			setTimeout(function(){
		  		$('.fa-sun-o').tooltip('disable');
			}, 2000);
		}
	);

	$("spam.nofas").hover(
		function(){
			setTimeout(function(){
		  		$('spam.nofas').tooltip('disable');
			}, 2000);
		}
	);

	$('i.fa-sun-o').click(function(){ /*reloads application on click onto the sun icon*/
		location.reload();
		window.scrollTo(0,0);
	});

	$('.assessmentEnabler').hide();  /*shows and hids take assessment modal footer*/
	$('#validationCheckbox').on('click', function(){ 
	    if ( $(this).is(':checked') ) {
	    	$('.buttonAccess').removeAttr('disabled');
	        $('.assessmentEnabler').slideDown();
	    } 
	    else {
	        $('.buttonAccess').attr('disabled','disabled');
	        $('.assessmentEnabler').slideUp();
	    }
	});

	var totalScore = 0; /*scores*/
	var resultString = '';

	var page1Score = 0; 
	var page2Score = 0;
	var page3Score = 0;

	var p1TopError;
	var p2TopError;
	var p2TopError;


	var set1 = 1; 
	var set2 = 1;
	var set3 = 1;

	var currentQ8Choices = []; /*dynamic array of choices made in q8*/
	var q8Info; /*if q8 is empty or not*/

	var q24selected; /**number of boxes checked for q24*/

	/*Home away button*/
	$( "#homeAway" ).click(function() {
		ga('set', 'metric5', 1);
		ga('send', 'event', {'eventCategory': 'assessment', 'eventAction': 'assessmentStart', 'eventLabel': 'Started Assessment'}); //Google Analy
	    $( "#home-Container" ).hide();
	    $('#firstMultiple-Container').show();
	    window.scrollTo(0,0);
	});

	/* ---------- triggers everytime a change in page 1 happens ---------- */
	$( 'select.mpg1, .zero, .one, .two, .three, .four, .five' ).change(function () {
		page1Score = 0;
		for (var u = 0; u < 14; u++) { 
			var tempSel = u+1;
			var question = '.q'+tempSel;	
	   		if (u === 7) { 
	   		 	currentQ8Choices = [];
	   			if ($(question).find('#a, #b, #c, #d, #e').is(":checked")) {
	   				if( $(question).find('#a').is(":checked") ){
	   					currentQ8Choices += 'a';
	   				}
	   				if( $(question).find('#b').is(":checked") ){
	   					currentQ8Choices += 'b';
	   				}
	   				if( $(question).find('#c').is(":checked") ){
	   					currentQ8Choices += 'c';
	   				}
	   				if( $(question).find('#d').is(":checked") ){
	   					currentQ8Choices += 'd';
	   				}
	   				if( $(question).find('#e').is(":checked") ){
	   					currentQ8Choices += 'e';
	   				}
	   				$(question).find('#f').prop('disabled', true);
	   			} else if ($(question).find('#a, #b, #c, #d, #e').not(":checked") ) {
   					$(question).find('#f').prop('disabled', false);
	   			}
	   			if( $(question).find('#f').is(":checked") ){
	   				currentQ8Choices = ['f'];
   					$(question).find('#a').prop('disabled', true);
   					$(question).find('#b').prop('disabled', true);
   					$(question).find('#c').prop('disabled', true);
   					$(question).find('#d').prop('disabled', true);
   					$(question).find('#e').prop('disabled', true);
	   			} else if ( $(question).find('#f').not(":checked") ){
	   				$(question).find('#a').prop('disabled', false);
   					$(question).find('#b').prop('disabled', false);
   					$(question).find('#c').prop('disabled', false);
   					$(question).find('#d').prop('disabled', false);
   					$(question).find('#e').prop('disabled', false);
	   			}
	   			var q8Score = 0;
	   			q8Info = '';
	   			if( currentQ8Choices.includes('a') ){
	   				q8Score = parseInt( $(question).find('#a').attr('value') );
	   			} else if ( (!currentQ8Choices.includes('a')) && ( currentQ8Choices.includes('c') || currentQ8Choices.includes('d') ) ){
	   				q8Score = parseInt($(question).find('#c').attr('value'));
	   			} else if ( (!currentQ8Choices.includes('a') ) && (! (currentQ8Choices.includes('c') && currentQ8Choices.includes('d')) ) && ( currentQ8Choices.includes('b') || currentQ8Choices.includes('e') ) ){
	   				q8Score = parseInt($(question).find('#b').attr('value'));
	   			} else if (currentQ8Choices.includes('f')){
	   				parseIntq8Score = ($(question).find('#f').attr('value'));
	   			} else if (currentQ8Choices.length <= 0){
	   				q8Info = 'Your answer is invalid';
	   			}
	   			if (q8Info == ''){
	   				$('#a8').text('Selected: '+currentQ8Choices.toString()+
	   					'. The weight is '+$(question).attr('name')+
	   					'. Total score: '+ (q8Score * $(question).attr('name')) );
   					page1Score += parseInt(q8Score * $(question).attr('name'));
   					//console.log('Score of Page ' +page1Score)
	   			} else {
	   				$('#a8').text(q8Info);
	   			}
	   			continue; 
	   		}
	   		if( $(question+' option:selected').attr('value') == '' ){
	   			$( ("#a"+tempSel) ).text('Your answer is invalid');
	   		} else if ( $(question+' option:selected').attr('value') !== '' ){
	   			 $( ("#a"+tempSel) ).text( 'Your value is: '+ 
	   			 	$(question+' option:selected').attr('value')+
	   			 	'. The weight is '+ $(question).attr('name')+'. Total score: ' + 
	   			 	($(question+' option:selected').attr('value') * $(question).attr('name')));
	   			 page1Score += parseInt($(question+' option:selected').attr('value') * 
	   			 	$(question).attr('name'));
	   		};
		};
		$('#page1Score').text('Total score for this page: '+page1Score);
	});

	/*Page1 validator and away button*/
	$( "#checkValidity1" ).click(function() {
		var filledElements = 0;
		p1TopError = '';
		for (var u = 0; u < 14; u++) {
			var tempSel = u+1;
			var question = '.q'+tempSel;
			if(u == 7){
				if(q8Info !== ''){
					$(question).addClass('error');
					$(question).parent().addClass('questionError');
					if (p1TopError == ''){
						p1TopError = question;
					}
				} else {
					$(question).parent().addClass('no-error');
					$(question).addClass('no-error');
					filledElements++;
				}
				continue;
			}
			if( $(question+' option:selected').attr('value') == '' || 
				$(question+' option:selected').attr('value') == undefined ){
				//console.log('questions '+ question + ' value is ' + $(question).attr('value') );
				$(question).addClass('error');
				$(question).parent().addClass('questionError');
				if (p1TopError == ''){
					p1TopError = question;
				}
			} else if ( $(question+' option:selected').attr('value') !== '' || 
				$(question+' option:selected').attr('value') !== undefined ){
				$(question).parent().addClass('no-error');
				$(question).addClass('no-error');
				filledElements++;
			}
		}

		//console.log('Page 1 question answered ' + filledElements);
		if(filledElements != 14){
			alert('Please fill in all fields');
			var x = $(p1TopError).parent().parent().parent().offset();
			//console.log(x.top + 'px - ' + p1TopError)
			window.scrollTo(0, ( x.top - 94 ) );
		} else if(filledElements == 14){

			if (set1 == 1){ //send only 1ce
			/*Google Analytics Data */
				ga('set', 'dimension1', page1Score); 
				ga('set', 'metric1', 1);
				ga('send', 'event', {'eventCategory': 'assessment', 'eventAction': 'page1Completion', 'eventLabel': page1Score});
			}; set1 = 0;

			$('#firstMultiple-Container').hide();
			$('#secondMultpile-Container').show();
			window.scrollTo(0,0);
		}
	}); 

	/* ---------- triggers everytime a change in page 2 happens ----------*/
	$( 'select.mpg2').change(function () {
		page2Score = 0;
		for (var u = 14; u < 21; u++) { 
			var tempSel = u+1;
			var question = '.q'+tempSel;	
	   		if( $(question+' option:selected').attr('value') == '' ){
	   			$( ("#a"+tempSel) ).text('Your answer is invalid');
	   			console.log( ("#a"+tempSel) );
	   		} else if ( $(question+' option:selected').attr('value') !== '' ){
	   			 $( ("#a"+tempSel) ).text( 'Your value is: '+ $(question+' option:selected').attr('value')+'. The weight is '+ $(question).attr('name')+'. Total score: ' + ($(question+' option:selected').attr('value') * $(question).attr('name')));
	   			 page2Score += parseInt($(question+' option:selected').attr('value') * $(question).attr('name'));
	   		};
		};
		$('#page2Score').text('Total score for this page: '+page2Score);
	});

	/*Page2 back button*/
	$("#returnToPageQ1").click(function(){
		$("#secondMultpile-Container").hide();
		$('#firstMultiple-Container').show();
	});

	/*Page2 validator and away button*/
	$( "#checkValidity2" ).click(function() {
		var filledElements = 0;
		p2TopError = '';
		for (var u = 14; u < 21; u++) {
			var tempSel = u+1;
			var question = '.q'+tempSel;
			if( $(question+' option:selected').attr('value') == '' || $(question+' option:selected').attr('value') == undefined ){
				//console.log('questions '+ question + ' value is ' + $(question).attr('value') );
				$(question).addClass('error');
				$(question).parent().addClass('questionError');
				if (p2TopError == ''){
					p2TopError = question;
				}
			} else if ( $(question+' option:selected').attr('value') !== '' || $(question+' option:selected').attr('value') !== undefined ){
				$(question).parent().addClass('no-error');
				$(question).addClass('no-error');
				filledElements++;
			}
		}

		//console.log('Page 2 question answered: ' + filledElements);
		if(filledElements != 7){
			alert('Please fill in all fields');
			var x = $(p2TopError).parent().parent().parent().offset();
			console.log(x.top + 'px - ' + p2TopError)
			window.scrollTo(0, ( x.top - 94 ) );
		} else if(filledElements == 7){
			$('#paModal').modal('toggle');
		}
	});

	/*Page3 display button from modal*/
	$("#page3checkpoint").click(function(){

		if (set2 == 1){ //send only 1ce
			/*Google Analytics Data */
			ga('set', 'dimension2', page2Score);
			ga('set', 'metric2', 1);
			ga('send', 'event', {'eventCategory': 'assessment', 'eventAction': 'page2Completion', 'eventLabel': ('page2Score - ' + page2Score)});
		} set2 = 0;

		$("#secondMultpile-Container").hide();
		$('#thirdMultiple-Container').show();
		window.scrollTo(0,0);
	}); 


	/* ----------  triggers everytime a change in page 3 happens ---------- */
	$( 'select.mpg3, .3zero, .3one, .3two, .3three, .3four').change(function () {
		page3Score = 0;
		for (var u = 21; u < 28; u++) { 
			var tempSel = u+1;
			var question = '.q'+tempSel;
			if( u === 23 ) {
				var q24Score = 0;
				q24selected = $(question).find("input:checked").length;
				//console.log('checkboses checked in question 24: '+n);
				if (q24selected == 1){
					q24Score = 1;
				} else if (q24selected == 2 || q24selected == 3){
					q24Score = 2;
				} else if (q24selected == 4 || q24selected == 5){
					q24Score = 3;
				} else {
					q24Score = 0
					$( ("#a"+tempSel) ).text('Your answer is invalid');
				}
				if (q24selected > 0){
					$( ("#a"+tempSel) ).text( 'Your value is: '+ q24Score +
						'. The weight is '+ $(question).attr('name') +
						'. Total score: ' + (q24Score * $(question).attr('name')));
	   			 	page3Score += parseInt(q24Score * $(question).attr('name'));
				}
				continue;
			}	
	   		if( $(question+' option:selected').attr('value') == '' ){
	   			$( ("#a"+tempSel) ).text('Your answer is invalid');
	   		} else if ( $(question+' option:selected').attr('value') !== '' ){
	   			 $( ("#a"+tempSel) ).text( 'Your value is: '+ $(question+' option:selected').attr('value')+
	   			 	'. The weight is '+ $(question).attr('name')+'. Total score: ' + 
	   			 	($(question+' option:selected').attr('value') * $(question).attr('name')));
	   			 page3Score += parseInt($(question+' option:selected').attr('value') * $(question).attr('name'));
	   		};
		};
		//console.log(page3Score);
		$('#page3Score').text('Total score for this page: '+ page3Score);
	});

	/*Page3 back button*/
	$("#returnToPageQ2").click(function(){
		$("#thirdMultiple-Container").hide();
		$('#secondMultpile-Container').show();
	});

	/*validates page 3 and props result modal*/
	$( "#submitData" ).click(function() {
		var filledElements = 0;
		p3TopError = '';
		for (var u = 21; u < 28; u++) {
			var tempSel = u+1;
			var question = '.q'+tempSel;
			if( u === 23 ) {
				if( q24selected < 1){
					$(question).addClass('error');
					$(question).parent().addClass('questionError');
					if (p3TopError == ''){
						p3TopError = question;
					}
				} else if ( q24selected > 0 ){
					$(question).parent().addClass('no-error');
					$(question).addClass('no-error');
					filledElements++;
				}
				continue;
			}
			if( $(question+' option:selected').attr('value') == '' || 
				$(question+' option:selected').attr('value') == undefined ){
				$(question).addClass('error');
				$(question).parent().addClass('questionError');
				if (p3TopError == ''){
					p3TopError = question;
				}
			} else if ( $(question+' option:selected').attr('value') !== '' || 
				$(question+' option:selected').attr('value') !== undefined ){
				$(question).parent().addClass('no-error');
				$(question).addClass('no-error');
				filledElements++;
			}
		}

		//console.log('Page 3 question answered: ' + filledElements);
		if(filledElements != 7){
			alert('Please fill in all fields');
			var x = $(p3TopError).parent().parent().parent().offset();
			//console.log(x.top + 'px - ' + p3TopError)
			window.scrollTo(0, ( x.top - 94 ) );
		}else if(filledElements == 7){
			$('#resultModal').modal('toggle');
		}
	});

	var rTitle = $('#risk-title');
	var rDescription = $('#risk-description');
	var rBorder = $('#risk-border');
	var rBox1 = $('#risk-box-1');
	var rBox2 = $('#risk-box-2');

	/*results display button*/
	$("#displayResults, #selectScore").click(function(){
		
		/*Google Analytics Data */
		ga('set', 'dimension3', page3Score);
		ga('set', 'metric3', 1);
		ga('send', 'event', {'eventCategory': 'assessment', 'eventAction': 'page3Completion', 'eventLabel': ('page3Score - '+ page3Score)});

		$('#thirdMultiple-Container').hide();
		resultString = '';
		var totalScore = $('.scorePicker').val() ? $('.scorePicker').val() : (page1Score + page2Score + page3Score);
		//totalScore = 26;
		//console.log("The score should be " + ($('.scorePicker').val() ? $('.scorePicker').val() : (page1Score + page2Score + page3Score)));
		$('#displayTotal').text('Your total assessed score is: '+totalScore);
		window.scrollTo(0,0);
		var colorTheme;
		$('.colorpicker').change(function() {
			$('#labelColor').text($('.colorpicker').val());
			colorTheme = $('.colorpicker').val().toString();
			$('.risk-title').css({'color': colorTheme, 'border-bottom': '3px solid '+ colorTheme});
			rDescription.css('background-color', colorTheme);
			rDescription.css({'color': 'black', 'background': 'linear-gradient(32.7deg, '+colorTheme+' , #fcf428, '+ colorTheme +')'});
			rBorder.css({'margin-top' : '1.2em','border':'5px solid '+colorTheme, 'border-radius': '8px', 'padding': '8px 8px 8px 25px', 'border-top-style':'none', 'border-bottom-style' : 'none'});
			rBox1.css({'margin-top' : '2em', 'border' : '5px double '+colorTheme , 'outline' : 'solid 7px ' + colorTheme , 'padding' : '8px'});
			rBox2.css({'border' : '5px double '+colorTheme , 'outline' : 'solid 7px '+ colorTheme , 'padding' : '8px' , 'margin-top' : '7px' , 'padding-right' : '9px'});
		});
		if(totalScore >= 0 && totalScore <= 25){ // Almost No Risk
			colorTheme = colorTheme  ? colorTheme : '#1ed579'; 
			$('.risk-title').text('Almost No Risk'); resultString = 'Almost No Risk';
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white','background': 'linear-gradient(32.7deg, '+colorTheme+' , #1bc46f, '+ colorTheme +')'});
			rDescription.text('It is not likely that your child will have an FASD. Abstain from alcohol for the remainder of your pregnancy and take prenatal vitamins.');
		} else if (totalScore >= 26 && totalScore <= 50){ // Very Low Risk
			colorTheme = colorTheme  ? colorTheme : '#4eba35'
			$('.risk-title').text('Very Low Risk'); resultString = 'Very Low Risk';
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white', 'background': 'linear-gradient(32.7deg, '+colorTheme+' , #45a82f, '+ colorTheme +')'});
			rDescription.text('There is a very low chance your child will have FASD or other effects. Abstain from alcohol for the remainder of your pregnancy');
		} else if (totalScore >= 51 && totalScore <= 75){ // Low Risk
			colorTheme = colorTheme  ? colorTheme : '#f9f12a';
			$('.risk-title').text('Low Risk'); resultString = 'Low Risk';
			$('.risk-title').css("text-shadow", "0px 1.09px  #000000");
			rDescription.css({'color': 'black', 'background': 'linear-gradient(32.7deg, '+colorTheme+' , #fcf428, '+ colorTheme +')'});
			rDescription.text("There is a small chance your child could have some effects. Avoid increasing your child's risk by abstaining from alcohol for the remainder of your pregnancy.");
		} else if (totalScore >= 76 && totalScore <= 100){ //Low-Moderate Risk
			colorTheme = colorTheme  ? colorTheme : '#e0a021';
			$('.risk-title').text('Low-Moderate Risk'); resultString = 'Low-Moderate Risk'
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white','background': 'linear-gradient(32.7deg, '+colorTheme+' , #d1941d, '+ colorTheme +')'});
			rDescription.text("There is a low-moderate chance your child will develop FASD. Avoid increasing your child's risk by abstaining from alcohol for the remainder of your pregnancy.");
		} else if (totalScore >= 101 && totalScore <= 120){ // Moderate Risk
			colorTheme = colorTheme  ? colorTheme : '#c6590b';
			$('.risk-title').text('Moderate Risk'); resultString = 'Moderate Risk';
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white','background': 'linear-gradient(32.7deg, '+colorTheme+' , #b55009, '+ colorTheme +')'});
			rDescription.text("There is a moderate risk your child will develop FASD. Avoid increasing your child's risk by abstaining from alcohol for the remainder of your pregnancy. Speak to your provider if you are concerned about your alcohol intake. Seek help if you are unable to stop drinking on your own.");
		} else if (totalScore >= 121 && totalScore <= 140){ // Moderate-Increased Risk
			colorTheme = colorTheme  ? colorTheme : '#e85151'; 
			$('.risk-title').text('Moderate-Increased Risk'); resultString = 'Moderate-Increased Risk';
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white','background': 'linear-gradient(32.7deg, '+colorTheme+' , #d64848, '+ colorTheme +')'});
			rDescription.text("There is a moderate-increased risk your child will develop FASD. Avoid increasing your child's risk by abstaining from alcohol for the remainder of your pregnancy. Speak to your provider if you are concerned about your alcohol intake or need help connecting to resources. Seek help if you are unable to stop drinking on your own.");
		} else if (totalScore >= 141 && totalScore <= 160){ // Increased Risk
			colorTheme = colorTheme  ? colorTheme : '#ce180f';
			$('.risk-title').text('Increased Risk'); resultString = 'Increased Risk';
			$('.risk-title').css("text-shadow", "0px 0px  #000000");
			rDescription.css({'color': 'white','background': 'linear-gradient(32.7deg, '+colorTheme+' , #c6140b, '+ colorTheme +')'});
			rDescription.text("Your child is at increased risk for FASD. Speak to your provider about your alcohol intake and connecting to resources. Avoid increasing your child's risk by abstaining from alcohol for the remainder of your pregnancy. Learn about the FASD signs and symptoms and how you can get a proper diagnosis for your child, if necessary. Seek help if you are unable to stop drinking on your own.");
		} 

		$('.risk-title').css({'color': colorTheme, 'border-bottom': '3px solid '+ colorTheme});
		rDescription.css('background-color', colorTheme);
		rBorder.css({'margin-top' : '1.2em','border':'5px solid '+colorTheme, 'border-radius': '8px', 'padding': '8px 8px 8px 25px', 'border-top-style':'none', 'border-bottom-style' : 'none'});
		rBox1.css({'margin-top' : '2em', 'border' : '5px double '+colorTheme , 'outline' : 'solid 7px ' + colorTheme , 'padding' : '8px'});
		rBox2.css({'border' : '5px double '+colorTheme , 'outline' : 'solid 7px '+ colorTheme , 'padding' : '8px' , 'margin-top' : '7px' , 'padding-right' : '9px'});

		$('.resourceLinks > div p a').hover(
			function(){
				$(this).css({'background-color': colorTheme, 'color' : 'white'})
			}
		) 
		$('.resourceLinks > div p a').mouseout(
			function(){
				$(this).css({'background-color': 'initial', 'color' : '#555'})
			}
		)
		$('#resultScreen-Container').show();

		/*Google Analytics Data */
		ga('set', 'dimension4', totalScore);
		ga('set', 'metric4', 1);
		ga('send', 'event', {'eventCategory': 'assessment', 'eventAction': 'assessmentCompletion', 'eventLabel' : (totalScore + ': ' + resultString)});

	}); 

});