#!/usr/bin/env node
const mdLinks = require('./index.js')
const colors = require('colors');
const  {argv}  = require('process');
const path = require('path');
let userPath = process.argv[2];
if(userPath===undefined){
  console.log(colors.bgMagenta.white('WELCOME TO MD-LINKS'),'\n',
  colors.bold('INSTRUCCIONS:'),'\n', 
  '1-Type node cli.js + the path you want to query','\n', 
  '2-If you also want to know if the web links work type ', colors.yellow('--validate'), ' after the path','\n',
  '3-For stats type ', colors.yellow('--stats'), ' after the path','\n',
  '4-If you want stats of broken links type ', colors.yellow ('--validate --stats'), ' after the path','\n', '---------------------------------------------------------------','\n',
  '---------------------------------------------------------------','\n',
  '---------------------------------------------------------------','\n'
    )
  //este return detiene el error que se publica después ( el del path.resolve) y por convención se usa un número negativo
  return -1;
  }
userPath = path.resolve(userPath); 
let options =(process.argv)


//Función para imprimir arreglo sin validar
const basicArray = () => {
  mdLinks(userPath, options).then((linkObjects)=> {
    for(let linkObject in linkObjects) {
      console.log(
        colors.yellow('LINK ➡ '),linkObjects[linkObject].href, colors.green('TEXT ➡ '),linkObjects[linkObject].text, colors.cyan('FILE ➡ '),linkObjects[linkObject].file)}
  })
}

//Función para imprimir arreglo con peticiones
const validatedArray = () => {
  mdLinks(userPath, options).then((linkObjects) => {
    for(let linkObject in linkObjects) {
    console.log(
      colors.yellow('LINK ➡ '),linkObjects[linkObject].href, colors.green('TEXT ➡ '),linkObjects[linkObject].text, colors.cyan('FILE ➡ '),linkObjects[linkObject].file, colors.magenta('STATUS ➡ '),linkObjects[linkObject].status, colors.blue('STATUS TEXT ➡ '),linkObjects[linkObject].statusText
    )}
  })
}


//Función para calcular de estadísticas
const linkStats = () => {
  mdLinks(userPath, options).then((linkObjects)=> {
  let totalLink = 0
  let uniquesLinks = 0
  let linkArray = []

  for(let linkObject in linkObjects) {
    linkArray.push(linkObjects[linkObject].href)
  }
  const linksSet = new Set(linkArray)
  //console.log('kkkk',linksSet)
  totalLink = linkArray.length
  uniquesLinks = linksSet.size
    console.log(`\nTotal: ${totalLink}
Unique: ${uniquesLinks}`)
})}


//Función de estadísticas y links rotos
const validateLinkStat = () => {
  mdLinks(userPath, options).then((linkObjects) =>{
  let failLinks = 0
  let totalLinks = 0
  let arrayLinks =[]
  linkObjects.forEach(linkObject => {
    arrayLinks.push(linkObject.href)
    if(linkObject.status != 200){
      failLinks =+ 1
    }
})
totalLinks = arrayLinks.length
const linkSet = new Set(arrayLinks)
let uniqueLinks = linkSet.size
console.log(`\nBroken: ${failLinks}
Unique: ${uniqueLinks}
Total: ${totalLinks}`)
})}


if (options.includes('--validate')&&(options.includes('--stats'))) {
  validateLinkStat()
}
else if(options.includes('--stats')) {
  linkStats()
}
else if(options.includes('--validate')) {
  validatedArray()
}
else { 
  basicArray()
}
