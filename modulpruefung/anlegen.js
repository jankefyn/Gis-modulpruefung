"use strict";
var Modulpruefung;
(function (Modulpruefung) {
    let submitbuttonHTML = document.getElementById("saveAdventure");
    submitbuttonHTML.addEventListener("click", function () { submit("saveAdventure"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "saveAdventure") {
            url = url + "/saveAdventure";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(Modulpruefung || (Modulpruefung = {}));
//# sourceMappingURL=anlegen.js.map