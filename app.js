// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
/**
 * backend start
 *  Express is going to be the routes of the website
 */

require('dotenv').config()
// console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID);
const Prismic = require('@prismicio/client')
var PrismicDOM = require('prismic-dom')
const express = require('express')
const app = express()
const path = require('path')
const { response } = require('express')
const port = 3000

// Add link resolver
const handleLinkResolver = (doc) => {
    // Define the url depending on the document type
    if (doc.type === 'page') {
        return '/page/' + doc.uid
    } else if (doc.type === 'blog_post') {
        return '/blog/' + doc.uid
    }

    // Default to homepage
    return '/'
}

// Connect to the API
const initApi = (req) => {
    return Prismic.getGraphQLEndpoint(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req: req,
    })
}

//Create a middleware to add the prismic context
app.use((req, res, next) => {
    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ENDPOINT,
        linkResolver: handleLinkResolver,
    }

    res.locals.PrismicDOM = PrismicDOM
    next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('pages/home')
})

app.get('/about', (req, res) => {
    res.render('pages/about')
})

app.get('/collections', (req, res) => {
    res.render('pages/collections')
})

app.get('/detail/:uid', (req, res) => {
    res.render('pages/detail')
})

app.listen(port, () => {
    console.log(` Example app listening at http://localhost:${port}`)
})
