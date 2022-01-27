"use strict";
var P3_1;
(function (P3_1) {
    let allesAnzeigeButton = document.getElementById("showUsers");
    allesAnzeigeButton.addEventListener("click", function () { submit("showUsers"); });
    /*einzelne kategorien:*/
    let meatAnzeigeButton = document.getElementById("showMeat");
    meatAnzeigeButton.addEventListener("click", function () { submit("showMeat"); });
    let milkAnzeigeButton = document.getElementById("showMilk");
    milkAnzeigeButton.addEventListener("click", function () { submit("showMilk"); });
    let fruitsAnzeigeButton = document.getElementById("showFruits");
    fruitsAnzeigeButton.addEventListener("click", function () { submit("showFruits"); });
    let drinksAnzeigeButton = document.getElementById("showDrinks");
    drinksAnzeigeButton.addEventListener("click", function () { submit("showDrinks"); });
    let abgelaufenAnzeigeButton = document.getElementById("abgelaufen");
    abgelaufenAnzeigeButton.addEventListener("click", function () { submit("abgelaufen"); });
    let fastAbgelaufenAnzeigeButton = document.getElementById("fastAbgelaufen");
    fastAbgelaufenAnzeigeButton.addEventListener("click", function () { submit("fastAbgelaufen"); });
    let filternNachNameButton = document.getElementById("filternNachName");
    filternNachNameButton.addEventListener("click", function () { submit("filternNachName"); });
    let serverantwort = document.getElementById("serverantwort");
    async function submit(_parameter) {
        let formData = new FormData(document.forms[0]);
        let url = "https://gis-modulpruefung.herokuapp.com/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showUsers") {
            url = url + "/showUsers";
        }
        if (_parameter == "showMeat") {
            url = url + "/showMeat";
        }
        if (_parameter == "showMilk") {
            url = url + "/showMilk";
        }
        if (_parameter == "showFruits") {
            url = url + "/showFruits";
        }
        if (_parameter == "showDrinks") {
            url = url + "/showDrinks";
        }
        if (_parameter == "abgelaufen") {
            url = url + "/abgelaufen";
        }
        if (_parameter == "fastAbgelaufen") {
            url = url + "fastAbgelaufen";
        }
        if (_parameter == "filternNachName") {
            url = url + "filternNachName";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(P3_1 || (P3_1 = {}));
//# sourceMappingURL=alleProdukteSkript.js.map