jQuery.get(window.location.href, null, addEventListeners)

function addEventListeners(source) {
	var pattern = /_Storage\.basic =  \'.*\'/;
	var result = pattern.exec(source)[0].substr(19).slice(0, -1);

	var elements = document.getElementsByClassName("ep-buttons");
	var i;

	for (i = 1; i < elements.length; i++) {
		// remove event liseners
		clone = elements[i].getElementsByTagName("a")[0].cloneNode(true);
		elements[i].replaceChild(clone, elements[i].getElementsByTagName("a")[0]);

		$(elements[i].getElementsByTagName("a")).on("click", function(){
			var data = JSON.parse($(this)[0].getAttribute("data-episode"));
			alert("Poczekaj 5 sekund a odtwarzacz się pojawi");
			jQuery.get("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_load?auth=" + result);
			setTimeout(function () {
				jQuery.get("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_show?auth=" + result + "&width=765", null, replace);
			}, 5000);
		});
	};
};

function replace(data) {
	// put it to html code
	document.getElementsByClassName("player-online box")[0].innerHTML = data;
};