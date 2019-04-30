function getReq(theUrl, callback=null)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
};

function addEventListeners(source) {
	var pattern = /_Storage\.basic =  \'.*\'/;
	var result = pattern.exec(source)[0].substr(19).slice(0, -1);
	
	var elements = document.getElementsByClassName("ep-buttons");
	var i;

	for (i = 1; i < elements.length; i++) {
		// remove event liseners
		clone = elements[i].getElementsByTagName("a")[0].cloneNode(true);
		elements[i].replaceChild(clone, elements[i].getElementsByTagName("a")[0]);

		elements[i].getElementsByTagName("a")[0].addEventListener("click", function(event){
			var data = JSON.parse(event.target.getAttribute("data-episode"));
			alert("Poczekaj 5 sekund a odtwarzacz się pojawi");
			getReq("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_load?auth=" + result);
			setTimeout(function () {
				getReq("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_show?auth=" + result + "&width=765", replace);
			}, 5000);
		});
	};
};

function replace(data) {
	// put it to html code
	document.getElementsByClassName("player-online box")[0].innerHTML = data;
};

getReq(window.location.href, addEventListeners);
