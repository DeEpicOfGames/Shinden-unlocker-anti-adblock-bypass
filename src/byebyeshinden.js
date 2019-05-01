var data;
var result;

function getReq(theUrl, callback=null)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (callback != null && xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
};

function addEventListeners(source) {
	var pattern = /_Storage\.basic =  \'.*\'/;
	result = pattern.exec(source)[0].substr(19).slice(0, -1);
	
	var elements = document.getElementsByClassName("ep-buttons");
	var i;

	for (i = 1; i < elements.length; i++) {
		// remove event listeners
		clone = elements[i].getElementsByTagName("a")[0].cloneNode(true);
		elements[i].replaceChild(clone, elements[i].getElementsByTagName("a")[0]);

		elements[i].getElementsByTagName("a")[0].addEventListener("click", function(event){
			data = JSON.parse(event.target.getAttribute("data-episode"));
			getReq("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_load?auth=" + result);
			countdown(5);
		});
	};
};

function countdown(time)
{
	if (time <= 0) {
		getReq("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_show?auth=" + result + "&width=765", replace);
	} else {
		document.getElementsByClassName("player-online box")[0].innerHTML = "<h2> Odliczanie: " + time.toString() + "</h2>";
		setTimeout(function() {
			countdown(time-1);
		}, 1000);
	};
};

function replace(player) {
	// put it to html code
	document.getElementsByClassName("player-online box")[0].innerHTML = player;
};

getReq(window.location.href, addEventListeners);