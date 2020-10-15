"use strict";

const { Buffer } = require("buffer");
const fs = require("fs");
const { Readable, Transform } = require("stream");
const { TextDecoder } = require("util");
const { ConsoleColor, logPretty } = require("./utils");

// Duplex streams can function as both readable and writeable streams. They're commonly
// used for transforming data. Here we'll focus on that aspect using the Transform stream

// Example 1: Transforming Data

const utf8Decoder = new TextDecoder("utf-8");

const decodingStream =
    new Transform({
        readableObjectMode: true,
        writableObjectMode: false,
        transform (data, encoding, done) {
            // Handle the transformation
            const decodedData = utf8Decoder.decode(data);

            // Put the transformed object back in the stream via the done callback
            done(null, decodedData);
        }
    })
        .on(
            "data",
            // Forward the transformed data on to stdout
            data => process.stdout.write(data))
        .on(
            "finish",
            x => logPretty("Done decoding data (Writable)", ConsoleColor.Foreground.Green))
        .on(
            "end",
            x => logPretty("Done decoding data (Readable)", ConsoleColor.Foreground.Green));

fs
    .createReadStream("../data/dotgovdomains-sample.csv")
    .on(
        "data",
        data => {
            //console.log(data);
            // Rather than making this event handler responsible for knowing
            // how to decode the data hand the data off to the decodingStream
            // that already knows how to do it
            decodingStream.write(data);
        })
    .on(
        "end",
        x => {
            logPretty("File reader complete", ConsoleColor.Foreground.Green);
            // Finished reading the file so tell the decoder that we're done
            decodingStream.end();
        });

// This is powerful but oh is it horrible to write and maintain.
// Confession: I struggled to write even this simple example because the
// amount of orchestration, while minimal, is still necessary. This
// approach also forces us to establish direct dependencies between the
// various streams. Fortunately there's a much cleaner way.