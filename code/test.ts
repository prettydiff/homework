
import { get, IncomingMessage } from "http";
import { StringDecoder } from "string_decoder";

import humanTime from "./humanTime.js";
import log from "./log.js";
import testSamples from "./testSamples.js";
import vars from "./vars.js";

const test = function ():void {
    let index:number = 0,
        fails:number = 0;
    const len:number = testSamples.length,
        callback = function (response:IncomingMessage):void {
            const chunks:string[] = [],
                decoder:StringDecoder = new StringDecoder("utf8"),
                responseEnd = function ():void {
                    const body:string = chunks.join("").replace(/00:00:00.\d+/, "00:00:00"),
                        sample:string = testSamples[index].result.replace(/\r\n/g, "\n").replace(/00:00:00.\d+/, "00:00:00");
                    if (body === sample) {
                        log([`${humanTime(vars.serverTime) + vars.text.green + vars.text.bold}Passed${vars.text.none}: ${testSamples[index].request}`]);
                    } else {
                        log([
                            `${humanTime(vars.serverTime) + vars.text.angry}Failed${vars.text.none}: ${testSamples[index].request}`,
                            "",
                            `${vars.text.underline}Service Response${vars.text.none}`,
                            body,
                            "",
                            `${vars.text.underline}Test Data${vars.text.none}`,
                            sample
                        ]);
                        fails = fails + 1;
                    }
                    index = index + 1;
                    if (index < len) {
                        testItem();
                    } else {
                        const count:string = (fails === 0)
                                ? `${vars.text.green + vars.text.bold}0${vars.text.none}`
                                : vars.text.angry + fails + vars.text.none,
                            plural:string = (fails === 1)
                                ? ""
                                : "s";
                        log([
                            "",
                            `Test Complete with ${count} test failure${plural} across ${len} total tests.`
                        ]);
                        vars.test = false;
                        humanTime(vars.serverTime);
                        if (fails > 0) {
                            process.exit(1);
                        }
                        process.exit(0);
                    }
                },
                responseError = function (error:NodeJS.ErrnoException):void {
                    log([
                        `${vars.text.angry}Error executing test${vars.text.none}`,
                        testSamples[index].request,
                        JSON.stringify(error)
                    ]);
                };
            response.on("data", function terminal_server_transmission_transmitHttp_receive_onData(data:Buffer):void {
                chunks.push(decoder.write(data));
            });
            response.on("end", responseEnd);
            response.on("error", responseError);
        },
        testItem = function ():void {
            const requestAddress:string = (vars.port === 80)
                ? testSamples[index].request
                : testSamples[index].request.replace("localhost", `localhost:${vars.port}`);
            get(requestAddress, callback);
        };
    testItem();
};

export default test;