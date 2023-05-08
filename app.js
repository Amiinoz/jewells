// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
/**
 * backend start
 *  Express is going handle the routes of the website
 */

require('dotenv').config()
console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID)

// const nodeFetch = require('node-fetch')
const fetch = require('node-fetch')

const path = require('path')
const express = require('express')
const app = express()
const { response } = require('express')
const UAParser = require('ua-parser-js')

const port = 3000

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')

//  create a Prismic client instance with the provided endpoint and access token.
const initApi = (req) => {
    return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req: req,
    })
}
// ========================================================================
// *** Function returns the appropriate URL for a given document type
// ========================================================================

const handleLinkResolver = (doc) => {
    if (doc.type === 'product') {
        return `/detail/${doc.slug}`
    }

    if (doc.type === 'collections') {
        return '/collections'
    }

    if (doc.type === 'about') {
        return `/about`
    }

    // Default to homepage
    return '/'
}

// ========================================================================
// ***  Middleware adds some variables to the response locals object,
// *** such as device type and link resolver
// ========================================================================

app.use((req, res, next) => {
    const ua = UAParser(req.headers['user-agent'])

    res.locals.isDesktop = ua.device.type === undefined
    res.locals.isPhone = ua.device.type === 'mobile'
    res.locals.isTablet = ua.device.type === 'tablet'

    res.locals.Link = handleLinkResolver
    res.locals.PrismicH = PrismicH
    res.locals.Numbers = (index) => {
        return index === 0
            ? 'One'
            : index === 1
            ? 'Two'
            : index === 2
            ? 'Three'
            : index === 3
            ? 'Four'
            : ''
    }

    next()
})

//========================================================================
// ***  Method sets the view engine to Pug and the views directory
// *** to the views folder in the current directory.
//========================================================================
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

//========================================================================
// *** Fetches data from the Prismic API using the api instance and
// *** returns an object with the fetched data.
//========================================================================
const handleRequest = async (api) => {
    try {
        const [meta, preloader, navigation, home, about, collections] =
            await Promise.all([
                api.getSingle('meta'),
                api.getSingle('preloader'),
                api.getSingle('navigation'),
                api.getSingle('home'),
                api.getSingle('about'),
                Promise.all([
                    api.query(
                        Prismic.Predicates.at('document.type', 'collection'),
                        {
                            fetchLinks: 'product.image',
                        }
                    ),
                ]),
            ])

        const assets = []

        home.data.gallery.forEach((item) => {
            assets.push(item.image.url)
        })

        about.data.gallery.forEach((item) => {
            assets.push(item.image.url)
        })

        about.data.body.forEach((section) => {
            if (section.slice_type === 'gallery') {
                section.items.forEach((item) => {
                    assets.push(item.image.url)
                })
            }
        })

        collections[0].forEach((collection) => {
            collection.data.products.forEach((item) => {
                assets.push(item.products_product.data.image.url)
            })
        })

        return {
            assets,
            meta,
            preloader,
            navigation,
            home,
            collections: collections[0],
            about,
        }
    } catch (error) {
        console.error(error)
    }
}

app.get('/', async (req, res) => {
    const api = await initApi(req)
    const defaults = await handleRequest(api)

    res.render('pages/home', {
        ...defaults,
    })
})

app.get('/about', async (req, res) => {
    const api = await initApi(req)
    const defaults = await handleRequest(api)

    res.render('pages/about', {
        ...defaults,
    })
})

app.get('/collections', async (req, res) => {
    const api = await initApi(req)
    const defaults = await handleRequest(api)
    // res.render('pages/collections')

    res.render('pages/collections', {
        ...defaults,
    })
})

// ========================================================================================
// *** This Method is the main route for the website. it define routes for the website
// *** and renders views using the fetched data.
// ========================================================================================
app.get('/detail/:uid', async (req, res) => {
    const api = await initApi(req)
    const defaults = await handleRequest(api)

    const product = await api.getByUID('product', req.params.uid, {
        fetchLinks: 'collection,title',
    })

    res.render('pages/detail', {
        ...defaults,
        product,
    })
    // res.render('pages/detail')
    console.log(product)
})

app.listen(port, () => {
    console.log(` Example app listening at http://localhost:${port}`)
})
