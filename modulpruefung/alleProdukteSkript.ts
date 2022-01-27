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


   /* let abgelaufenAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("abgelaufen");
    abgelaufenAnzeigeButton.addEventListener("click", function (): void { submit("abgelaufen"); });
    let fastAbgelaufenAnzeigeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("fastAbgelaufen");
    fastAbgelaufenAnzeigeButton.addEventListener("click", function (): void { submit("fastAbgelaufen"); });
    let filternNachNameButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("filternNachName");
    filternNachNameButton.addEventListener("click", function (): void { submit("filternNachName"); });*/
   

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
        /*if (_parameter == "abgelaufen") {
            url = url + "/abgelaufen";
        }
        if (_parameter == "fastAbgelaufen") {
            url = url + "/fastAbgelaufen";
        }
        if (_parameter == "filternNachName") {
            url = url + "/filternNachName";
        }*/
        


        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();

        serverantwort.innerHTML = text;




    }
}