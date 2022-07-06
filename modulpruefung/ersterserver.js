"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAdventure = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var TextAdventure;
(function (TextAdventure) {
    let PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["USER"] = 0] = "USER";
        PlayerState[PlayerState["PLAYER"] = 1] = "PLAYER";
        PlayerState[PlayerState["REGISTERT_USER"] = 2] = "REGISTERT_USER";
    })(PlayerState || (PlayerState = {}));
    let products;
    let databaseUrl = "mongodb+srv://FynnJ:Hallo123456@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";
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
    async function retrieveAdventure(_kategorie) {
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler = counter + 1;
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
    async function nameFilter(_filterName) {
        let adventureName = _filterName.toString();
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler = counter + 1;
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
    async function storeRückgabe(_rückgabe) {
        products.insertOne(_rückgabe);
        return ("Text Adventure erfolgreich gespeichert!");
    }
    async function retrieveDetails(_auswahlNummer) {
        let counter = +_auswahlNummer - 1;
        let data = await products.find().toArray();
        if (counter >= 0 && data.length >= counter) {
            let dataString = "";
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
    async function deleteProduct(_auswahlNummer) {
        let counter = +_auswahlNummer - 1;
        let data = await products.find().toArray();
        products.deleteOne(data[counter]);
        return ("Das ausgewählte Produkt wurde erfolgreich gelöscht");
    }
})(TextAdventure = exports.TextAdventure || (exports.TextAdventure = {}));
//# sourceMappingURL=ersterserver.js.map