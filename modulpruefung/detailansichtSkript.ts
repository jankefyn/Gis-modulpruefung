namespace P3_1 {


    let allesAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showProducts");
    allesAnzeigeButton.addEventListener("click", function (): void { submit("showProducts"); });
    let speicherButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("zahlSpeichern");
    speicherButton.addEventListener("click", function (): void { submit("showDetail"); });
    let loeschenButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("zahlLoeschen");
    loeschenButton.addEventListener("click", function (): void { submit("deleteProduct"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gis-modulpruefung.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showProducts") {
            url = url + "/showProducts";
        }
        if (_parameter == "showDetail") {
            url = url + "/showDetail";
        }
        if (_parameter == "deleteProduct") {
            url = url + "/deleteProduct";
        }

        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}