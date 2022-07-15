namespace TextAdventure {


    let showAdventures: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showAdventures");
    showAdventures.addEventListener("click", function (): void { submit("showAdventures"); });
    let showMoreAdventures: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showMoreAdventures");
    showMoreAdventures.addEventListener("click", function (): void { submit("more"); });
    let showLessAdventures: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showLessAdventures");
    showLessAdventures.addEventListener("click", function (): void { submit("less"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://softwaredesign-abgabe.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

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
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}