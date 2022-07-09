"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAdventure = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var TextAdventure;
(function (TextAdventure) {
    class SelectabelAdventure {
        name;
        places;
        map;
        sizeX;
        sizeY;
        constructor(_name, _places, _map, _sizeX, _sizeY) {
            this.name = _name;
            this.places = _places;
            this.map = _map;
            this.sizeX = _sizeX;
            this.sizeY = _sizeY;
        }
    }
    let textAdventureCollection;
    let databaseUrl = "mongodb+srv://FynnJ:nicnjX5MjRSm4wtu@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";
    let selectedAdventure = new SelectabelAdventure("name", "place", [["emptymapX1"], ["emptymapY1"]], 30, 30);
    let coordinateX = 0;
    let coordinateY = 0;
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
        textAdventureCollection = mongoClient.db("Test").collection("Products");
        console.log("Database connection", textAdventureCollection != undefined);
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
        if (q.pathname == "//selectAdventure") {
            _response.write(await selectAdventure(daten.adventureName));
        }
        if (q.pathname == "//showDetail") {
            _response.write(await retrieveDetails(daten.number));
        }
        if (q.pathname == "//deleteProduct") {
            _response.write(await deleteAdventure(daten.number));
        }
        if (q.pathname == "//left") {
            _response.write(await onAction("left"));
        }
        if (q.pathname == "//right") {
            _response.write(await onAction("right"));
        }
        if (q.pathname == "//up") {
            _response.write(await onAction("up"));
        }
        if (q.pathname == "//down") {
            _response.write(await onAction("down"));
        }
        _response.end();
    }
    async function retrieveAdventure() {
        let data = await textAdventureCollection.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < 5; counter++) {
                if (counter < data.length) {
                    let adventureNumber = counter + 1;
                    dataString = dataString + "Adventure " + adventureNumber + " " + data[counter].name + " ";
                }
                else {
                    return (dataString);
                }
            }
            return (dataString);
        }
        return ("Es ist noch kein Adventure angelegt worden.");
    }
    function loadadventure() {
        let stringSplitLimiter = selectedAdventure.sizeX * selectedAdventure.sizeY;
        let tempMap = selectedAdventure.places.toString().split(",", stringSplitLimiter);
        console.log("stringsplitlimiter: " + stringSplitLimiter + "gesplitteter string array" + tempMap[2]);
        let stringCounter = 0;
        for (let counterY = 0; counterY < selectedAdventure.sizeY; counterY++) {
            console.log("counterY in for schleife: " + counterY);
            for (let counterX = 0; counterX < selectedAdventure.sizeX; counterX++) {
                console.log("counterY in for schleife 2 : " + counterY);
                console.log("counterX in for schleife 2 : " + counterX);
                console.log("stringCounter in for schleife 2: " + stringCounter);
                console.log("tempmap bei string counter in schleife 2 : " + tempMap[stringCounter]);
                console.log("selectedadventure map" + selectedAdventure.map);
                selectedAdventure.map[counterX][counterY] = tempMap[stringCounter];
                stringCounter = stringCounter + 1;
            }
        }
        console.log(selectedAdventure.map);
        coordinateX = 0;
        coordinateY = 0;
    }
    async function selectAdventure(_filterName) {
        console.log(_filterName);
        let adventureName = _filterName.toString();
        let data = await textAdventureCollection.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    if (data[counter].name == adventureName) {
                        selectedAdventure.name = data[counter].name;
                        selectedAdventure.places = data[counter].places;
                        selectedAdventure.sizeX = data[counter].sizeX;
                        selectedAdventure.sizeY = data[counter].sizeY;
                        dataString = "Durch drücken einer Pfeiltaste starten sie das Text Adventure" + selectedAdventure.name + " an der Stelle links oben.";
                        loadadventure();
                    }
                }
            }
            if (data[data.length - 1].name == adventureName) {
                console.log(data[data.length - 1].places);
                selectedAdventure.name = data[data.length - 1].name;
                selectedAdventure.places = data[data.length - 1].places;
                selectedAdventure.sizeX = data[data.length - 1].sizeX;
                selectedAdventure.sizeY = data[data.length - 1].sizeY;
                dataString = "Durch drücken einer Pfeiltaste starten sie das Text Adventure" + selectedAdventure.name + " an der Stelle links oben.";
                loadadventure();
            }
            if (dataString == "") {
                return ("Es gibt noch kein Text Adventure mit diesem Name, bitte Überprüfen sie die Schreibweise des Text Adventures");
            }
            return (dataString);
        }
        return ("Es ist Aktuell noch kein Text Adventure gespeichert.");
    }
    async function saveAdventure(_rückgabe) {
        textAdventureCollection.insertOne(_rückgabe);
        return ("Text Adventure erfolgreich gespeichert!");
    }
    async function retrieveDetails(_auswahlNummer) {
        console.log(saveAdventure);
        return ("Es liegt kein Produkt mit der angegebenen Nummer vor");
    }
    async function deleteAdventure(_auswahlNummer) {
        let counter = +_auswahlNummer - 1;
        let data = await textAdventureCollection.find().toArray();
        textAdventureCollection.deleteOne(data[counter]);
        return ("Das ausgewählte Produkt wurde erfolgreich gelöscht");
    }
    async function onAction(_action) {
        if (selectedAdventure.map == undefined) {
            return ("es wurde noch kein Adventure ausgewählt");
        }
        if (_action == "left") {
            if (coordinateX > 0) {
                coordinateX = coordinateX - 1;
                return (selectedAdventure.map[coordinateX][coordinateY]);
            }
            else {
                return ("du bist am linken rand des Adventures angekommen und kannst deshalb nicht weiter nach Links");
            }
        }
        else if (_action == "right") {
            if (coordinateX + 1 < selectedAdventure.sizeX) {
                coordinateX = coordinateX + 1;
                console.log("coordinate X nach swipe nach rechts" + coordinateX);
                return (selectedAdventure.map[coordinateX][coordinateY]);
            }
            else {
                return ("du bist am rechten Rand des Adventures angekommen und kannst deshalb nicht weiter nach Rechts");
            }
        }
        else if (_action == "up") {
            if (coordinateY > 0) {
                coordinateY = coordinateY - 1;
                return (selectedAdventure.map[coordinateX][coordinateY]);
            }
            else {
                return ("du bist am oberen Rand des Adventures angekommen und kannst deshalb nicht weiter hoch");
            }
        }
        else if (_action == "down") {
            if (coordinateY + 1 < selectedAdventure.sizeY) {
                coordinateY = coordinateY + 1;
                return (selectedAdventure.map[coordinateX][coordinateY]);
            }
            else {
                return ("du bist am unteren Rand des Adventures angekommen und kannst deshalb nicht weiter runter");
            }
        }
        else {
            return ("ein fehler ist aufgetreten");
        }
    }
    TextAdventure.onAction = onAction;
})(TextAdventure = exports.TextAdventure || (exports.TextAdventure = {}));
//# sourceMappingURL=ersterserver.js.map