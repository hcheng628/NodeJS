const express = require('express');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('registerHelper_getCurrentYear', ()=>{
    // return new Date().getFullYear + 'SuperCheng.us';
    var returnStr = new Date().getFullYear() + ' by SuperCheng.us';
    return returnStr;
});

hbs.registerHelper('registerHelper_doUppercase', (inText)=>{
    return inText.toUpperCase();
});

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


app.get('/',(req, resp) => {
    // resp.send('<h1>Hello there!</h1>');
    resp.render('home.hbs',{
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear(),
        welcomeMessage: 'Welcome to Node Express',
        espresso: 'Double Shots'
    });
});


app.get('/about', (req,resp)=>{
    // resp.send('About Page');
    resp.render('about.hbs',{
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear(),
        espresso: 'Single Shot'
    });
});

app.get('/bad',(req,resp)=>{
    resp.send({
        error: {
            message: 'Response Error',
            code: 1101
        }
    });
});

app.listen(3000, ()=>{
    console.log('Server is Up and Running');
});