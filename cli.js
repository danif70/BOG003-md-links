#!/usr/bin/env node
const mdLinks = require('./index.js')
const  {argv}  = require('process');
const path = require('path');
let userPath = process.argv[2];
userPath = path.resolve(userPath); 
let options =(process.argv)


mdLinks(userPath, options)

//Función para imprimir arreglo sin validar
const basicArray = () => {
  mdLinks(userPath, options).then((linkObjects)=> {
    console.log(linkObjects)
  })
}

//Función para imprimir arreglo con peticiones
const validatedArray = () => {
  mdLinks(userPath, options).then((linkObjects) => {
    console.log(linkObjects)
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
    arrayLinks.push(linkObject)
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

  if (options.includes('--validate')&&(options.includes('--stats'))){
    validateLinkStat()
  }
  else if(options.includes('--stats')){
    linkStats()
  }
  else if(options.includes('--validate')){
    validatedArray()
  }
  else{ basicArray()}
  
      