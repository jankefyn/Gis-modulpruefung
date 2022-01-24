"use strict";
var P3_1;
(function (P3_1) {
    let anzeigeButton = document.getElementById("showUsers");
    anzeigeButton.addEventListener("click", function () { submit("showUsers"); });
    /*zweite funktion der Seite alleProdukte*/
    let speicherButton = document.getElementById("zahlSpeichern");
    speicherButton.addEventListener("click", function () { submit("saveNumber"); });
    /*zweite funktion der Seite alleProdukte ende*/
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showUsers") {
            url = url + "/showUsers";
        }
        if (_parameter == "saveNumber") {
            url = url + "/saveNumber";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(P3_1 || (P3_1 = {}));
//# sourceMappingURL=alleProdukteSkript.js.map