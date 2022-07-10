namespace TextAdventure {


    let submitbuttonHTML: HTMLButtonElement = <HTMLButtonElement>document.getElementById("saveAdventure");
    submitbuttonHTML.addEventListener("click", function (): void { submit("saveAdventure"); });

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://softwaredesign-abgabe.herokuapp.com/";
        //let url: string = "http://localhost:8100/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "saveAdventure") {
            url = url + "/saveAdventure";
        }


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;

    }
}