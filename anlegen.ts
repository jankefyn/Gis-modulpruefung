namespace P3_1 {


    let submitbuttonHTML: HTMLButtonElement = <HTMLButtonElement>document.getElementById("submitHTML");
    submitbuttonHTML.addEventListener("click", function (): void { submit("HTML"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gisaufgabedrei.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "HTML") {
            url = url + "/html";
        }


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;

    }
}