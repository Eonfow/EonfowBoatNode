$(document).on('click', '.positive.button',function(){
    $('.ui.information').addClass('loading');	
    $.ajax({
		    url: '/bot/start',
		    method: 'GET',
		    chache: false,
		    complete: function(respJson){
		    	changeFields(respJson['responseText'], true);
		    }
		});
});

$(document).on('click', '.negative.button', function(){
    $('.ui.information').addClass('loading');	
    $.ajax({
		    url: '/bot/end',
		    method: 'GET',
		    chache: false,
		    complete: function(respJson){
		    	changeFields(respJson['responseText'], false);
		    }
		});
});

function changeFields(stringJson, positive){
	var respJson = JSON.parse(stringJson);

	$.each(respJson, function(key, value) {
		if(key == 'client'){
   			$.each(value, function(key2, value2) {
       			var id2 = "#" + key2;
       		
        		$(id2).empty();
        		$(id2).html(value2.toString());
    		});		    	   
    	}else{
   			var id = "#" + key;
   
   		    $(id).empty();
   		    
   		    if(key=='channels'){
    	    	var values = value.toString().split(',');
    	    	
    	    	for(var i = 0; i < values.length; i++){
    	    		if(i === 0){
    	    			if(values[i] !== 'none')
    	    				value = values[i].substr(1);
    	    		}else{
    	    			value += ', ' + values[i].substr(1);
    	    		}
    	    	}
   		    }
   		    
   		    $(id).html(value.toString());
		}
	});
	
	if(positive){
		$('.positive.button').addClass('disabled');
    	$('.negative.button').removeClass('disabled');
	}else{
		$('.negative.button').addClass('disabled');
    	$('.positive.button').removeClass('disabled');
	}
	
	$('.ui.information').removeClass('loading');	    
}