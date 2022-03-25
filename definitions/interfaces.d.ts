
interface data extends Array<record> {
    [index:number]: record;
}

interface flags {
    [key:string]: boolean;
}

interface recordObject {
    city: string;
    county: string;
    zip: string;
}

interface stringStore {
    [key:string]: string;
}

interface testSample {
    request: string;
    result: string;
}

interface vars {
    port: number;
    queryTime: bigint;
    serverTime: bigint;
    test: boolean;
    text: stringStore;
}