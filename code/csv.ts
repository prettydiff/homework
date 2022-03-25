
// a csv parser written according to RFC4180

import { readFile } from "fs";

const csv = function (file:string, callback:(data:data) => void):void {
    readFile(file, function (readError:NodeJS.ErrnoException, fileData:Buffer):void {
        if (readError === null) {
            let a:number = 0,
                quote:boolean = false,
                token:string[] = [],
                recordIndex:number = 0,
                record:record = ["", "", ""];
            const chars:string[] = fileData.toString().split(""),
                len:number = chars.length,
                data:data = [];

            if (len > 0) {
                do {
                    if (chars[a] === "\"") {
                        if (quote === false) {
                            quote = true;
                        } else {
                            if (chars[a - 1] === "\"") {
                                token.push(chars[a]);
                            } else {
                                quote = false;
                            }
                        }
                    } else if (quote === false) {
                        if (chars[a] === ",") {
                            record[recordIndex] = token.join("");
                            token = [];
                            recordIndex = recordIndex + 1;
                        } else if (chars[a] === "\n") {
                            if (chars[a] === "\r") {
                                a = a + 1;
                            }
                            record[recordIndex] = token.join("");
                            data.push(record);
                            record = ["", "", ""];
                            token = [];
                            recordIndex = 0;
                        } else {
                            token.push(chars[a]);
                        }
                    } else {
                        token.push(chars[a]);
                    }
                    a = a + 1;
                } while (a < len);
            }
            callback(data.slice(1));
        } else {
            console.log("Error reading data file.");
            console.log(JSON.stringify(readError));
        }
    });
};

export default csv;