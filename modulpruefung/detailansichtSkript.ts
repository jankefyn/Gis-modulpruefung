namespace P3_1 {


    let detailButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showDetail");
    detailButton.addEventListener("click", function (): void { submit("showDetail"); });
    

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gis-modulpruefung.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showDetail") {
            url = url + "/showDetail";
        }



        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}