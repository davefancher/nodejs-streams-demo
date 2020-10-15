"use strict";

const fs = require("fs");
const { Transform, pipeline } = require("stream");
const { TextDecoder } = require("util");
const { ConsoleColor, logPretty } = require("./utils");

const utf8Decoder = new TextDecoder("utf-8");

// Now we're getting to the real power behind streams: Pipelining!
// Pipelining allows us to compose our streams together in a highly
// declarative manner. Fans of functional programming will immediately
// recognize this pattern.

// Create our input stream as we did in the last example
// Note that we're only subscribing to the end event here to show that
// the stream is indeed ending. All references to the decodingStream
// have been removed
const inputStream =
    fs
        .createReadStream("../data/dotgovdomains-sample.csv")
        .on(
            "end",
            x => logPretty("File reader complete", ConsoleColor.Foreground.Green));

// Create the decodingStream as we did in the last example
// Note that we're no longer subscribing to the data event and
// handling the finish and end events to show that the stream has
// ended. The reference to stdout has been removed.
const decodingStream =
    new Transform({
        readableObjectMode: true,
        writableObjectMode: false,
        transform (data, encoding, done) {
            const decodedData = utf8Decoder.decode(data);

            done(null, decodedData);
        }
    })
        .on(
            "finish",
            x => logPretty("Done decoding data (Writable)", ConsoleColor.Foreground.Green))
        .on(
            "end",
            x => logPretty("Done decoding data (Readable)", ConsoleColor.Foreground.Green));

// Compose a pipeline from the streams
inputStream
    .pipe(decodingStream)
    .pipe(process.stdout);

// Preferred alternative improves error handling across streams
// Note that this can also be promisified through the util module
// so it can be used with async/await

// pipeline(
//     inputStream,
//     decodingStream,
//     process.stdout,
//     err => {});
