"use strict";
var TextAdventure;
(function (TextAdventure) {
    let allesAnzeigeButton = document.getElementById("showAdventures");
    allesAnzeigeButton.addEventListener("click", function () { submit("showAdventures"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://softwaredesign-abgabe.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showAdventures") {
            url = url + "/showAdventures";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=showAdventures.js.map