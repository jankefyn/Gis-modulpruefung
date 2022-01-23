"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_1Server = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var P_3_1Server;
(function (P_3_1Server) {
    let products;
    let databaseUrl = "mongodb+srv://FynnJ:oIh47lfcy1wDuvkw@gis-ist-geil.wb5k5.mongodb.net/Products?retryWrites=true&w=majority";
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
        let daten = q.query;
        if (q.pathname == "//html") {
            _response.write(await storeRückgabe(q.query));
        }
        if (q.pathname == "//login") {
            _response.write(await login(daten.notiz, daten.password));
        }
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
                    dataString = dataString + "  " + data[counter].name + " läuft ab am: " + data[counter].ablaufdatum + ",";
                }
            }
            dataString = dataString + "  " + data[data.length - 1].name + " läuft ab am: " + data[data.length - 1].ablaufdatum;
            return (dataString);
        }
        else {
            return ("noch kein Gefriergut vorhanden");
        }
    }
    async function login(ablaufdatum, password) {
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString;
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].notiz == ablaufdatum) {
                    if (data[counter].notiz == password) {
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
        else
            return "Anmeldedaten nicht gefunden";
    }
    async function storeRückgabe(_rückgabe) {
        products.insertOne(_rückgabe);
        return "Gefriergut erfolgreich gespeichert!";
    }
})(P_3_1Server = exports.P_3_1Server || (exports.P_3_1Server = {}));
//# sourceMappingURL=ersterserver.js.map