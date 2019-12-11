// ==UserScript==
// @name         shinden.pl bypass
// @version      1.0
// @description  Odtwarzanie filmów na shinden.pl bez Nano Defender dla uBlock Origin / Nano Adblocker, AdGuard ma zintegrowane odpowiednie filtry skryptowe lub oparte na modyfikatorze replace.
// @author       DeEpicOfGames
// @icon         https://github.com/DeEpicOfGames/Shinden-unlocker-anti-adblock-bypass/raw/master/src/icons/favicon.png
// @homepage     https://github.com/DeEpicOfGames/Shinden-unlocker-anti-adblock-bypass/
// @downloadURL  https://raw.githubusercontent.com/DeEpicOfGames/Shinden-unlocker-anti-adblock-bypass/master/tampermonkney-script.user.js
// @include      /^https?://shinden.pl/(episode|epek)/*/
// @connect      api4.shinden.pl
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

function getReq(theUrl, callback=null)
{
	GM_xmlhttpRequest({
        method: "GET",
        url: theUrl,
        onload: function(response) {
            callback(response.responseText)
        }
    })
};

function addEventListeners(source) {
	var pattern = /_Storage\.basic =  \'.*\'/;
	var result = pattern.exec(source)[0].substr(19).slice(0, -1);

	var elements = document.getElementsByClassName("ep-buttons");
	var i;

	for (i = 1; i < elements.length; i++) {
		var clone = elements[i].getElementsByTagName("a")[0].cloneNode(true);
		elements[i].replaceChild(clone, elements[i].getElementsByTagName("a")[0]);

		elements[i].getElementsByTagName("a")[0].addEventListener("click", function(event){
			var data = JSON.parse(event.target.getAttribute("data-episode"));
			getReq("https://api4.shinden.pl/xhr/" + data["online_id"] + "/player_load?auth=" + result);
			countdown(5, [data, result]);
		});
	};
};

function replace(player) {
	document.getElementsByClassName("player-online box")[0].innerHTML = player;
};

function countdown(time, array)
{
	if (time <= 0) {
		getReq("https://api4.shinden.pl/xhr/" + array[0]["online_id"] + "/player_show?auth=" + array[1] + "&width=765", replace);
	} else {
		document.getElementsByClassName("player-online box")[0].innerHTML = "<h2> Odliczanie: " + time.toString() + "</h2>";
		setTimeout(function() {
			countdown(time-1, array);
		}, 1000);
	};
};

getReq(window.location.href, addEventListeners);