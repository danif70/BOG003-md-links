const mdLinks = require('./md-links')
const  {argv}  = require('process');
const path = require('path');
let userPath = process.argv[2];
let userValidate = process.argv[3];
let userStats = process.argv[4];
userPath = path.resolve(userPath); 

mdLinks(userPath, userValidate === '--validate', userStats === '--stats')
