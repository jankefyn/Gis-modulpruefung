"use strict";
var TextAdventure;
(function (TextAdventure) {
    document.getElementById("screen").addEventListener("touchstart", on_Touch_Start);
    document.getElementById("screen").addEventListener("touchmove", on_Touch_Happening);
    document.getElementById("screen").addEventListener("touchend", on_Touch_End);
    let serverantwort = document.getElementById("serverantwort");
    let startX = 0;
    let startY = 0;
    let distanceX = 0;
    let distanceY = 0;
    let minimumDistance = 120;
    let maximumPerpendicularChange = 100;
    let timeWindow = 500;
    let elapsedTime = 0;
    let startTime = 0;
    function on_Touch_Start(e) {
        e.preventDefault();
        let currentTouchObject = e.changedTouches[0];
        distanceX = 0;
        distanceY = 0;
        startX = currentTouchObject.pageX;
        startY = currentTouchObject.pageY;
        startTime = Date.now();
    }
    TextAdventure.on_Touch_Start = on_Touch_Start;
    function on_Touch_Happening(e) {
        e.preventDefault();
    }
    TextAdventure.on_Touch_Happening = on_Touch_Happening;
    function on_Touch_End(e) {
        e.preventDefault();
        let exportedDirection = "";
        let currentTouchObject = e.changedTouches[0];
        distanceX = currentTouchObject.pageX - startX;
        distanceY = currentTouchObject.pageY - startY;
        elapsedTime = Date.now() - startTime;
        if (elapsedTime <= timeWindow) {
            if (Math.abs(distanceX) >= minimumDistance && Math.abs(distanceY) <= maximumPerpendicularChange) {
                exportedDirection = (distanceX > 0) ? "right" : "left";
            }
            else if (Math.abs(distanceY) >= minimumDistance && Math.abs(distanceX) <= maximumPerpendicularChange) {
                exportedDirection = (distanceY > 0) ? "down" : "up";
            }
        }
        submit(exportedDirection);
    }
    TextAdventure.on_Touch_End = on_Touch_End;
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
            url = url + "down";
        }
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        serverantwort.innerHTML = text;
    }
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=swipe.js.map