//var apiKey = 'AIzaSyAzQAuJA4hn8S8j6DkSetnTVV-Y2RZRYCE';
var apiKey= 'AIzaSyAso9k8A6SVylVBO9e7FdZMIS8OMiVcKHc';
var num = 0;
var users= [];

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);    
 }

function getName(userId){
	var exists=false;
	gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': userId
        });

        request.execute(function(resp) {

        	for(i = 0; i < num; i++){
        		if (users[i]==resp.displayName){
        			exists=true;
        		}
        	}
        	if (!exists){
        		console.log("Nombre "+resp.displayName);
        		$("#list_users").append('<li n="'+resp.displayName+'" draggable="true" value="'+resp.displayName+'">' + resp.displayName + '</li>');

        		$(function() {
        			$("#list_users li").draggable({revert:true, appendTo:"body", helper:"clone"});
       			});

       			users[num]=resp.displayName;

        		num = num + 1;
        	}
        });
    });

};


$(document).ready(function(){
	$("#google").click(function(event){

		$('#info3').html('');
		 
		try {
		 
			var host = "ws://localhost:8080/";
			console.log("Host:", host);
					
			var s = new WebSocket(host);
					
			s.onopen = function (e) {
				console.log("Socket opened.");
				 s.send("ey");
			};
					
			s.onclose = function (e) {
				console.log("Socket closed.");
			};
					
			s.onmessage = function (e) {
				console.log("Socket message:", e.data);
				getName(e.data);

			};
					
			s.onerror = function (e) {
					console.log("Socket error:", e);
			};
					
		} catch (ex) {
				console.log("Socket exception:", ex);
		}
	});
});