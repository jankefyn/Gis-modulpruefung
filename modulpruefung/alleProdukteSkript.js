"use strict";
var Modulpruefung;
(function (Modulpruefung) {
    let allesAnzeigeButton = document.getElementById("showProducts");
    allesAnzeigeButton.addEventListener("click", function () { submit("showProducts"); });
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
        //let url: string = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        if (_parameter == "showProducts") {
            url = url + "/showProducts";
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
            url = url + "/fastAbgelaufen";
        }
        if (_parameter == "filternNachName") {
            url = url + "/filternNachName";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(Modulpruefung || (Modulpruefung = {}));
//# sourceMappingURL=alleProdukteSkript.js.map