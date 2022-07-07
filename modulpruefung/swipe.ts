namespace TextAdventure {

document.getElementById("screen").addEventListener("touchstart", on_Touch_Start);

document.getElementById("screen").addEventListener("touchmove", on_Touch_Happening);

document.getElementById("screen").addEventListener("touchend", on_Touch_End);

let serverantwort: HTMLElement = document.getElementById("serverantwort");

let startX: number = 0;
let startY: number = 0;
let distanceX: number = 0;
let distanceY: number = 0;
let minimumDistance: number = 120;
let maximumPerpendicularChange: number = 100;
let timeWindow: number = 500;
let elapsedTime: number = 0;
let startTime: number = 0;

export function on_Touch_Start(e: TouchEvent): void {
    e.preventDefault();
    let currentTouchObject: Touch = e.changedTouches[0];
    distanceX = 0;
    distanceY = 0;
    startX = currentTouchObject.pageX;
    startY = currentTouchObject.pageY;
    startTime = Date.now();
}

export function on_Touch_Happening(e: TouchEvent): void {
    e.preventDefault();
}

export function on_Touch_End(e: TouchEvent): void {
    e.preventDefault();
    let exportedDirection: string = "";
    let currentTouchObject: Touch = e.changedTouches[0];
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
async function submit(_parameter: string): Promise<void> {
    let formData: FormData = new FormData(document.forms[0]);
    let url: string = "https://gis-modulpruefung.herokuapp.com/";
    //let url: string = "http://localhost:8100/";
    let query: URLSearchParams = new URLSearchParams(<any>formData);

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
    let response: Response = await fetch(url);
    let text: string = await response.text();

    serverantwort.innerHTML = text;




}
}



