"use strict";
var p2_3;
(function (p2_3) {
    p2_3.keyTypOben = 0;
    p2_3.keyTypUnten = 1;
    p2_3.keyTypMitte = 2;
    p2_3.auswahl = { oben: undefined, mitte: undefined, unten: undefined };
    //bei jedem neu laden wird, wenn der session storage an der zugehörigen stelle nicht undefiniert is, die auswahl in das gespeichertebilderDiv übergeben 
    window.addEventListener("load", finishedloading);
    function finishedloading() {
        let gespeicherteBilderDiv = document.getElementById("gespeicherteBilder");
        if (sessionStorage.getItem("" + p2_3.keyTypOben) != undefined) {
            let ladeOben = JSON.parse(sessionStorage.getItem("" + p2_3.keyTypOben));
            let vorschauOben = document.createElement("img");
            vorschauOben.src = ladeOben.oben.link;
            gespeicherteBilderDiv.appendChild(vorschauOben);
        }
        if (sessionStorage.getItem("" + p2_3.keyTypMitte) != undefined) {
            let ladeMitte = JSON.parse(sessionStorage.getItem("" + p2_3.keyTypMitte));
            let vorschauMitte = document.createElement("img");
            vorschauMitte.src = ladeMitte.mitte.link;
            gespeicherteBilderDiv.appendChild(vorschauMitte);
        }
        if (sessionStorage.getItem("" + p2_3.keyTypUnten) != undefined) {
            let ladeUnten = JSON.parse(sessionStorage.getItem("" + p2_3.keyTypUnten));
            let vorschauUnten = document.createElement("img");
            vorschauUnten.src = ladeUnten.unten.link;
            gespeicherteBilderDiv.appendChild(vorschauUnten);
        }
    }
    //den im html deklarierten knöpfen wird hier ein eventlistener gegeben der beim klicken die jeweilige function aufruft
    let buttonUnten = document.getElementById("buttonUnten");
    buttonUnten.addEventListener("click", openUnten);
    let buttonMitte = document.getElementById("buttonMitte");
    buttonMitte.addEventListener("click", openMitte);
    let buttonOben = document.getElementById("buttonOben");
    buttonOben.addEventListener("click", openOben);
    let buttonAll = document.getElementById("buttonAll");
    buttonAll.addEventListener("click", openAll);
    //wenn diese funktionen aufgerufen werden wird die jeweilige seite geladen 
    function openUnten() {
        window.open("AuswahlUnten.html", "_self");
    }
    function openMitte() {
        window.open("AuswahlMitte.html", "_self");
    }
    function openOben() {
        window.open("AuswahlOben.html", "_self");
    }
    function openAll() {
        window.open("Gesamtbild.html", "_self");
    }
    ladeBilderAusJSON("data.json");
    //in dieser async funktion wird die beim aufrufen übergebene data json benutzt um die bilder auf ihre jeweilige seite zu bringen
    //außerdem bekommen die bilder einen eventlistener der beim mausklick die funktion auswaehlen aufruft
    async function ladeBilderAusJSON(_url) {
        let response = await fetch(_url);
        let json = JSON.stringify(await response.json());
        let objectJson = JSON.parse(json);
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlOben.html") {
            let bilderDiv = document.getElementById("bilder");
            for (let counter = 0; counter < objectJson.oben.length; counter++) {
                let meinbild = document.createElement("img");
                meinbild.addEventListener("click", function () { auswaehlen(objectJson.oben[counter]); });
                meinbild.src = objectJson.oben[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlUnten.html") {
            let bilderDiv = document.getElementById("bilder");
            for (let counter = 0; counter < objectJson.unten.length; counter++) {
                let meinbild = document.createElement("img");
                meinbild.addEventListener("click", function () { auswaehlen(objectJson.unten[counter]); });
                meinbild.src = objectJson.unten[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlMitte.html") {
            let bilderDiv = document.getElementById("bilder");
            for (let counter = 0; counter < objectJson.mitte.length; counter++) {
                let meinbild = document.createElement("img");
                meinbild.addEventListener("click", function () { auswaehlen(objectJson.mitte[counter]); });
                meinbild.src = objectJson.mitte[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
    }
    //in dieser funktion werden die angecklickten bilder in der auswahl abgespeichert und diese wiederum als string in den sessionStorage übergeben 
    function auswaehlen(_bild) {
        if (_bild.typ == p2_3.keyTypOben) {
            p2_3.auswahl.oben = _bild;
        }
        if (_bild.typ == p2_3.keyTypUnten) {
            p2_3.auswahl.unten = _bild;
        }
        if (_bild.typ == p2_3.keyTypMitte) {
            p2_3.auswahl.mitte = _bild;
        }
        let auswahlJSON = JSON.stringify(p2_3.auswahl);
        sessionStorage.setItem("" + _bild.typ, auswahlJSON);
    }
    // diese funktion erwartet die antwort der seite und gibt die jeweilige antwort an das entscprechende div weiter
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "Gesamtbild.html") {
        servercheck();
    }
    async function servercheck() {
        let query = new URLSearchParams(sessionStorage);
        let url = "https://gis-communication.herokuapp.com";
        url = url + "?" + query.toString();
        let serverantwort = await fetch(url);
        let rückmeldung = await serverantwort.json();
        if (rückmeldung.error != undefined) {
            console.log(rückmeldung.error);
            let messagediv = document.getElementById("messageerror");
            messagediv.appendChild(document.createTextNode("" + rückmeldung.error));
        }
        else if (rückmeldung.message != undefined) {
            console.log(rückmeldung.message);
            let messagediv = document.getElementById("message");
            messagediv.appendChild(document.createTextNode("" + rückmeldung.message));
        }
    }
})(p2_3 || (p2_3 = {}));
//# sourceMappingURL=script.js.map