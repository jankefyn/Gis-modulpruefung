
import * as Http from "http";
import { ParsedUrlQuery } from "querystring";
import * as url from "url";
import * as Mongo from "mongodb";


export namespace P_3_1Server {
    interface Products {
        [type: string]: string | string[];
    }
    interface Antwort {
        name: string;
        notiz: string;
        ablaufdatum: Date;
        kategorie: string;
    }


    let products: Mongo.Collection;
    let databaseUrl: string = "mongodb+srv://FynnJ:oIh47lfcy1wDuvkw@gis-ist-geil.wb5k5.mongodb.net/Products?retryWrites=true&w=majority";


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

        if (q.pathname == "//html") {

            _response.write(await storeRückgabe(q.query));
        }
        if (q.pathname == "//showUsers") {
            _response.write(await retrieveProducts("All"));
        }
        if (q.pathname == "//showMeat") {
            _response.write(await retrieveProducts("Meat"));
        }
        if (q.pathname == "//showMilk") {
            _response.write(await retrieveProducts("Milk"));
        }
        if (q.pathname == "//showFruits") {
            _response.write(await retrieveProducts("Fruits"));
        }
        if (q.pathname == "//showDrinks") {
            _response.write(await retrieveProducts("Drinks"));
        }
        if (q.pathname == "//saveNumber") {
            _response.write(await saveNumber(daten.number));
        }
        if (q.pathname == "//showDetail") {
            _response.write(await retrieveDetails());
        }
        /*if (q.pathname == "//login") {

            _response.write(await login(daten.notiz, daten.password));
        }*/

        _response.end();
    }

    async function retrieveProducts(_kategorie: string): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {

            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler: number = counter + 1;
                    if (_kategorie == "All") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                    }
                    if (_kategorie == "Meat") {
                        if (data[counter].kategorie == "🥩") {
                            dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        }
                        if (data[data.length - 1].kategorie == "🥩") {
                            dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                        }
                    }
                    if (_kategorie == "Milk") {
                        if (data[counter].kategorie == "🧀") {
                            dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        }
                        if (data[data.length - 1].kategorie == "🧀") {
                            dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                        }
                    }
                    if (_kategorie == "Fruits") {
                        if (data[counter].kategorie == "🍅") {
                            dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        }
                        if (data[data.length - 1].kategorie == "🍅") {
                            dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                        }
                    }
                    if (_kategorie == "Drinks") {
                        if (data[counter].kategorie == "🥤") {
                            dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        }
                        if (data[data.length - 1].kategorie == "🥤") {
                            dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                        }
                    }
                }
            }
            return (dataString);
        }
        else {
            return ("noch kein Gefriergut vorhanden");
        }
    }
    async function storeRückgabe(_rückgabe: Products): Promise<string> {
        products.insertOne(_rückgabe);
        return "Gefriergut erfolgreich gespeichert!";
    }

    async function saveNumber(_zahl: string | string[]): Promise<string> {
        let auswahl: string | string[] = _zahl;
        return "ihre auswahl ist:" + auswahl;
    }
    async function retrieveDetails(): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {

            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    dataString = dataString + "  " + data[counter].name + " läuft ab am: " + data[counter].ablaufdatum + " " + data[counter].notiz + ",";
                }
            }
            dataString = dataString + "  " + data[data.length - 1].name + " läuft ab am: " + data[data.length - 1].ablaufdatum + " " + data[data.length - 1].notiz;
            return (dataString);
        }
        else {
            return ("noch kein Gefriergut vorhanden");
        }
    }
}

