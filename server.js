const express = require("express"),
      hbs = require("hbs"),
      fs = require("fs");

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set("view engine", "hbs");
//app.use() is how middleware is registered
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to appent to server.log');
        }
    });
    next();
});

//maintenance middleware. This displays instead of the other routes
//The other middleware log is still ran. The method app.use() that's
//used with just a callback will run on every single route. A maintenance
//middleware that calls a res.render method and no next() call will only render
//the maintenance view and nother
// app.use((req, res, next) => {
//     res.render("maintenance");
// });

//if this .use statement is above, the maintenance functionality will break
//when navigating to static pages; help.html is a static example in /public.
app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

//RESTful Routes: index, show, new, create, edit, update, delete
app.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        message: "Welcome Home!"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Page"
    });
});

app.get("/bad", (req, res) => {
    res.send({
        errorMessage: "You've forgotten the spam with your eggs."
    });
});

app.listen(1701, () => {
    console.log("Server is running...");
});