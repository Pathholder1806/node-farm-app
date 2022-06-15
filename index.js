const http = require("http");
const url = require("url");
const fs = require("fs");

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
UTILS
###########################################
*/

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    }

    return output;
};

/*
###########################################
SERVER
###########################################
*/
const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === "/" || pathName === "/overview") {
        // PATH -> OVERVIEW
        res.writeHead(200, {
            "Content-Type": "text/html",
        });

        const cardsHTML = dataObj
            .map((ele) => replaceTemplate(templateCard, ele))
            .join("");

        const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

        res.end(output);
    } else if (pathName === "/product") {
        // PATH -> PRODUCT
        res.end("This is the product");
    } else if (pathName === "/api") {
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

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening for requests on PORT: 8000");
});
