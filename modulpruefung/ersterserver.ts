
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
        if (q.pathname == "//abgelaufen") {
            _response.write(await retrieveProducts("abgelaufen"));
        }
       /* if (q.pathname == "//fastAbgelaufen") {
            _response.write(await retrieveProducts("fastAbgelaufen"));
        }
       if (q.pathname == "//filternNachName") {
        _response.write(await nameFilter("filternNachName"));
        }*/
        if (q.pathname == "//showDetail") {
            _response.write(await retrieveDetails(daten.number));
        }

        _response.end();
    }

    async function retrieveProducts(_kategorie: string): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        let heutigesDatum: Date = new Date();
        if (data.length > 0) {
            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler: number = counter + 1;
                    if (_kategorie == "All") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                    }
                    if (_kategorie == "Meat" && data[counter].kategorie == "🥩") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";

                    }
                    if (_kategorie == "Milk" && data[counter].kategorie == "🧀") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";

                    }
                    if (_kategorie == "Fruits" && data[counter].kategorie == "🍅") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";

                    }
                    if (_kategorie == "Drinks" && data[counter].kategorie == "🥤") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                    }
                    if (_kategorie == "abgelaufen") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank ist abgelaufen am: " + data[counter].ablaufdatum + ",";
                    }
                }
            }
            if (_kategorie == "All") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (_kategorie == "Meat" && data[data.length - 1].kategorie == "🥩") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (_kategorie == "Milk" && data[data.length - 1].kategorie == "🧀") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (_kategorie == "Fruits" && data[data.length - 1].kategorie == "🍅") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (_kategorie == "Drinks" && data[data.length - 1].kategorie == "🥤") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (_kategorie == "abgelaufen") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            
            if (dataString == "") {
                return ("von dieser Kategorie sind aktuell keine Gefriergüter im Kühlschrank");
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

    async function retrieveDetails(_auswahlNummer: string | string[]): Promise<String> {

        let counter: number = +_auswahlNummer - 1;
        let data: Antwort[] = await products.find().toArray();

        if (counter >= 0 && data.length >= counter) {

            let dataString: string = "";
            if (data[counter].name != undefined) {
                dataString = data[counter].name + " läuft ab am: " + data[counter].ablaufdatum + " " + data[counter].notiz;
                return (" Hier sehen sie alle details des Produktes mit der Nummer " + _auswahlNummer + ":      " + dataString);
            }
            else {
                return ("Es liegt kein Produkt mit der angegebenen nummer vor");
            }
        }
        else {
            return ("Es liegt kein Produkt mit der angegebenen nummer vor");
        }
    }
}

