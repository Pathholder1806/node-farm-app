const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./modules/replaceTemplate");

/*
###########################################
READING DATA
###########################################
*/
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

/*
###########################################
LOADING TEMPLATES
###########################################
*/
const templateOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
);
const templateProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
);
const templateCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
);

/*
###########################################
SERVER
###########################################
*/
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === "/" || pathname === "/overview") {
        // PATH -> OVERVIEW
        res.writeHead(200, {
            "Content-Type": "text/html",
        });

        const cardsHTML = dataObj
            .map((ele) => replaceTemplate(templateCard, ele))
            .join("");

        const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

        res.end(output);
    } else if (pathname === "/product") {
        // PATH -> PRODUCT
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    } else if (pathname === "/api") {
        // PATH -> API
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    } else {
        // PATH -> NOT FOUND
        res.end("Page not found!");
    }
});

const port = process.env.PORT || 8000;
const host = "0.0.0.0";

server.listen(port, host, () => {
    console.log(`Listening for requests on PORT: ${port}`);
});
