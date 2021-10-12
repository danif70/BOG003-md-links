//utilizando filehoun pata obtener archivos .md ¿cómo hacer promesa esa función?
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios').default;
const { argv } = require('process');
const FileHound = require('filehound');


const mdLinks = (userPath, userValidate) => {
  console.log('linea 15', userValidate)
  aFile(userPath)
    .then(response => {
      if (response) {
        console.log('linea 19 ', userPath)
        return [userPath]
      }
      else {
        console.log('linea 23 ', userPath)
        return allTheFiles(userPath)
      }
    })
    .then((arrayFiles) => {
      return mdFiles(arrayFiles)
    })
    .then((allMdFiles) => {
      return Promise.all(readFiles(allMdFiles))
    })
    .then((nestedObjects)=> {
      return nestedObjects.flatMap((arrayObjects)=> arrayObjects)
    })
    .then((linkObjects) => {
      if(userValidate){
        return linkValidate(linkObjects)
      }
    })
    .then((response) => {
      console.log('último consolelog ', response)
    })

    .catch(console.log)
}

//Esta función es una promesa que valida la ruta y si es archivo
const aFile = (userPath) => new Promise((resolve, reject) => {
  fs.stat(userPath, (error, stats) => {
    if (error) {
      reject('Ruta inválida')
    } else {
      //console.log('linea 39 ',stats.isFile())
      resolve(stats.isFile())
    }
  })
})

//Esta función que utiliza el paquete filehound y retorna un arreglo con los archivos
const allTheFiles = (userPath) => FileHound.create().paths(userPath).find();

//Función para filtrar archivos .md
const mdFiles = (arrayFiles) => arrayFiles.filter(file => (path.extname(file) === '.md'));

//Función para leer un archivo, entrega texto plano
const readFile = (mdFile) => new Promise((resolve, reject) => {
  readObject = {}
  fs.readFile(mdFile, 'utf-8', (error, dataFile) => {
    if (error) {
      reject('Error inesperado al intentar leer el archivo ' + mdFile)
    }
    else {
      resolve(extractLinksFromFile(dataFile, mdFile))
    }
  })
})

//Función para leer varios archivos de un directorio. Por cada archivo se llama la función que lo lee.
const readFiles = (mdFiles)  => {
  const promisesArray = []
  mdFiles.forEach((file) => {
    promisesArray.push(readFile(file))     
  })
  return promisesArray
}


//Función para extraer links de dataFile entrgado por readFile y además se filtran. Esta función es síncrona porque ya recibe el texto plano (no lo busca)
const extractLinksFromFile = (dataFile, filePath) => markdownLinkExtractor(dataFile, true)
  .filter(objectDetail => (((objectDetail.href).includes('#') == true) && ((objectDetail.href).includes('http' || 'https')) == true) ||
  ((objectDetail.href).includes('#') == false) && ((objectDetail.href)
  .includes('http' || 'https')))
  .map(objectDetail => ({
    href: objectDetail.href,
    text: objectDetail.text,
    file: filePath,
  })) 


//Función para validar si los links de los objetos funcionan, usando la librería Axios.
const linkValidate = (linkObjects) => {
  return Promise.all(linkObjects.map(linkObject => {
    return axios.get(linkObject.href)}))
    .then((responses)=>{
      return responses.map((response)=>{
          return {href:response.responseUrl, text: response.text, file: response.file, status: response.status, statusText: response.statusText}
      })
    })
  
}



module.exports = mdLinks
/*  console.log(response)
     newObject=
    {
      href: href,
      text: text,
      file: filePath,
      status: response.status,
      statusText: response.statusText,
    }
    })
    .catch(() =>{
    newObject =
    {
      href: href,
      text: text,
      file: filePath,
      status: '404',
      statusText: 'NotOK',
    }  */