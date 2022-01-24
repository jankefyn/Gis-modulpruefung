namespace P3_1 {


    let anzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showUsers");
    anzeigeButton.addEventListener("click", function (): void { submit("showUsers"); });
    /*zweite funktion der Seite alleProdukte*/
    let speicherButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("zahlSpeichern");
    speicherButton.addEventListener("click", function (): void { submit("saveNumber"); });
    /*zweite funktion der Seite alleProdukte ende*/

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gis-modulpruefung.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showUsers") {
            url = url + "/showUsers";
        }
        if (_parameter == "saveNumber") {
            url = url + "/saveNumber";
        }


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}