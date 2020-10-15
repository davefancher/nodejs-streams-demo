"use strict";

const fs = require("fs");
const { Transform, pipeline } = require("stream");
// Use a 3rd party package to work with CSV data
const parseCsv = require("csv-parse");
const stringify = require("csv-stringify");
const { logPretty, ConsoleColor } = require("./utils");


// Backpressure is built in to node.js pipelines to prevent the system
// from getting overwhelmed with data. The streams each implement some internal
// buffering that waits for backlogged data to clear before allowing more data
// through. The amount of data allowed through is dependent upon each stream's
// highWaterMark option.

// The highWaterMark behavior differs between normal mode and object mode.
// standard mode is concerned with the highWaterMark is concerned with the number
// of bytes in the stream whereas object mode is concerned with the number of
// objects in the stream. Both readable and writable streams default the
// highWaterMark value to 16K for standard mode and 16 objects in object mode.

// Detailed discussion of backpressure in node.js streams
// https://nodejs.org/es/docs/guides/backpressuring-in-streams/

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
        })
        .on("drain", x => logPretty("Draining filtering stream", ConsoleColor.Foreground.Yellow));

const readFile =
    fs
        .createReadStream(
            "../data/dotgovdomains-full.csv",
            {
                //highWaterMark: 2
            });

const parseCsvData =
    parseCsv({
        delimiter: ",",
        columns: true,
        highWaterMark: 3
    })
    .on("drain", x => logPretty("Draining csv parsing stream", ConsoleColor.Foreground.Yellow));

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
    filterByState("IN", { highWaterMark: 2 }),
    getDomainAndContact,
    stringify({
        header: true,
        highWaterMark: 2
    })
        .on("drain", x => logPretty("Draining csv writing stream", ConsoleColor.Foreground.Yellow)),
    process.stdout,
    err => {});
