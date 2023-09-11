#!/usr/bin/env node

const yargs = require("yargs");
const AsciiTable = require('../src/AsciiTable');

const args = yargs.scriptName('asciitable')
    .usage("Usage: $0 -i input")
    .option('i', {
        type: 'string',
        alias: 'input',
        description: "Delimited input",
        demandOption: "The input option is required"
    })
    .option('s', {
        type: 'string',
        alias: 'style',
        description: "Table style",
        choices: ['mysql','unicode','compact'],
        default: 'unicode'
    })
    .option('c', {
        type: 'string',
        alias: 'column-separator',
        description: "Column delimiter",
        default: '|'
    })
    .option('r', {
        type: 'string',
        alias: 'row-separator',
        description: "Row delimiter",
        default: '>'
    })
    .argv;

const table = new AsciiTable(args.i, {
    colSeparator: args.c,
    rowSeparator: args.r
});

console.log(table.format(args.s));