 function sizeScoreB() {   
            var elementWidth = window.innerWidth;
            if (elementWidth>2000) {
                $('#scoreboard').removeClass("scoreboard_small").addClass("scoreboard_large");
                $('#scoreboard>i').removeClass("fa-2x").addClass("fa-4x");
            }
            else {
                $('#scoreboard').removeClass("scoreboard_large").addClass("scoreboard_small");
                $('#scoreboard>i').removeClass("fa-4x").addClass("fa-2x");
            }
        }
    	$(document).ready(sizeScoreB()); 
        $(window).on('resize', function(){
            sizeScoreB();
        });
		var socket = io();
    	socket.on('kill', function(data){
    		if(data.pkld==1) {
    			$("#redp").removeClass("fa-circle").addClass("fa-times-circle");
    		}
    		else if(data.pkld==2) {
    			$("#greenp").removeClass("fa-circle").addClass("fa-times-circle");
    		}
    		else if(data.pkld==3) {
    			$("#bluep").removeClass("fa-circle").addClass("fa-times-circle");
    		}
    		else if(data.pkld==4) {
    			$("#yellowp").removeClass("fa-circle").addClass("fa-times-circle");
    		}

       	});
       	socket.on('newplayer', function(plnum){
    		if(plnum==1) {
    			$("#redp").removeClass("fa-circle-thin").addClass("fa-circle");
    		} else if(plnum==2) {
    			$("#greenp").removeClass("fa-circle-thin").addClass("fa-circle");
    		} else if(plnum==3) {
    			$("#bluep").removeClass("fa-circle-thin").addClass("fa-circle");
    		} else if(plnum==4) {
    			$("#yellowp").removeClass("fa-circle-thin").addClass("fa-circle");
    		}
    	});