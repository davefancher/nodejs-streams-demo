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

const output = fs.createWriteStream("./writableStreamOutput.txt");
output.write("JavaScript was made for the masses,\r\n");
output.write("It lacked types, and modules, and classes.\r\n");
output.write("But it became quite the giant,\r\n");
output.write("Because it ran on server and client,\r\n");
output.write("Until it crashed both, despite 100 test passes.\r\n");
output.end();
