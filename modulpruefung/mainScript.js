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
        sizeX;
        sizeY;
        constructor(_name, _places, _sizeX, _sizeY) {
            this.name = _name;
            this.places = _places;
            this.sizeX = _sizeX;
            this.sizeY = _sizeY;
        }
    }
    let textAdventureCollection;
    let userCollection;
    let databaseUrl = "mongodb+srv://FynnJ:nicnjX5MjRSm4wtu@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";
    let selectedAdventure = new SelectabelAdventure("empty", "empty", 0, 0);
    let currentLocationNumber = 0;
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
        textAdventureCollection = mongoClient.db("Test").collection("Adventures");
        userCollection = mongoClient.db("Test").collection("Users");
        console.log("Database connection from adventures: ", textAdventureCollection != undefined);
        console.log("Database connectionfrom Users: ", userCollection != undefined);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let q = url.parse(_request.url, true);
        let daten = q.query;
        if (q.pathname == "//UserData") {
            _response.write(await saveUser(q.query, daten.username));
        }
        if (q.pathname == "//login") {
            _response.write(await login(daten.username, daten.password));
        }
        if (q.pathname == "//saveAdventure") {
            _response.write(await saveAdventure(q.query));
        }
        if (q.pathname == "//showAdventures") {
            _response.write(await showAdventures());
        }
        if (q.pathname == "//selectAdventure") {
            _response.write(await selectAdventure(daten.adventureName));
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
    async function saveUser(_rückgabe, _username) {
        let data = await userCollection.find().toArray();
        if (data.length > 0) {
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].username == _username) {
                    return "Ein Konto mit dieser email adresse besteht bereits";
                }
                else {
                    userCollection.insertOne(_rückgabe);
                    return ("Nutzer erfolgreich registriert");
                }
            }
        }
        userCollection.insertOne(_rückgabe);
        return "Nutzer erfolgreich registriert";
    }
    async function login(_username, password) {
        let data = await userCollection.find().toArray();
        if (data.length > 0) {
            let dataString;
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].username == _username) {
                    if (data[counter].password == password) {
                        dataString = "angemeldet";
                    }
                    else {
                        dataString = " falsches Passwort";
                    }
                }
                else {
                    dataString = "falscher username";
                }
            }
            return (dataString);
        }
        else
            return "Anmeldedaten nicht gefunden";
    }
    async function showAdventures() {
        let data = await textAdventureCollection.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = 0; counter < 5; counter++) {
                if (counter < data.length) {
                    let adventureNumber = counter + 1;
                    dataString = dataString + " Adventure " + adventureNumber + ": " + data[counter].name + "(" + data[counter].sizeX + "X" + data[counter].sizeY + " Felder) ";
                }
                else {
                    return (dataString);
                }
            }
            return (dataString);
        }
        return ("Es ist noch kein Adventure angelegt worden.");
    }
    async function selectAdventure(_filterName) {
        console.log(_filterName);
        currentLocationNumber = 0;
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
    async function onAction(_action) {
        let stringSplitLimiter = selectedAdventure.sizeX * selectedAdventure.sizeY;
        let adventureMap = selectedAdventure.places.toString().split(",", stringSplitLimiter);
        let endOfRowNumber = selectedAdventure.sizeX - 1;
        let startOfRowNumber = 0;
        let startOfLastRow = selectedAdventure.sizeX * (selectedAdventure.sizeY - 1);
        if (selectedAdventure.places == undefined) {
            return ("es wurde noch kein Adventure ausgewählt");
        }
        if (_action == "left") {
            for (let counter = 0; counter < selectedAdventure.sizeY; counter++) {
                if (currentLocationNumber == startOfRowNumber) {
                    return ("du bist am rechten Linken Rand des Adventures angekommen und kannst deshalb nicht weiter nach Links. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
                }
                startOfRowNumber = 1 * startOfRowNumber + 1 * selectedAdventure.sizeX;
            }
            currentLocationNumber = currentLocationNumber + -1;
            return (adventureMap[currentLocationNumber]);
        }
        else if (_action == "right") {
            for (let counter = 0; counter < selectedAdventure.sizeY; counter++) {
                if (currentLocationNumber == endOfRowNumber) {
                    return ("du bist am rechten Rand des Adventures angekommen und kannst deshalb nicht weiter nach Rechts. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
                }
                endOfRowNumber = 1 * endOfRowNumber + 1 * selectedAdventure.sizeX;
            }
            currentLocationNumber = currentLocationNumber + 1;
            return (adventureMap[currentLocationNumber]);
        }
        else if (_action == "up") {
            if (currentLocationNumber > endOfRowNumber) {
                currentLocationNumber = currentLocationNumber * 1 - selectedAdventure.sizeX * 1;
                console.log("currentLocationNumber" + currentLocationNumber);
                return (adventureMap[currentLocationNumber]);
            }
            else {
                return ("du bist am oberen Rand des Adventures angekommen und kannst deshalb nicht weiter hoch. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
            }
        }
        else if (_action == "down") {
            if (currentLocationNumber < startOfLastRow) {
                currentLocationNumber = currentLocationNumber * 1 + selectedAdventure.sizeX * 1;
                console.log("currentLocationNumber" + currentLocationNumber);
                return (adventureMap[currentLocationNumber]);
            }
            else {
                return ("du bist am unteren Rand des Adventures angekommen und kannst deshalb nicht weiter runter. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
            }
        }
        else {
            return ("ein fehler ist aufgetreten");
        }
    }
    TextAdventure.onAction = onAction;
})(TextAdventure = exports.TextAdventure || (exports.TextAdventure = {}));
//# sourceMappingURL=mainScript.js.map