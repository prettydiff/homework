;
import { createServer, IncomingMessage, Server, ServerResponse } from "http";

import csv from "./code/csv.js";
import humanTime from "./code/humanTime.js";
import log from "./code/log.js";
import query from "./code/query.js";
import test from "./code/test.js";
import vars from "./code/vars.js";

csv("./Zip_Code_Lookup_Table.csv", function (data:data):void {
    {
        const index:number = process.argv.indexOf("test");
        if (index > -1) {
            process.argv.splice(index, 1);
            vars.test = true;
        }
    }
    const listener = function (request:IncomingMessage, response:ServerResponse):void {
            const respond = function (code:number, message:string, type:string):void {
                    response.writeHead(code, {"content-type": type});
                    response.write(message);
                    response.end();
                };
            if (request.method.toLowerCase() === "get") {
                vars.queryTime = process.hrtime.bigint();
                respond(200, query(request.url, data), "text/plain");
            } else {
                const html:string[] = [
                    "<!DOCTYPE html>",
                    "<html><head>",
                    "<meta charset=\"utf-8\"/>",
                    "<title>Zip Codes</title>",
                    `<p>This server only accepts GET request method, but received ${request.method}.</p>`,
                    "</body></html>"
                ];
                respond(403, html.join("\n"), "text/html");
            }
        },
        serverCallback = function ():void {
            humanTime(vars.serverTime);
            if (vars.test === true) {
                test();
            }
        },
        server:Server = createServer(listener);

    // discover port option
    {
        let len:number = process.argv.length;
        do {
            len = len - 1;
            if (isNaN(Number(process.argv[len])) === false) {
                vars.port = Number(process.argv[len]);
            }
        } while (len > 0);
    }
    if (vars.test === true) {
        log.title("Tests");
    } else {
        log.title("Server");
    }
    log([`Executing an HTTP server on port: ${vars.text.green + vars.port + vars.text.none}`]);
    server.listen({
        port: vars.port
    }, serverCallback);
});