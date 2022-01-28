"use strict";
var P3_1;
(function (P3_1) {
    let submitbuttonHTML = document.getElementById("saveProduct");
    submitbuttonHTML.addEventListener("click", function () { submit("saveProduct"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        let query = new URLSearchParams(formData);
        if (_parameter == "saveProduct") {
            url = url + "/saveProduct";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(P3_1 || (P3_1 = {}));
//# sourceMappingURL=anlegen.js.map