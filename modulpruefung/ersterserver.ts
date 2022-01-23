
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
        ablaufdatum: string;     
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

            _response.write(await storeRückgabe(q.query, daten.ablaufdatum));
        }
        if (q.pathname == "//login") {

            _response.write(await login(daten.ablaufdatum, daten.password));
        }
        if (q.pathname == "//showUsers") {
            _response.write(await retrieveProducts());
        }


        _response.end();
    }

    async function retrieveProducts(): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {

            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    dataString = dataString + "  " + data[counter].name + " " + data[counter].notiz + ",";
                }
            }
            dataString = dataString + "  " + data[data.length - 1].name + " " + data[data.length - 1].notiz;
            return (dataString);
        }
        else {
            return ("noch kein Nutzer vorhanden");
        }
    }
    async function login(ablaufdatum: string | string[], password: string | string[]): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {

            let dataString: string;
            for (let counter: number = 0; counter < data.length; counter++) {
                if (data[counter].ablaufdatum == ablaufdatum) {
                    if (data[counter].ablaufdatum == password) {
                        dataString = "angemeldet";
                    }
                    else {
                        dataString = " falsches Passwort";
                    }
                }
                else {

                    dataString = "falsche ablaufdatum";
                }
            }

            return (dataString);
        }
        else return "Anmeldedaten nicht gefunden";

    }
    async function storeRückgabe(_rückgabe: Products, ablaufdatum: string | string[]): Promise<string> {
        let data: Antwort[] = await products.find().toArray();

        if (data.length > 0) {
            for (let counter: number = 0; counter < data.length; counter++) {
                if (data[counter].ablaufdatum == ablaufdatum) {

                    return "Ein Konto mit dieser ablaufdatum adresse besteht bereits";

                }
                else {
                    products.insertOne(_rückgabe);
                    return ("Nutzer erfolgreich registriert");
                }
            }
        }

        products.insertOne(_rückgabe);
        return "Nutzer erfolgreich registriert";
    }
}

