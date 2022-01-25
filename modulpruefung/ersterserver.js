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
        _response.end();
    }
    async function retrieveProducts(_kategorie) {
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            let istKategorieVorhanden = false;
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler = counter + 1;
                    if (_kategorie == "All") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                    }
                    if (_kategorie == "Fruits" && data[counter].kategorie == "🥩") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        istKategorieVorhanden = true;
                    }
                    if (_kategorie == "Fruits" && data[counter].kategorie == "🧀") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        istKategorieVorhanden = true;
                    }
                    if (_kategorie == "Fruits" && data[counter].kategorie == "🍅") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        istKategorieVorhanden = true;
                    }
                    if (_kategorie == "Fruits" && data[counter].kategorie == "🥤") {
                        dataString = dataString + " Das Produkt " + gefriergutZähler + ": " + data[counter].name + " " + data[counter].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[counter].ablaufdatum + ",";
                        istKategorieVorhanden = true;
                    }
                }
            }
            if (_kategorie == "Fruits" && data[data.length - 1].kategorie == "🥩") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                istKategorieVorhanden = true;
            }
            if (_kategorie == "Fruits" && data[data.length - 1].kategorie == "🧀") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                istKategorieVorhanden = true;
            }
            if (_kategorie == "Fruits" && data[data.length - 1].kategorie == "🍅") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                istKategorieVorhanden = true;
            }
            if (_kategorie == "Fruits" && data[data.length - 1].kategorie == "🥤") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
                istKategorieVorhanden = true;
            }
            if (_kategorie == "All") {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + data[data.length - 1].kategorie + " , ist im Kühlschrank und läuft ab am: " + data[data.length - 1].ablaufdatum;
            }
            if (istKategorieVorhanden == false) {
                return (" in der Ausgewählten Kategorie ist kein Gefriegut Vorhanden ");
            }
            return (dataString);
        }
        else {
            return ("noch kein Gefriergut vorhanden");
        }
    }
    async function storeRückgabe(_rückgabe) {
        products.insertOne(_rückgabe);
        return "Gefriergut erfolgreich gespeichert!";
    }
    async function saveNumber(_zahl) {
        let auswahl = _zahl;
        return "ihre auswahl ist:" + auswahl;
    }
    async function retrieveDetails() {
        let data = await products.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
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
})(P_3_1Server = exports.P_3_1Server || (exports.P_3_1Server = {}));
//# sourceMappingURL=ersterserver.js.map