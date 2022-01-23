namespace p2_3 {
    export let keyTypOben: number = 0;
    export let keyTypUnten: number = 1;
    export let keyTypMitte: number = 2;
    export let auswahl: Auswahl = { oben: undefined, mitte: undefined, unten: undefined };
    export interface JedesBild {
        oben: Bild[];
        mitte: Bild[];
        unten: Bild[];
    }
    export interface Bild {
        link: string;
        typ: number;
    }
    export interface Auswahl {
        oben: Bild;
        mitte: Bild;
        unten: Bild;
    }
    interface Serverantwort {
        message: string;
        error: string;

    }
    //bei jedem neu laden wird, wenn der session storage an der zugehörigen stelle nicht undefiniert is, die auswahl in das gespeichertebilderDiv übergeben 
    window.addEventListener("load", finishedloading);
    function finishedloading(): void {
        let gespeicherteBilderDiv: HTMLElement = document.getElementById("gespeicherteBilder");

        if (sessionStorage.getItem("" + keyTypOben) != undefined) {
            let ladeOben: Auswahl = JSON.parse(sessionStorage.getItem("" + keyTypOben));
            let vorschauOben: HTMLImageElement = document.createElement("img");
            vorschauOben.src = ladeOben.oben.link;
            gespeicherteBilderDiv.appendChild(vorschauOben);
        }
        if (sessionStorage.getItem("" + keyTypMitte) != undefined) {
            let ladeMitte: Auswahl = JSON.parse(sessionStorage.getItem("" + keyTypMitte));
            let vorschauMitte: HTMLImageElement = document.createElement("img");
            vorschauMitte.src = ladeMitte.mitte.link;
            gespeicherteBilderDiv.appendChild(vorschauMitte);
        }
        if (sessionStorage.getItem("" + keyTypUnten) != undefined) {
            let ladeUnten: Auswahl = JSON.parse(sessionStorage.getItem("" + keyTypUnten));
            let vorschauUnten: HTMLImageElement = document.createElement("img");
            vorschauUnten.src = ladeUnten.unten.link;
            gespeicherteBilderDiv.appendChild(vorschauUnten);
        }
    }
    //den im html deklarierten knöpfen wird hier ein eventlistener gegeben der beim klicken die jeweilige function aufruft
    let buttonUnten: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonUnten");
    buttonUnten.addEventListener("click", openUnten);
    let buttonMitte: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonMitte");
    buttonMitte.addEventListener("click", openMitte);
    let buttonOben: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonOben");
    buttonOben.addEventListener("click", openOben);
    let buttonAll: HTMLButtonElement = <HTMLButtonElement>document.getElementById("buttonAll");
    buttonAll.addEventListener("click", openAll);

    //wenn diese funktionen aufgerufen werden wird die jeweilige seite geladen 
    function openUnten(): void {
        window.open("AuswahlUnten.html", "_self");
    }
    function openMitte(): void {
        window.open("AuswahlMitte.html", "_self");
    }
    function openOben(): void {
        window.open("AuswahlOben.html", "_self");
    }
    function openAll(): void {
        window.open("Gesamtbild.html", "_self");
    }


    ladeBilderAusJSON("data.json");
    //in dieser async funktion wird die beim aufrufen übergebene data json benutzt um die bilder auf ihre jeweilige seite zu bringen
    //außerdem bekommen die bilder einen eventlistener der beim mausklick die funktion auswaehlen aufruft
    async function ladeBilderAusJSON(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        let json: string = JSON.stringify(await response.json());
        let objectJson: JedesBild = JSON.parse(json);
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlOben.html") {
            let bilderDiv: HTMLElement = document.getElementById("bilder");

            for (let counter: number = 0; counter < objectJson.oben.length; counter++) {
                let meinbild: HTMLImageElement = document.createElement("img");
                meinbild.addEventListener("click", function (): void { auswaehlen(objectJson.oben[counter]); });
                meinbild.src = objectJson.oben[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlUnten.html") {
            let bilderDiv: HTMLElement = document.getElementById("bilder");

            for (let counter: number = 0; counter < objectJson.unten.length; counter++) {
                let meinbild: HTMLImageElement = document.createElement("img");
                meinbild.addEventListener("click", function (): void { auswaehlen(objectJson.unten[counter]); });
                meinbild.src = objectJson.unten[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "AuswahlMitte.html") {
            let bilderDiv: HTMLElement = document.getElementById("bilder");

            for (let counter: number = 0; counter < objectJson.mitte.length; counter++) {
                let meinbild: HTMLImageElement = document.createElement("img");

                meinbild.addEventListener("click", function (): void {auswaehlen(objectJson.mitte[counter]); });
                meinbild.src = objectJson.mitte[counter].link;
                bilderDiv.appendChild(meinbild);
            }
        }
    }
    //in dieser funktion werden die angecklickten bilder in der auswahl abgespeichert und diese wiederum als string in den sessionStorage übergeben 
    function auswaehlen(_bild: Bild): void {
        if (_bild.typ == keyTypOben) {
            auswahl.oben = _bild;
        }
        if (_bild.typ == keyTypUnten) {
            auswahl.unten = _bild;
        }
        if (_bild.typ == keyTypMitte) {
            auswahl.mitte = _bild;
        }
        let auswahlJSON: string = JSON.stringify(auswahl);
        sessionStorage.setItem("" + _bild.typ, auswahlJSON);
    }
    // diese funktion erwartet die antwort der seite und gibt die jeweilige antwort an das entscprechende div weiter
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "Gesamtbild.html") {
        servercheck();
    }
    async function servercheck(): Promise<void> {
        let query: URLSearchParams = new URLSearchParams(<any>sessionStorage);
        let url: string = "https://gis-communication.herokuapp.com";
        url = url + "?" + query.toString();
        let serverantwort: Response = await fetch(url);
        let rückmeldung: Serverantwort = await serverantwort.json();


        if (rückmeldung.error != undefined) {
            console.log(rückmeldung.error);
            let messagediv: HTMLElement = document.getElementById("messageerror");
            messagediv.appendChild(document.createTextNode("" + rückmeldung.error));
        }
        else if (rückmeldung.message != undefined) {
            console.log(rückmeldung.message);
            let messagediv: HTMLElement = document.getElementById("message");
            messagediv.appendChild(document.createTextNode("" + rückmeldung.message));
        }

    }
} 
