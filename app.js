// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
require("dotenv").config();
// console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID);
const Prismic = require("@prismicio/client");
var PrismicDOM = require("prismic-dom");
const express = require("express");
const app = express();
const path = require("path");
const { response } = require("express");
const port = 3000;

// Add link resolver
const handleLinkResolver = (doc) => {
  // Define the url depending on the document type
  if (doc.type === "page") {
    return "/page/" + doc.uid;
  } else if (doc.type === "blog_post") {
    return "/blog/" + doc.uid;
  }

  // Default to homepage
  return "/";
};

// Connect to the API
const initApi = (req) => {
  return Prismic.getGraphQLEndpoint(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  });
};

//Create a middleware to add the prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };

  res.locals.PrismicDOM = PrismicDOM;
  next();
});

// const fetch = require('node-fetch');
// const path = require('path');
// const express = require('express');

// const app = express();
// const port = process.env.PORT || 8005;

// const Prismic = require('@prismicio/client');
// const PrismicH = require('@prismicio/helpers');

// // Initialize the prismic.io api
// const initApi = (req) => {
//   return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     req,
//     fetch,
//   });
// };

// // Link Resolver
// const HandleLinkResolver = (doc) => {
//   // Define the url depending on the document type
//   //   if (doc.type === 'page') {
//   //     return '/page/' + doc.uid;
//   //   } else if (doc.type === 'blog_post') {
//   //     return '/blog/' + doc.uid;
//   //   }

//   // Default to homepage
//   return '/';
// };

// // Middleware to inject prismic context
// app.use((req, res, next) => {
//   res.locals.ctx = {
//     endpoint: process.env.PRISMIC_ENDPOINT,
//     linkResolver: HandleLinkResolver,
//   };
//   res.locals.PrismicH = PrismicH;

//   next();
// });

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
// app.locals.basedir = app.get('views');

// const handleRequest = async (api) => {
//   const [meta, home, about, { results: collections }] = await Promise.all([
//     api.getSingle('meta'),
//     api.getSingle('home'),
//     api.getSingle('about'),
//     api.query(Prismic.Predicates.at('document.type', 'collection'), {
//       fetchLinks: 'product.image',
//     }),
//   ]);

//   const assets = [];

//   home.data.gallery.forEach((item) => {
//     assets.push(item.image.url);
//   });

//   about.data.gallery.forEach((item) => {
//     assets.push(item.image.url);
//   });

//   about.data.body.forEach((section) => {
//     if (section.slice_type === 'gallery') {
//       section.items.forEach((item) => {
//         assets.push(item.image.url);
//       });
//     }
//   });

//   collections.forEach((collection) => {
//     collection.data.products.forEach((item) => {
//       assets.push(item.products_product.data.image.url);
//     });
//   });

//   return {
//     assets,
//     meta,
//     home,
//     collections,
//     about,
//   };
// };

// app.get('/', async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);

//   res.render('pages/home', {
//     ...defaults,
//   });
// });

// app.get('/about', async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);

//   res.render('pages/about', {
//     ...defaults,
//   });
// });

// app.get('/collections', async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);

//   res.render('pages/collections', {
//     ...defaults,
//   });
// });

// app.get('/detail/:uid', async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);

//   const product = await api.getByUID('product', req.params.uid, {
//     fetchLinks: 'collection.title',
//   });

//   res.render('pages/detail', {
//     ...defaults,
//     product,
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.get("/", (req, res) => {
//   res.render("index", {
//     // from presmic
//     meta: {
//       data: {
//         title: "Floema",
//         description: "Metadata description.",
//       },
//     },
//   });
// });

app.get("/", (req, res) => {
  res.render("pages/home");
});
// app.get("/about", (req, res) => {
//   initApi(req).then((api) => {
//     api
//       .query(Prismic.Predicates.at("document.type", "about"))
//       .then((response) => {
//         console.log("pages/about");
//       });
//   });
// });
app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/collections", (req, res) => {
  res.render("pages/collections");
});

app.get("/detail/:uid", (req, res) => {
  res.render("pages/detail");
});

app.listen(port, () => {
  console.log(` Example app listening at http://localhost:${port}`);
});
