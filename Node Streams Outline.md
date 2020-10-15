# Node.js Streams

## Types of Streams

* Writable
* Readable
* Duplex
    * Transform

## Modes

* Standard/Normal
* Object

## Writable Streams

### Examples

* Client HTTP Requests
* Server HTTP Responses
* Files
* stdin

## Readable Streams

### Examples

* Client HTTP Responses
* Server HTTP Requests
* Files
* stdout

### Modes

* Flowing
* Paused

## Composability

* Piping
* Unpiping

## Duplex & Transform Streams

### Examples

* TCP sockets
* Crypto streams

## Backpressure

* `highWaterMark` option

## `end` vs `finish` events

* `end` is for readable streams
* `finish` is for writable streams
