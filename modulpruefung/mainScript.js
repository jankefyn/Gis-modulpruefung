"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAdventure = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var TextAdventure;
(function (TextAdventure) {
    let textAdventureCollection;
    let userCollection;
    let statisticsCollection;
    let PlayingState;
    (function (PlayingState) {
        PlayingState[PlayingState["REGISTERED"] = 0] = "REGISTERED";
        PlayingState[PlayingState["UNREGISTERED"] = 1] = "UNREGISTERED";
    })(PlayingState || (PlayingState = {}));
    class SelectableAdventure {
        name;
        places;
        sizeX;
        sizeY;
        statistics = new Map();
        constructor(_name, _places, _sizeX, _sizeY) {
            this.name = _name;
            this.places = _places;
            this.sizeX = _sizeX;
            this.sizeY = _sizeY;
        }
    }
    class Statistics {
        adventureName;
        statisticsMap = new Map();
        constructor(_adventureName) {
            this.adventureName = _adventureName;
        }
    }
    class User {
        username;
        createdAdventures;
        playingState = PlayingState.UNREGISTERED;
        constructor(_username, _createdAdventures) {
            this.username = _username;
            this.createdAdventures = _createdAdventures;
        }
        isRegistered() {
            if (this.playingState == PlayingState.REGISTERED) {
                return true;
            }
            else
                return false;
        }
    }
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
        textAdventureCollection = mongoClient.db("Test").collection("Adventures");
        userCollection = mongoClient.db("Test").collection("Users");
        statisticsCollection = mongoClient.db("Test").collection("Statistics");
        console.log("Database connection from adventures: ", textAdventureCollection != undefined);
        console.log("Database connectionfrom Users: ", userCollection != undefined);
        console.log("Database connectionfrom Statistics: ", userCollection != undefined);
    }
    function handleListen() {
        console.log("Listening");
    }
    let selectedAdventure = new SelectableAdventure("empty", "empty", 0, 0);
    let currentUser = new User("empty", ["empty1", "empty2"]);
    let currentLocationNumber = 0;
    let swipecounter = 0;
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
        if (q.pathname == "//more") {
            _response.write(await showAdventures("more"));
        }
        if (q.pathname == "//normal") {
            _response.write(await showAdventures("normal"));
        }
        if (q.pathname == "//less") {
            _response.write(await showAdventures("less"));
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
        if (q.pathname == "//showStatistics") {
            _response.write(await showStatistics());
        }
        if (q.pathname == "//saveSwipes") {
            _response.write(await saveSwipes());
        }
        _response.end();
    }
    async function saveUser(_rückgabe, _username) {
        let data = await userCollection.find().toArray();
        if (_username.toString().match(/[\W_]+/g)) {
            return ("im username sind nicht alphanumerische zeichen. Versuche einen ohne alphanumerische Zeichen.");
        }
        if (data.length > 0) {
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].username == _username) {
                    return "Ein Konto mit diesem username besteht bereits";
                }
            }
        }
        userCollection.insertOne(_rückgabe);
        return "Nutzer erfolgreich registriert";
    }
    async function login(_username, _password) {
        let data = await userCollection.find().toArray();
        if (data.length > 0) {
            let dataString;
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].username == _username) {
                    if (data[counter].password == _password) {
                        currentUser.username = _username;
                        currentUser.playingState = PlayingState.REGISTERED;
                        dataString = "angemeldet";
                        return (dataString);
                    }
                    else {
                        dataString = " falsches Passwort";
                        return (dataString);
                    }
                }
            }
            return ("falscher username");
        }
        else
            return "Anmeldedaten nicht gefunden";
    }
    async function showAdventures(_param) {
        let numberForCounter = 0;
        if (_param == "normal") {
            numberForCounter = 0;
        }
        if (_param == "more") {
            numberForCounter = numberForCounter + 5;
        }
        if (_param == "less") {
            if (numberForCounter > 0) {
                numberForCounter = numberForCounter - 5;
            }
            else {
                return (" Sie sehen bereits die ersten 5 sie können nicht niedriger anzeigen lassen.");
            }
        }
        let limiterForfor = numberForCounter + 5;
        let data = await textAdventureCollection.find().toArray();
        if (data.length > 0) {
            let dataString = "";
            for (let counter = numberForCounter; counter < limiterForfor; counter++) {
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
        let adventursize = +_rückgabe.sizeX * +_rückgabe.sizeY;
        let adventureMap = _rückgabe.places.toString().split(",", adventursize + 1);
        let data = await textAdventureCollection.find().toArray();
        if (currentUser.isRegistered()) {
            if (adventureMap.length == adventursize) {
                if (data.length > 0) {
                    for (let counter = 0; counter < data.length; counter++) {
                        if (data[counter].name != undefined) {
                            if (data[counter].name == _rückgabe.name) {
                                return ("ein Adventure mit diesem name besteht bereits");
                            }
                        }
                    }
                }
                _rückgabe.username = currentUser.username;
                textAdventureCollection.insertOne(_rückgabe);
                return ("Text Adventure erfolgreich gespeichert!");
            }
            else
                return ("Bei der eingabe der Felder ist etwas schiefgelaufen. Bitte überprüfe ob die Eingabe wie im Beispiel formatiert wurde.");
        }
        else
            return ("Um ein Text Adventure anlegen zu können musst du dich zuerst Registrieren.");
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
            swipecounter = swipecounter + 1;
            for (let counter = 0; counter < selectedAdventure.sizeY; counter++) {
                if (currentLocationNumber == startOfRowNumber) {
                    if (selectedAdventure.statistics.has(currentUser.username)) {
                        selectedAdventure.statistics.delete(currentUser.username);
                    }
                    selectedAdventure.statistics.set(currentUser.username, swipecounter);
                    return ("du bist am rechten Linken Rand des Adventures angekommen und kannst deshalb nicht weiter nach Links. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
                }
                startOfRowNumber = 1 * startOfRowNumber + 1 * selectedAdventure.sizeX;
            }
            if (selectedAdventure.statistics.has(currentUser.username)) {
                selectedAdventure.statistics.delete(currentUser.username);
            }
            selectedAdventure.statistics.set(currentUser.username, swipecounter);
            currentLocationNumber = currentLocationNumber + -1;
            return (adventureMap[currentLocationNumber]);
        }
        else if (_action == "right") {
            swipecounter = swipecounter + 1;
            for (let counter = 0; counter < selectedAdventure.sizeY; counter++) {
                if (currentLocationNumber == endOfRowNumber) {
                    if (selectedAdventure.statistics.has(currentUser.username)) {
                        selectedAdventure.statistics.delete(currentUser.username);
                    }
                    selectedAdventure.statistics.set(currentUser.username, swipecounter);
                    return ("du bist am rechten Rand des Adventures angekommen und kannst deshalb nicht weiter nach Rechts. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
                }
                endOfRowNumber = 1 * endOfRowNumber + 1 * selectedAdventure.sizeX;
            }
            if (selectedAdventure.statistics.has(currentUser.username)) {
                selectedAdventure.statistics.delete(currentUser.username);
            }
            selectedAdventure.statistics.set(currentUser.username, swipecounter);
            currentLocationNumber = currentLocationNumber + 1;
            return (adventureMap[currentLocationNumber]);
        }
        else if (_action == "up") {
            swipecounter = swipecounter + 1;
            if (currentLocationNumber > endOfRowNumber) {
                currentLocationNumber = currentLocationNumber * 1 - selectedAdventure.sizeX * 1;
                if (selectedAdventure.statistics.has(currentUser.username)) {
                    selectedAdventure.statistics.delete(currentUser.username);
                }
                selectedAdventure.statistics.set(currentUser.username, swipecounter);
                return (adventureMap[currentLocationNumber]);
            }
            else {
                if (selectedAdventure.statistics.has(currentUser.username)) {
                    selectedAdventure.statistics.delete(currentUser.username);
                }
                selectedAdventure.statistics.set(currentUser.username, swipecounter);
                return ("du bist am oberen Rand des Adventures angekommen und kannst deshalb nicht weiter hoch. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
            }
        }
        else if (_action == "down") {
            swipecounter = swipecounter + 1;
            if (currentLocationNumber < startOfLastRow) {
                currentLocationNumber = currentLocationNumber * 1 + selectedAdventure.sizeX * 1;
                if (selectedAdventure.statistics.has(currentUser.username)) {
                    selectedAdventure.statistics.delete(currentUser.username);
                }
                selectedAdventure.statistics.set(currentUser.username, swipecounter);
                return (adventureMap[currentLocationNumber]);
            }
            else {
                if (selectedAdventure.statistics.has(currentUser.username)) {
                    selectedAdventure.statistics.delete(currentUser.username);
                }
                selectedAdventure.statistics.set(currentUser.username, swipecounter);
                return ("du bist am unteren Rand des Adventures angekommen und kannst deshalb nicht weiter runter. Du bleibst deshalb hier: " + adventureMap[currentLocationNumber]);
            }
        }
        else {
            return ("ein fehler ist aufgetreten");
        }
    }
    async function saveSwipes() {
        let saveStatistics = new Statistics(selectedAdventure.name);
        saveStatistics.statisticsMap = selectedAdventure.statistics;
        statisticsCollection.insertOne(saveStatistics);
        return ("deine bis jetzt gemachten swipes wurden gespeichert");
    }
    async function getMyAdventures() {
        let data = await textAdventureCollection.find().toArray();
        let dataString = [];
        if (data.length > 0) {
            for (let counter = 0; counter < data.length; counter++) {
                if (data[counter].username == currentUser.username) {
                    dataString.push(data[counter].name);
                }
            }
        }
        return (dataString);
    }
    async function showStatistics() {
        let myAdventuresString = (await getMyAdventures());
        let generalStatistics = await statisticsCollection.find().toArray();
        let rückgabe = "";
        let arraycounter = 0;
        let emptyStatistics = new Statistics("");
        let emptyStatistics2 = new Statistics("");
        let myStatistics = [emptyStatistics, emptyStatistics2];
        if (currentUser.isRegistered()) {
            for (let myAdventuresCounter = 0; myAdventuresCounter < myAdventuresString.length; myAdventuresCounter++) {
                for (let statisticsCounter = 0; statisticsCounter < generalStatistics.length; statisticsCounter++) {
                    if (generalStatistics[statisticsCounter].adventureName == myAdventuresString[myAdventuresCounter]) {
                        myStatistics[arraycounter].adventureName = generalStatistics[statisticsCounter].adventureName;
                        myStatistics[arraycounter].statisticsMap = generalStatistics[statisticsCounter].statisticsMap;
                        arraycounter = arraycounter + 1;
                    }
                }
            }
            if (myStatistics == [emptyStatistics, emptyStatistics2]) {
                return ("Zu keinem deiner Adventures wurden bisher statistiken angelegt.");
            }
            else {
                rückgabe = " Es haben sich " + myStatistics.length + " Nutzer entschieden eines ihrer adventures zu spielen und ihre swipes als auswertung für ihre Statistiken auswerten zu lassen." + "             Hier sehen sie welches Adventure welcher Nutzer gespielt hat und wie oft dieser geswiped hat: " + JSON.stringify(myStatistics);
                return (rückgabe);
            }
        }
        else {
            return ("Sie müssen sich erst anmelden bzw registrieren um ihre Statistiken einzusehen");
        }
    }
})(TextAdventure = exports.TextAdventure || (exports.TextAdventure = {}));
//# sourceMappingURL=mainScript.js.map