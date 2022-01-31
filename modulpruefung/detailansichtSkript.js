"use strict";
var modulpruefung;
(function (modulpruefung) {
    let allesAnzeigeButton = document.getElementById("showProducts");
    allesAnzeigeButton.addEventListener("click", function () { submit("showProducts"); });
    let speicherButton = document.getElementById("zahlSpeichern");
    speicherButton.addEventListener("click", function () { submit("showDetail"); });
    let loeschenButton = document.getElementById("deleteProduct");
    loeschenButton.addEventListener("click", function () { submit("deleteProduct"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showProducts") {
            url = url + "/showProducts";
        }
        if (_parameter == "showDetail") {
            url = url + "/showDetail";
        }
        if (_parameter == "deleteProduct") {
            url = url + "/deleteProduct";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(modulpruefung || (modulpruefung = {}));
//# sourceMappingURL=detailansichtSkript.js.map