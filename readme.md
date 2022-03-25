# Interview Homework
This application sources in some [zip code data in CSV format](./zip.csv) and allows queries against the data.
To see the assignment please read the [assignment.md](./assignment.md) document.

## Status
This homework resulted in a removal from hiring consideration with this unnamed employer.
This homework completed the specified requirements with two deviations.
* An unmatched query returns an empty array specifying 0 matches. This is explicit in verbose mode.
* The query mechanism exceeds the project requirements in that:
   - is multidimensional, as in many factors are considered in evaluating results if so specified
   - returns a full data record for a matched result instead of returning only city and county as specified because all such data is considered for evaluation beyond just zip code as specified
   - code includes an original query mechanism
   - code includes an original csv parser
   - code includes an original test runner for execution of test automation with 16 test samples

## Legal
I licensed this project as AGPLv3.
I don't care if somebody else wishes to plagiarize this project for their own interview assignment.
I only care that interview homework assignments are not used to as unpaid labor by a devious potential employer.

The project assignment was marked *confidential*.
The confidential statement was omitted from the production of the requirements language to this public code repository as is the potential employer's name.
I never signed, agreed to, or expressed any relationship to the potential employer or any confidentiality or secrecy therein.
Disclosure of any information to an unsanctioned/unrestricted external party, the unbound candidate, is a public release of information and thus expressions of confidentiality are void.
Therefore I can publish this work, and the requirements therein, to Github, as well as any other party of my choosing, without sanction whether explicit or implied.

These things considered releasing a document marked as confidential is damaging to any existing or potential relationship even if confidentially is not established.
In this case the potential relationship is terminated by the prospective employer thereby eliminating any risk to that potential relationship.

## Installation
1. Unzip the zip file
2. Change directory into the project directory.
3. `npm install -g typescript`
4. `npm install`
5. `tsc`

## Execution
### Web Server

`node js/index.js`

This executes a simple web server on localhost.

`node js/index.js 8000`

By default the service will execute on port 80 if no port is specified.
This will fail if something is already listening on port 80 or on Linux because ports less than 1025 are restricted by the kernel.
You can work around the Linux limitation by either modifying systemd, using the setcap utility, or by running your application as root with `sudo` (I highly recommend you don't do this).
I am not including specific automation for Linux as that exceeds the scope of this assignment.

### Tests

`node js/index.js test` or `node js/index.js test 8000` or `node js/index.js 8000 test`

To execute the tests just specify an argument named **test**.

### General Usage

To use this application execute the server and then connect to localhost in your web browser.
If you have run localhost applications before using HTTPS you will likely need to clear cache and the browser and pray the browser don't redirect back to HTTPS.
HTTPS exceeds the scope of this project, but I wrote a document to [describe installing a trusted certificate chain for localhost](https://github.com/prettydiff/wisdom/blob/master/Certificates.md).

The Server API is RESTful, for example http://localhost/63 and also http://localhost/20639.
That address will apply the search fragment against ZIP codes from the source data and return results.
All arguments, query data, and options may occur in any order.

To be more explicit three arguments are permitted: *zip*, *city*, *county*.
For example: http://localhost/zip/63 or http://localhost/63/zip

To minimize confusion please only specify one of the query arguments.
This will not confuse the application, though.
The query mechanism supplies a precedence in this order regardless of what combination of arguments are supplied:

1. If no argument identifiers are supplied and the value is number a zip code search is performed.
2. If any combination of argument identifiers is supplied including *zip* then a zip code search is performed.
3. If any combination of argument identifiers is supplied including *city* and not *zip& then a city search is performed.
4. If *county* is specified then a county search is performed.
5. If no argument identifiers are supplied and the value is not numeric both city and county fields are searched for matches.

Excess slashes, including trailing slashes, will not break the application.
For example: http://localhost/63//////zip/

It should be noted this server only supports the HTTP *GET* request method.
Other request methods will result in a 403 response type.

The query mechanism also supports multidimensional searches.
For example: [http://localhost/Montgomery County/Chevy Chase](http://localhost/Montgomery%20County/Chevy%20Chase)
That searches for both "Montgomery County" and "Chevy Chase".

### Options

#### Verbose Output
Verbose output lists the number of search matches and the query time.

http://localhost/63/verbose or http://localhost/verbose/63

#### Object Format
By default the output is a list of matching records in array format: `[zip, city, county]`.
The *object* options allows a more user friendly object format for output:

```JSON
[
    {
        "city": "city name",
        "county": "county name",
        "zip": "zip code"
    }
]
```

Example of using the object option: http://localhost/63/object or http://localhost/object/63

## Changes From Prior Version
* Tests no longer execute if test flag is unset.
* Multidimensional searches now exist.
* Minor logic simplification.
* Tests can now occur on a specified port.