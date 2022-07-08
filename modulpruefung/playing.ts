namespace TextAdventure {




let buttonLeft: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonLeft");
buttonLeft.addEventListener("click", function (): void { submit("left"); });
let buttonRight: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonRight");
buttonRight.addEventListener("click", function (): void { submit("right"); });
let buttonUp: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonUp");
buttonUp.addEventListener("click", function (): void { submit("up"); });
let buttonDown: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonDown");
buttonDown.addEventListener("click", function (): void { submit("down"); });
let adventureAussuchen: HTMLButtonElement = <HTMLButtonElement>document.getElementById("adventureAussuchen");
adventureAussuchen.addEventListener("click", function (): void { submit("selectAdventure"); });

let serverantwort: HTMLElement = document.getElementById("serverantwort");


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
        url = url + "/down";
    }
    if (_parameter == "selectAdventure") {
        url = url + "/selectAdventure";
    }

    url = url + "?" + query.toString();
    let response: Response = await fetch(url);
    let text: string = await response.text();

    serverantwort.innerHTML = text;




}
}



