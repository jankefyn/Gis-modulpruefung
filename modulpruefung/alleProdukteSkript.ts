namespace Modulpruefung {


    let allesAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showProducts");
    allesAnzeigeButton.addEventListener("click", function (): void { submit("showProducts"); });

    let filternNachNameButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("filternNachName");
    filternNachNameButton.addEventListener("click", function (): void { submit("filternNachName"); });
   

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gis-modulpruefung.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showAdventures") {
            url = url + "/showAdventures";
        }
        if (_parameter == "filternNachName") {
            url = url + "/filternNachName";
        }
                
        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}