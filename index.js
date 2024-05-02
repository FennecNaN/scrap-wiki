const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express');
const app = express()

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if(response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
            
            // recogida de enlaces
            const enlacesRaperos = []
            $('#mw-pages a').each((index, element) => {
                const enlace = $(element).attr('href');
                enlacesRaperos.push(enlace);
            });

            // recogida datos por enlace
            const datos = []

            enlacesRaperos.map((enlace) => {
                return axios.get(`https://es.wikipedia.org${enlace}`).then((response) => {
                    const html = response.data
                    const $ = cheerio.load(html)

                    const title = $('h1').text();

                    const imgs = [];
                    $('img').each((index,element) => {
                        const img = $(element).attr('src');
                        imgs.push(img)
                    });
                    
                    const texts = [];
                    $('p').each((index,element) => {
                        const text = $(element).text()
                        texts.push(text)
                    });
                    
                    datos.push({
                        titulo: title,
                        imagenes: imgs,
                        textos: texts,
                    })
                    //muestra los datos por consola
                    console.log(datos)
                })       
            })
            res.send(datos)
        }
    })
})

app.listen(3000, () => {
    console.log('Escuchando en puerto 3000')
})