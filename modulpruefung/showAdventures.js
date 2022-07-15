"use strict";
var TextAdventure;
(function (TextAdventure) {
    let showAdventures = document.getElementById("showAdventures");
    showAdventures.addEventListener("click", function () { submit("showAdventures"); });
    let showMoreAdventures = document.getElementById("showMoreAdventures");
    showMoreAdventures.addEventListener("click", function () { submit("more"); });
    let showLessAdventures = document.getElementById("showLessAdventures");
    showLessAdventures.addEventListener("click", function () { submit("less"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://softwaredesign-abgabe.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showAdventures") {
            url = url + "/normal";
        }
        if (_parameter == "more") {
            url = url + "/more";
        }
        if (_parameter == "less") {
            url = url + "/less";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=showAdventures.js.map