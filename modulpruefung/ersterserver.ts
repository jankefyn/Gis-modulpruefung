
import * as Http from "http";
import { ParsedUrlQuery } from "querystring";
import * as url from "url";
import * as Mongo from "mongodb";


export namespace P_3_1Server {
    interface Students {
        [type: string]: string | string[];
    }
    interface Antwort {
        fname: string;
        lname: string;
        email: string;
        adress: string;
        postleitzahl: string;
        password: string;
    }


    let students: Mongo.Collection;
    let databaseUrl: string = "mongodb+srv://FynnJ:<Hallo123456>@gis-ist-geil.wb5k5.mongodb.net/GIS-IST-GEIL?retryWrites=true&w=majority";


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
        students = mongoClient.db("Test").collection("Products");
        console.log("Database connection", students != undefined);
    }


    function handleListen(): void {
        console.log("Listening");
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {


        _response.setHeader("Access-Control-Allow-Origin", "*");




        let q: url.UrlWithParsedQuery = url.parse(_request.url, true);
        let daten: ParsedUrlQuery = q.query;

        if (q.pathname == "//html") {

            _response.write(await storeRückgabe(q.query, daten.email));
        }
        if (q.pathname == "//login") {

            _response.write(await login(daten.email, daten.password));
        }
        if (q.pathname == "//showUsers") {
            _response.write(await retrieveStudents());
        }


        _response.end();
    }

    async function retrieveStudents(): Promise<String> {

        let data: Antwort[] = await students.find().toArray();
        if (data.length > 0) {

            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].fname != undefined) {
                    dataString = dataString + "  " + data[counter].fname + " " + data[counter].lname + ",";
                }
            }
            dataString = dataString + "  " + data[data.length - 1].fname + " " + data[data.length - 1].lname;
            return (dataString);
        }
        else {
            return ("noch kein Nutzer vorhanden");
        }
    }
    async function login(email: string | string[], password: string | string[]): Promise<String> {

        let data: Antwort[] = await students.find().toArray();
        if (data.length > 0) {

            let dataString: string;
            for (let counter: number = 0; counter < data.length; counter++) {
                if (data[counter].email == email) {
                    if (data[counter].password == password) {
                        dataString = "angemeldet";
                    }
                    else {
                        dataString = " falsches Passwort";
                    }
                }
                else {

                    dataString = "falsche Email";
                }
            }

            return (dataString);
        }
        else return "Anmeldedaten nicht gefunden";

    }
    async function storeRückgabe(_rückgabe: Students, email: string | string[]): Promise<string> {
        let data: Antwort[] = await students.find().toArray();

        if (data.length > 0) {
            for (let counter: number = 0; counter < data.length; counter++) {
                if (data[counter].email == email) {

                    return "Ein Konto mit dieser email adresse besteht bereits";

                }
                else {
                    students.insertOne(_rückgabe);
                    return ("Nutzer erfolgreich registriert");
                }
            }
        }

        students.insertOne(_rückgabe);
        return "Nutzer erfolgreich registriert";
    }
}

