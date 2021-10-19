const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios').default;
const FileHound = require('filehound');

const mdLinks = (userPath, options) => new Promise ((resolve, reject) => {
  //console.log('linea 12', options)
  aFile(userPath)
    .then(response => {
      if (response) {
        return [userPath]
      }
      else {
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
    .then((linkObjects)=>{
      if(options.includes('--validate')){
        return linkValidate(linkObjects)
      }
      else{
        return linkObjects
      }
    })  
    .then((response) => {
      resolve(response)
      //console.log(response)
    })
    .catch((error) =>{
      reject(error)

    })
})


//Esta función es una promesa que valida la ruta y si es archivo
const aFile = (userPath) => new Promise((resolve, reject) => {
  fs.stat(userPath, (error, stats) => {
    if (error) {
      reject('Ruta inválida')
    } else {
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


//Función para extraer links de dataFile entregado por readFile y además se filtran. Esta función es síncrona porque ya recibe el texto plano (no lo busca)
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
  const linkValidateAxios = linkObjects.map((linkObject => {
    return axios.get(linkObject.href)
    .then((response)=>{
      return {href:linkObject.href, text: linkObject.text, file: linkObject.file, status: response.status, statusText: response.statusText}
        
    })
    .catch((error) => {
      const failMessage = 'FAIL'
      return {href:linkObject.href, text: linkObject.text, file: linkObject.file, status: error.response.status, statusText: failMessage}
    }) 
  }))
return Promise.all(linkValidateAxios)
}


module.exports = mdLinks
