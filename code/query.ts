// a simple query mechanism

import humanTime from "./humanTime.js";
import vars from "./vars.js";

const query = function (fragment:string, data:data):string {
    const resultObject:recordObject[] = [],
        resultArray:record[] = [],
        flags:flags = (function ():flags {
            const output:flags = {
                    array: true,
                    city: false,
                    county: false,
                    object: false,
                    verbose: false,
                    zip: false
                },
                rule = function (input:queryFlags) {
                    fragment = decodeURI(fragment.toLowerCase());
                    if (fragment.indexOf(`/${input}`) > -1 || (fragment.indexOf(input) === fragment.length - input.length && fragment.indexOf(input) > -1)) {
                        if (output.object === true) {
                            output.array = false;
                            output.object = true;
                        } else {
                            output[input] = true;
                        }
                        fragment = fragment.replace(`/${input}`, "/");
                    }
                };
            rule("array");
            rule("city");
            rule("county");
            rule("object");
            rule("verbose");
            rule("zip");
            fragment = fragment.replace(/\/+$/, "").replace(/^\/+/, "");
            return output;
        }()),
        fragments:string[] = fragment.split("/"),
        rules = function (fragIndex:number, dataIndex:number):boolean {
            const city:string = data[dataIndex][1].toLowerCase(),
                county:string = data[dataIndex][2].toLowerCase(),
                zip:string = data[dataIndex][0];
            if ((/^\d+$/).test(fragments[fragIndex]) === true) {
                if (fragments[fragIndex].indexOf(zip) > -1) {
                    return true;
                }
                if (zip.indexOf(fragments[fragIndex]) > -1) {
                    return true;
                }
                return false;
            }
            if (flags.zip === true) {
                if ((/^\d+$/).test(fragments[fragIndex]) === true) {
                    if (fragments[fragIndex].indexOf(zip) > -1) {
                        return true;
                    }
                    if (zip.indexOf(fragments[fragIndex]) > -1) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            if (flags.city === true) {
                if (fragments[fragIndex].indexOf(city) > -1 || city.indexOf(fragments[fragIndex]) > -1) {
                    return true;
                }
                return false;
            }
            if (flags.county === true) {
                if (fragments[fragIndex].indexOf(county) > -1 || county.indexOf(fragments[fragIndex]) > -1) {
                    return true;
                }
                return false;
            }
            if (fragments[fragIndex].indexOf(city) > -1 || fragments[fragIndex].indexOf(county) > -1 || city.indexOf(fragments[fragIndex]) > -1 || county.indexOf(fragments[fragIndex]) > -1) {
                return true;
            }
            return false;
        },
        selection = function () {
            let b:number = 0,
                a:number = 0;
            const len:number = data.length,
                fragLen:number = fragments.length;
            do {
                b = 0;
                do {
                    if (rules(b, a) === false) {
                        break;
                    }
                    b = b + 1;
                } while (b < fragLen);
                if (b === fragLen) {
                    if (flags.object === true) {
                        resultObject.push({
                            city: data[a][1],
                            county: data[a][2],
                            zip: data[a][0]
                        });
                    } else {
                        resultArray.push(data[a]);
                    }
                }
                a = a + 1;
            } while (a < len);
        };

    // query for results
    selection();
    
    return (function ():string {
        const output:string = (flags.object === true)
                ? JSON.stringify(resultObject)
                : JSON.stringify(resultArray),
            count:number = (flags.object === true)
                ? resultObject.length
                : resultArray.length;
        if (flags.verbose === true) {
            return `${output}\n\nNumber of Results: ${count}\n\nResponse Time:\n${humanTime(vars.queryTime).replace(/\u001b\[\d+m/g, "").replace(/ :/g, "\n").replace(/\s*(\[|\])\s*/g, "")}`;
        }
        return output;
    }());
};

export default query;