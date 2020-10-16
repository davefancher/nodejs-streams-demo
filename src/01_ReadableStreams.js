"use strict";

const { Buffer } = require("buffer");
const fs = require("fs");
const { Readable } = require("stream");
const { TextDecoder } = require("util");
const { ConsoleColor, logPretty } = require("./utils");

const utf8Decoder = new TextDecoder("utf-8");

const theQuickBrownFox =
    Buffer.from([84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114, 111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112, 101, 100, 32, 111, 118, 101, 114, 32, 116, 104, 101, 32, 108, 97, 122, 121, 32, 100, 111, 103]);

const allYourBase =
    Buffer.from([65, 108, 108, 32, 121, 111, 117, 114, 32, 98, 97, 115, 101, 32, 97, 114, 101, 32, 98, 101, 108, 111, 110, 103, 32, 116, 111, 32, 117, 115]);

// Readable Streams are for data coming into the system from some external source.
// Typically a file, http request, or data from a database

// Example 1: Creating a readable stream
// This stream operates in standard mode which means that it may accept only strings, buffers or Uint8Array values. We'll use buffers.

const example1Stream =
    // Create the iterable. We're not reading directly so we provide an empty read() implementation
    new Readable({
        read() { }
    })
        // Subscribe to the data event to do something when data is ready
        .on(
            "data",
            data => {
                const decoded = utf8Decoder.decode(data);
                console.log(decoded);
            })
        // Subscribe to the end event to indicate when we've reached the end of the stream
        .on(
            "end",
            x => logPretty("Example 1 Done", ConsoleColor.Foreground.Green));

// Push some data to the stream so it can be handled
example1Stream.push(theQuickBrownFox);

// Push some more data to the stream
example1Stream.push(allYourBase);

// Push null to the stream to tell the stream that we've reached the end
example1Stream.push(null);





// Example 2: Using object mode

// Adapted from https://devhints.io/nodejs-stream
const startClock =
    (maxTicks = 5) => {
        let ticks = 0;

        const stream = new Readable({
            // Enable object mode by setting the option
            objectMode: true,
            read() { }
        })

        // Push an object to the stream every second until we've added
        // the specified number of ticks
        const timer =
            setInterval(() => {
                stream.push({ time: new Date() });

                if (ticks++ >= maxTicks) {
                    clearInterval(timer);
                    stream.push(null);
                }
            }, 1000)

        return stream
    };

startClock()
    .on(
        "data",
        data => console.log(data.time.toISOString()))
    .on(
        "end",
        x => logPretty("Clock done", ConsoleColor.Foreground.Green));





// Example 3: Reading from a file

// Use the createReadStream function from the fs module to read the contents of a file
fs
    .createReadStream("../data/dotgovdomains-sample.csv")
    .on(
        "data",
        data => console.log(data))
    .on(
        "end",
        x => logPretty("File reader complete", ConsoleColor.Foreground.Green));

// Ummmm... How about that buffer? We handled it with our earlier example but we'll
// look at another approach shortly.