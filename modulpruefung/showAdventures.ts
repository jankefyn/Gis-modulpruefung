namespace TextAdventure {


    let allesAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showAdventures");
    allesAnzeigeButton.addEventListener("click", function (): void { submit("showAdventures"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://softwaredesign-abgabe.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showAdventures") {
            url = url + "/showAdventures";
        }

        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}