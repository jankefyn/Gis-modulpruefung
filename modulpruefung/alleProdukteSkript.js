"use strict";
var Modulpruefung;
(function (Modulpruefung) {
    let allesAnzeigeButton = document.getElementById("showAdventures");
    allesAnzeigeButton.addEventListener("click", function () { submit("showAdventures"); });
    let filternNachNameButton = document.getElementById("filternNachName");
    filternNachNameButton.addEventListener("click", function () { submit("filternNachName"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showAdventures") {
            url = url + "/showAdventures";
        }
        if (_parameter == "filternNachName") {
            url = url + "/filternNachName";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(Modulpruefung || (Modulpruefung = {}));
//# sourceMappingURL=alleProdukteSkript.js.map