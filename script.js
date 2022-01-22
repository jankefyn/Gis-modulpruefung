"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modulprüfung = void 0;
const Http = require("http");
/*import { ParsedUrlQuery } from "querystring";*/
const url = require("url");
const Mongo = require("mongodb");
var Modulprüfung;
(function (Modulprüfung) {
    let products;
    let databaseUrl = "mongodb+srv://FynnJ:oIh47lfcy1wDuvkw@gis-ist-geil.wb5k5.mongodb.net/Test?retryWrites=true&w=majority";
    console.log("Starting server");
    let port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    startServer(port);
    connectToDatabase(databaseUrl);
    function startServer(_port) {
        let server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        products = mongoClient.db("Test").collection("Products");
        console.log("Database connection", products != undefined);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let q = url.parse(_request.url, true);
        /*let daten: ParsedUrlQuery = q.query;*/
        if (q.pathname == "//html") {
            _response.write(await storeRückgabe(q.query));
        }
        /*  if (q.pathname == "//login") {
  
              _response.write(await login(daten.datum, daten.password));
          }*/
        if (q.pathname == "//showUsers") {
            _response.write(await retrieveProducts());
        }
        _response.end();
    }
    async function retrieveProducts() {
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    dataString = dataString + "  " + data[counter].name + " / ablaufdatum: " + data[counter].datum + ",";
                }
            }
            dataString = dataString + "  " + data[data.length - 1].name + " / ablaufdatum: " + data[data.length - 1].datum;
            return (dataString);
        }
        else {
            return ("noch kein Product vorhanden");
        }
    }
    /*async function login(datum: string | string[], password: string | string[]): Promise<String> {

        let data: Antwort[] = await products.find().toArray();
        if (data.length > 0) {

            let dataString: string;
            for (let counter: number = 0; counter < data.length; counter++) {
                if (data[counter].datum == datum) {
                    if (data[counter].password == password) {
                        dataString = "angemeldet";
                    }
                    else {
                        dataString = " falsches Passwort";
                    }
                }
                else {

                    dataString = "falsche datum";
                }
            }

            return (dataString);
        }
        else return "Anmeldedaten nicht gefunden";

    }*/
    async function storeRückgabe(_rückgabe) {
        products.insertOne(_rückgabe);
        return "Produkt erfolgreich angelegt";
    }
})(Modulprüfung = exports.Modulprüfung || (exports.Modulprüfung = {}));
//# sourceMappingURL=script.js.map