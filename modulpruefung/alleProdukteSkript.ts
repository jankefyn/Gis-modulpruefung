namespace P3_1 {


    let allesAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showUsers");
    allesAnzeigeButton.addEventListener("click", function (): void { submit("showUsers"); });
/*einzelne kategorien:*/
    let meatAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showMeat");
    meatAnzeigeButton.addEventListener("click", function (): void { submit("showMeat"); });
    let milkAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showMilk");
    milkAnzeigeButton.addEventListener("click", function (): void { submit("showMilk"); });
    let fruitsAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showFruits");
    fruitsAnzeigeButton.addEventListener("click", function (): void { submit("showFruits"); });
    let drinksAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("showDrinks");
    drinksAnzeigeButton.addEventListener("click", function (): void { submit("showDrinks"); });
   

    let serverantwort: HTMLElement = document.getElementById("serverantwort");

    async function submit(_parameter: string): Promise<void> {
        let formData: FormData = new FormData(document.forms[0]);
        let url: string = "https://gis-modulpruefung.herokuapp.com/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        if (_parameter == "showUsers") {
            url = url + "/showUsers";
        }
        if (_parameter == "showMeat") {
            url = url + "/showMeat";
        }
        if (_parameter == "showMilk") {
            url = url + "/showMilk";
        }
        if (_parameter == "showFruits") {
            url = url + "/showFruits";
        }
        if (_parameter == "showDrinks") {
            url = url + "/showDrinks";
        }
        


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}