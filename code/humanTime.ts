
// just a little timer

import vars from "./vars.js";

// converting time durations into something people read
const prettyBytes = function (input:number):string {
        //find the string length of input and divide into triplets
        let output:string = "",
            length:number  = input
                .toString()
                .length;
        const triples:number = (function ():number {
                if (length < 22) {
                    return Math.floor((length - 1) / 3);
                }
                //it seems the maximum supported length of integer is 22
                return 8;
            }()),
            //each triplet is worth an exponent of 1024 (2 ^ 10)
            power:number   = (function ():number {
                let a:number = triples - 1,
                    b:number = 1024;
                if (triples === 0) {
                    return 0;
                }
                if (triples === 1) {
                    return 1024;
                }
                do {
                    b = b * 1024;
                    a = a - 1;
                } while (a > 0);
                return b;
            }()),
            //kilobytes, megabytes, and so forth...
            unit    = [
                "",
                "KB",
                "MB",
                "GB",
                "TB",
                "PB",
                "EB",
                "ZB",
                "YB"
            ];

        if (typeof input !== "number" || Number.isNaN(input) === true || input < 0 || input % 1 > 0) {
            //input not a positive integer
            output = "0B";
        } else if (triples === 0) {
            //input less than 1000
            output = `${input}B`;
        } else {
            //for input greater than 999
            length = Math.floor((input / power) * 100) / 100;
            output = length.toFixed(1) + unit[triples];
        }
        return output;
    },
    humanTime = function (finished:bigint):string {
        const complete:boolean = (finished === vars.serverTime && vars.test === false),
            numberString = function (numb:bigint):string {
                const str:string = numb.toString();
                return (str.length < 2)
                    ? `0${str}`
                    : str;
            },
            plural = function (x:bigint, y:string):string {
                if (y === " second") {
                    if (x === 1n) {
                        if (nanosecond === 0n) {
                            return `01.${nanoString} second `;
                        }
                        return `01.${nanoString} seconds `;
                    }
                    return `${numberString(x)}.${nanoString} seconds `;
                }
                if (x === 1n) {
                    return `${numberString(x) + y} `;
                }
                return `${numberString(x) + y}s `;
            },
            elapsed:bigint     = process.hrtime.bigint() - finished,
            // eslint-disable-next-line
            factorSec:bigint   = BigInt(1e9),
            factorMin:bigint   = (60n * factorSec),
            factorHour:bigint  = (3600n * factorSec),
            hours:bigint       = (elapsed / factorHour),
            elapsedHour:bigint = (hours * factorHour),
            minutes:bigint     = ((elapsed - elapsedHour) / factorMin),
            elapsedMin:bigint  = (minutes * factorMin),
            seconds:bigint     = ((elapsed - (elapsedHour + elapsedMin)) / factorSec),
            nanosecond:bigint  = (elapsed - (elapsedHour + elapsedMin + (seconds * factorSec))),
            nanoString:string  = (function ():string {
                let nano:string = nanosecond.toString(),
                    a:number = nano.length;
                if (a < 9) {
                    do {
                        nano = `0${nano}`;
                        a = a + 1;
                    } while (a < 9);
                }
                return nano;
            }()),
            secondString:string = (complete === true)
                ? plural(seconds, " second")
                : `${numberString(seconds)}.${nanoString}`,
            minuteString:string = (complete === true)
                ? plural(minutes, " minute")
                : numberString(minutes),
            hourString:string = (complete === true)
                ? plural(hours, " hour")
                : numberString(hours);

        //last line for additional instructions without bias to the timer
        if (complete === true) {
            const finalMem:string = prettyBytes(process.memoryUsage.rss()),
                finalTime = hourString + minuteString + secondString,
                // eslint-disable-next-line
                logger:(input:string) => void = console.log;
            logger("");
            logger(`${finalMem} of memory consumed`);
            logger(`${finalTime}total time`);
            logger("");
        }
        return `${vars.text.cyan}[${hourString}:${minuteString}:${secondString}]${vars.text.none} `;
    };

export default humanTime;