"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_1Server = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var P_3_1Server;
(function (P_3_1Server) {
    let students;
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
        students = mongoClient.db("Test").collection("Students");
        console.log("Database connection", students != undefined);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let q = url.parse(_request.url, true);
        let daten = q.query;
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
    async function retrieveStudents() {
        let data = await students.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
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
    async function login(email, password) {
        let data = await students.find().toArray();
        if (data.length > 0) {
            let dataString;
            for (let counter = 0; counter < data.length; counter++) {
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
        else
            return "Anmeldedaten nicht gefunden";
    }
    async function storeRückgabe(_rückgabe, email) {
        let data = await students.find().toArray();
        if (data.length > 0) {
            for (let counter = 0; counter < data.length; counter++) {
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
})(P_3_1Server = exports.P_3_1Server || (exports.P_3_1Server = {}));
//# sourceMappingURL=ersterserver.js.map