"use strict";

const fs = require("fs");

// Writable streams are for data leaving the system. Typically this would be an HTTP
// response, writing to a file, or a database. Writable streams are a bit difficult
// to demonstrate so we'll stick to some existing streams here.


// Example 1: Using process.stdout

process.stdout.write("Hey! isn't this just console.log???\r\n");
process.stdout.write("Yeah, it certainly looks like it!\r\n");





// Example 2: Writing to a file

// https://www.freecodecamp.org/news/programming-language-limericks-a8fb3416e0e4/

const limerick = [
    "JavaScript was made for the masses,",
    "It lacked types, and modules, and classes.",
    "But it became quite the giant,",
    "Because it ran on server and client,",
    "Until it crashed both, despite 100 test passes."];

const output = fs
    .createWriteStream("./limerick.txt")
    .on("finish", x => console.log("Done writing limerick to file"));

limerick.forEach(line => output.write(`${line}\r\n`));

output.end();
