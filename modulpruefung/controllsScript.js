"use strict";
var TextAdventure;
(function (TextAdventure) {
    let buttonLeft = document.getElementById("buttonLeft");
    buttonLeft.addEventListener("click", function () { submit("left"); });
    let buttonRight = document.getElementById("buttonRight");
    buttonRight.addEventListener("click", function () { submit("right"); });
    let buttonUp = document.getElementById("buttonUp");
    buttonUp.addEventListener("click", function () { submit("up"); });
    let buttonDown = document.getElementById("buttonDown");
    buttonDown.addEventListener("click", function () { submit("down"); });
    let adventureAussuchen = document.getElementById("adventureAussuchen");
    adventureAussuchen.addEventListener("click", function () { submit("selectAdventure"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "left") {
            url = url + "/left";
        }
        if (_parameter == "right") {
            url = url + "/right";
        }
        if (_parameter == "up") {
            url = url + "/up";
        }
        if (_parameter == "down") {
            url = url + "/down";
        }
        if (_parameter == "selectAdventure") {
            url = url + "/selectAdventure";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=controllsScript.js.map