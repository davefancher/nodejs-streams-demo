"use strict";

const fs = require("fs");
const { Transform, pipeline } = require("stream");
// Use a 3rd party package to work with CSV data
const parseCsv = require("csv-parse");
const stringify = require("csv-stringify");

// Transform streams don't have to forward on the data they
// receive. This function creates a Transform stream that
// filters out data based on a predicate
const createFilteringStream =
    (predicate, options) =>
        new Transform({
            objectMode: true,
            ...options,
            transform:
                (data, encoding, done) =>
                    done(
                        null,
                        predicate(data)
                            ? data
                            : undefined)
        });

const readFile =
    fs
        .createReadStream("../data/dotgovdomains-full.csv");

const parseCsvData =
    parseCsv({
        delimiter: ",",
        columns: true,
    });

const filterByState =
    (state, options) =>
        createFilteringStream(
            data => data.State === state,
            options);

const getDomainAndContact =
    new Transform({
        objectMode: true,
        transform:
            (data, encoding, done) =>
                done(
                    null,
                    {
                        domainName: data["Domain Name"],
                        contact:
                            data["Security Contact Email"] === "(blank)"
                                ? "N/A"
                                : data["Security Contact Email"]
                    })
    });

pipeline(
    readFile,
    parseCsvData,
    filterByState("IN"),
    getDomainAndContact,
    stringify({ header: true }),
    process.stdout,
    err => {});
