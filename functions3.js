const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios');
const { argv } = require('process');
let userPath = process.argv[2];

//Aquí se recibe la ruta del usuario y se resuelve a absoluta con path.resolve, y se invoca la función isDirectory con esta ruta absoluta como parámetro---Hacer promesa????
const mdLinks = () => {
  userPath = path.resolve(userPath);
  console.log('Ruta absoluta: ', userPath);
    aDirectory(userPath)
    .then(response => response)
    .catch(error => console.log(error)) 
}

//Esta función es una promesa que retorna si la ruta es un archivo o es un directorio
const aDirectory = (path) => new Promise((resolve, reject) => {
  fsPromises.stat(path).then((res) => {
    if (res.isFile()) {
      resolve('es archivo')
      //aquí falta condicional q reconozca si es archivo .md
      linksOnMD(userPath)
    } else if (res.isDirectory()) {
      allFiles(userPath)
        .then(response => response)
        .catch(error => console.log(error)) 
      resolve('es directorio') 
    }
  })
  .catch(() => {
    reject('Ruta inválida')
  });
})

//Esta función es una promesa que se resuelve a través de las funciones que hacen la lectura recursiva del directorio, retorna un arreglo con los archivos .md
const allFiles = (userPath) => new Promise((resolve, reject) => {
  fs.readdir(userPath, (error, files) => {
    if(error){
      return reject (error)
    }
      const result = (files.map(file => {
        fsPromises.stat(userPath + "/" + file)
          //aquí se retorna una promesa que dice si es archivo o directorio(booleano)
          .then(item => {
            const isDir = item.isDirectory()
            const isFile = item.isFile()
            return [isDir, isFile]
          })
          // aquí la promesa resuelve qué sucede si es archivo o si es directorio y retorna en ambos casos el llamado a funciones, (en el primer caso recursivamente)
          .then(data => {
            const [isDir, isFile] = data
            let arrayOfFiles
            if(isDir){
              return (allFiles(userPath + "/" + file))
            }
            else if (isFile){
              //condicional para agregar solamente los archivos .md
              if (path.extname(userPath + "/" + file) == ".md"){
                arrayOfFiles =  (userPath + "/" + file)
                //console.log('linea 60', arrayOfFiles)
                return (linksOnMD(arrayOfFiles))
              }
            }
          })
      })
      )
      resolve(result)
  })
})

//Función que utiliza el paquete markdownLinkExtractor para extraer links de los archivos .md (hacerla promesa???)
const linksOnMD = (arrayOfFiles) => {
  fs.readFile(arrayOfFiles, 'utf-8', (error, datos)=> {
    if (error){console.log(error)}
    const links = markdownLinkExtractor(datos, true); //con el parámetro en true hay que revisar los condicionales ya que esto devuelve un array de objetos, y no un array de strings como devuelve false
    //let newLinks = [];
    //links.forEach((link) => {
      //condicional para pasar solo los links http/https
     /*  if((link.includes('#') == true) && (link.includes('http' || 'https')==true)){ */
        //newLinks.push(link)
        /* newLinks = newLinks.concat(link/* , "\n" )
      }
      else if((link.includes('#') == false) && (link.includes('http' || 'https')==true)){
        newLinks = newLinks.concat(link/* ,"\n" ) */
        //newLinks.push(link)
     // }
     //const links = markdownLinkExtractor(datos, true);
        links.forEach(link => console.log(link));
    })
      //console.log(newLinks) 
        
  //});  
} 

module.exports = mdLinks(argv)