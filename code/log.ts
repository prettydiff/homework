
// a simple logger

import vars from "./vars.js";

// verbose metadata printed to the shell about the application
const log = function (output:string[]):void {
    // eslint-disable-next-line
    const logger:(input:string) => void = console.log;
    if (output[output.length - 1] === "") {
        output.pop();
    }
    output.forEach(function (value:string) {
        logger(value);
    });
};

log.title = function (message:string):void {
    const formatted:string = `${vars.text.cyan + vars.text.bold + vars.text.underline} Zip Codes - ${message + vars.text.none}`;
    log(["", "", formatted, "", ""]);
};

export default log;
