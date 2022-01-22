namespace P3_1 {


    let anzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showUsers");
    anzeigeButton.addEventListener("click", function (): void { submit("showUsers"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gisaufgabedrei.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showUsers") {
            url = url + "/showUsers";
        }


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;

    }
}