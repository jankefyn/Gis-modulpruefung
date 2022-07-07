"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAdventure = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var TextAdventure;
(function (TextAdventure) {
    let textAdventure;
    let databaseUrl = "mongodb+srv://FynnJ:nicnjX5MjRSm4wtu@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";
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
        textAdventure = mongoClient.db("Test").collection("Products");
        console.log("Database connection", textAdventure != undefined);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let q = url.parse(_request.url, true);
        let daten = q.query;
        if (q.pathname == "//saveAdventure") {
            _response.write(await saveAdventure(q.query));
        }
        if (q.pathname == "//showAdventures") {
            _response.write(await retrieveAdventure());
        }
        if (q.pathname == "//filternNachName") {
            _response.write(await nameFilter(daten.produktname));
        }
        if (q.pathname == "//showDetail") {
            _response.write(await retrieveDetails(daten.number));
        }
        if (q.pathname == "//deleteProduct") {
            _response.write(await deleteAdventure(daten.number));
        }
        _response.end();
    }
    async function retrieveAdventure() {
        let data = await textAdventure.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < 4; counter++) {
                if (data.length >= counter) {
                    dataString = dataString + "Adventure " + counter + 1 + " " + data[counter].name;
                }
            }
            return (dataString);
        }
        return ("Es ist noch kein Adventure angelegt worden.");
    }
    async function nameFilter(_filterName) {
        let adventureName = _filterName.toString();
        let data = await textAdventure.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler = counter + 1;
                    if (data[counter].name == adventureName) {
                        dataString = dataString + " Das Text Adventure " + gefriergutZähler + ": " + data[counter].name + " " + " , ist bereit gespielt zu werden " + ",";
                    }
                }
            }
            if (data[data.length - 1].name == adventureName) {
                dataString = dataString + " Das Produkt " + data.length + ": " + data[data.length - 1].name + " " + ", ist bereit gespielt zu werden ";
                return ("Im Kühlschrank wurden folgende Produkte mit dem gesuchten Name gefunden:" + dataString);
            }
            if (dataString == "") {
                return ("Es gibt noch kein Text Adventure mit diesem Name");
            }
            return ("Es gibt folgende Text Adventures mit diesem Name:" + dataString);
        }
        return ("Es ist Aktuell noch kein Text Adventure gespeichert.");
    }
    async function saveAdventure(_rückgabe) {
        textAdventure.insertOne(_rückgabe);
        return ("Text Adventure erfolgreich gespeichert!");
    }
    async function retrieveDetails(_auswahlNummer) {
        /* let saveAdventure: TextAdventure;
        
         saveAdventure.name = _rückgabe.name.toString();
         
         saveAdventure.sizeX = +_rückgabe.sizeX;
         saveAdventure.sizeY = +_rückgabe.sizeY;
         let stringSplitLimiter: number = saveAdventure.sizeX * saveAdventure.sizeY;
         let tempMap: string[] = _rückgabe.places.toString().split(",", stringSplitLimiter);
         for (let counterX: number = 0; counterX < saveAdventure.sizeX; counterX++) {
             for (let counterY: number = 0; counterY < saveAdventure.sizeY; counterY++) {
                 let stringCounter: number = 0;
                 saveAdventure.map[counterX][counterY] = tempMap[stringCounter];
                 stringCounter = stringCounter + 1;
             }
         }*/
        console.log(saveAdventure);
        return ("Es liegt kein Produkt mit der angegebenen Nummer vor");
    }
    async function deleteAdventure(_auswahlNummer) {
        let counter = +_auswahlNummer - 1;
        let data = await textAdventure.find().toArray();
        textAdventure.deleteOne(data[counter]);
        return ("Das ausgewählte Produkt wurde erfolgreich gelöscht");
    }
})(TextAdventure = exports.TextAdventure || (exports.TextAdventure = {}));
//# sourceMappingURL=ersterserver.js.map