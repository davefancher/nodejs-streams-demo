"use strict"

const fs = require("fs");
// PassThrough is a special case of Duplex stream that allows intercepting data
const { PassThrough, Readable } = require("stream");

// Utility function to create a stream that waits for one stream to finish before chaining in another
const concatenateStreams =
    (options, ...streams) => {
        const handleNextStream =
            ([ current, ...remaining ]) => {
                if (current) {
                    current.pipe(target, { end: false });

                    current.once("end", () => {
                        handleNextStream(remaining);
                    });
                } else {
                    target.emit("end");
                }
            };

        const target = new PassThrough(options);

        handleNextStream(streams);

        return target;
    };

concatenateStreams(
    null, // Options
    Readable.from("The quick brown fox jumped over the lazy dog", { encoding: "utf-8" }),
    Readable.from("All your base are belong to us", { encoding: "utf-8" }),
    fs.createReadStream("../data/dotgovdomains-sample.csv"))
    .pipe(process.stdout);
