
import * as Http from "http";
import { ParsedUrlQuery } from "querystring";
import * as url from "url";
import * as Mongo from "mongodb";


export namespace TextAdventure {
    enum PlayerState {
        USER,
        PLAYER,
        REGISTERT_USER
    }
    interface Products {
        [type: string]: string | string[];
    }
    interface Antwort {
        name: string;
        notiz: string;
        ablaufdatum: Date;
        kategorie: string;
        anlegedatum: Date;
    }


    let products: Mongo.Collection;
    let databaseUrl: string = "mongodb+srv://FynnJ:Hallo123456@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";


    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;


    startServer(port);
    connectToDatabase(databaseUrl);



    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        products = mongoClient.db("Test").collection("Products");
        console.log("Database connection", products != undefined);
    }


    function handleListen(): void {
        console.log("Listening");
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {


        _response.setHeader("Access-Control-Allow-Origin", "*");

        let q: url.UrlWithParsedQuery = url.parse(_request.url, true);
        let daten: ParsedUrlQuery = q.query;

        if (q.pathname == "//saveProduct") {
            _response.write(await storeRückgabe(q.query));
        }
        if (q.pathname == "//showProducts") {
            _response.write(await retrieveAdventure("All"));
        }
        if (q.pathname == "//abgelaufen") {
            _response.write(await retrieveAdventure("abgelaufen"));
        }
        if (q.pathname == "//fastAbgelaufen") {
            _response.write(await retrieveAdventure("fastAbgelaufen"));
        }
        if (q.pathname == "//filternNachName") {
            _response.write(await nameFilter(daten.produktname));
        }
        if (q.pathname == "//showDetail") {
            _response.write(await retrieveDetails(daten.number));
        }
        if (q.pathname == "//deleteProduct") {
            _response.write(await deleteProduct(daten.number));
        }
        _response.end();
    }

    async function retrieveAdventure(_kategorie: string): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {
            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler: number = counter + 1;
                    if (_kategorie == "All") {
                        dataString = dataString + " Das Text Adventure " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist bereit gespielt zu werden und wurde erstellt von " + data[counter].ablaufdatum + ",";
                    }
                }
            }
           /* if (_kategorie == "All") {
                dataString = dataString + " Das Text Adventure  " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }*/
            if (dataString == "") {
                return ("Von dieser Kategorie sind aktuell keine Gefriergüter im Kühlschrank");
            }
            return (dataString);
        }
        else {
            return ("Noch kein Gefriergut vorhanden");
        }
    }
    async function nameFilter(_filterName: string | string[]): Promise<string> {
        let adventureName: string = _filterName.toString();

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {
            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler: number = counter + 1;
                    if (data[counter].name == adventureName) {
                        dataString = dataString + " Das Text Adventure " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft innerhalb der nächsten zwei Tage ab. Genaues Ablaufdatum: " + data[counter].ablaufdatum + ",";
                    }
                }
            }
            if (data[data.length - 1].name == adventureName) {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                return ("Im Kühlschrank wurden folgende Produkte mit dem gesuchten Name gefunden:" + dataString);
            }
            if (dataString == "") {
                return ("Im Kühlschrank sind keine Gefriergüter mit diesem namen vorhanden. überprüfen sie die Schreibweise des Produktnamen");
            }
            return ("Im Kühlschrank wurden folgende produkte mit dem gesuchten name gefunden:" + dataString);
        }

        return ("Es sind noch keine Gefriergüter im Kühlschrank vorhanden");

    }

    async function storeRückgabe(_rückgabe: Products): Promise<string> {
        products.insertOne(_rückgabe);
        return ("Text Adventure erfolgreich gespeichert!");
    }

    async function retrieveDetails(_auswahlNummer: string | string[]): Promise<String> {

        let counter: number = +_auswahlNummer - 1;
        let data: Antwort[] = await products.find().toArray();

        if (counter >= 0 && data.length >= counter) {

            let dataString: string = "";
            if (data[counter].name != undefined) {
                dataString = data[counter].name + " " + data[counter].kategorie + " läuft ab am: " + data[counter].ablaufdatum + " Notiz:" + data[counter].notiz;
                return (" Hier sehen sie alle details des Produktes mit der Nummer " + _auswahlNummer + ":      " + dataString);
            }
            else {
                return ("Es liegt kein Produkt mit der angegebenen Nummer vor");
            }
        }
        else {
            return ("Es liegt kein Produkt mit der angegebenen Nummer vor");
        }
    }
    async function deleteProduct(_auswahlNummer: string | string[]): Promise<string> {
        let counter: number = +_auswahlNummer - 1;
        let data: Antwort[] = await products.find().toArray();
        products.deleteOne(data[counter]);
        return ("Das ausgewählte Produkt wurde erfolgreich gelöscht");
    }
}

