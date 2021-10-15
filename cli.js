#!/usr/bin/env node
const mdLinks = require('./index.js')
const  {argv}  = require('process');
const path = require('path');
let userPath = process.argv[2];
userPath = path.resolve(userPath); 
let options =(process.argv)

mdLinks(userPath, options)
