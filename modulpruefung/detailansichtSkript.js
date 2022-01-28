"use strict";
var P3_1;
(function (P3_1) {
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
})(P3_1 || (P3_1 = {}));
//# sourceMappingURL=detailansichtSkript.js.map