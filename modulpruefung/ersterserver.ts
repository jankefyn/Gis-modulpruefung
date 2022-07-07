
import * as Http from "http";
import { ParsedUrlQuery } from "querystring";
import * as url from "url";
import * as Mongo from "mongodb";


export namespace TextAdventure {
    /* enum PlayerState {
         USER,
         PLAYER,
         REGISTERT_USER
     }*/
    interface Input {
        [type: string]: string | string[];
    }
    interface TextAdventure {
        name: string;
        places: string;
        map: string[][];
        sizeX: number;
        sizeY: number;
    }


    let textAdventure: Mongo.Collection;
    let databaseUrl: string = "mongodb+srv://FynnJ:nicnjX5MjRSm4wtu@gis-ist-geil.wb5k5.mongodb.net/?retryWrites=true&w=majority";


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
        textAdventure = mongoClient.db("Test").collection("Products");
        console.log("Database connection", textAdventure != undefined);
    }


    function handleListen(): void {
        console.log("Listening");
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {


        _response.setHeader("Access-Control-Allow-Origin", "*");

        let q: url.UrlWithParsedQuery = url.parse(_request.url, true);
        let daten: ParsedUrlQuery = q.query;

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

    async function retrieveAdventure(): Promise<String> {

        let data: TextAdventure[] = await textAdventure.find().toArray();
        if (data.length > 0) {
            let dataString: string = "";
            for (let counter: number = 0; counter < 4; counter++) {
                if (counter < data.length) {
                    let adventureNumber: number = counter + 1;
                    dataString = dataString + "Adventure " + adventureNumber + " " + data[counter].name;
                }
                else {
                    return (dataString);
                }
            }
            return (dataString);
        }
        return ("Es ist noch kein Adventure angelegt worden.");
    }

    async function nameFilter(_filterName: string | string[]): Promise<string> {
        let adventureName: string = _filterName.toString();

        let data: TextAdventure[] = await textAdventure.find().toArray();
        if (data.length > 0) {
            let dataString: string = "";
            for (let counter: number = 0; counter < data.length - 1; counter++) {
                if (data[counter].name != undefined) {
                    let gefriergutZähler: number = counter + 1;
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

    async function saveAdventure(_rückgabe: Input): Promise<string> {
        textAdventure.insertOne(_rückgabe);
        return ("Text Adventure erfolgreich gespeichert!");
    }
    async function retrieveDetails(_auswahlNummer: string | string[]): Promise<String> {
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
    async function deleteAdventure(_auswahlNummer: string | string[]): Promise<string> {
        let counter: number = +_auswahlNummer - 1;
        let data: TextAdventure[] = await textAdventure.find().toArray();
        textAdventure.deleteOne(data[counter]);
        return ("Das ausgewählte Produkt wurde erfolgreich gelöscht");
    }
    export async function onAction(_action: string): Promise<string> {
        if (_action == "left") {
            return ("links");
        } else if (_action == "right") {
            return ("rechts");
        } else if (_action == "up") {
            return ("hoch");
        } else if (_action == "down") {
            return ("runter");
        }
        else {
            return("ein fehler ist aufgetreten");
        }
    }
}

