"use strict";
var P3_1;
(function (P3_1) {
    let loginButton = document.getElementById("login");
    loginButton.addEventListener("click", function () { submit("login"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        let query = new URLSearchParams(formData);
        if (_parameter == "login") {
            url = url + "/login";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(P3_1 || (P3_1 = {}));
//# sourceMappingURL=anmeldungSkript.js.map