var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var Pool=require('pg').Pool;
var bodyParser=require('body-parser');
var config={
    user:'gillarohith1',
    database:'gillarohith1',
  //  host:'db.imad.hasura-app.io',
    port:'5432',
    host: 'db.imad.hasura-app.io',
    password: process.env.DB_PASSWORD
    //password:'db-gillarohith1-74120'
    //password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
var names = [];
app.get('/submit-name/', function (req, res) { // submit-name/?name= 
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

var articles = {
    'article-one': {
        title: 'Article 1 | Rohith Gilla',
        heading: 'Article 1',
        date: 'Aug 15, 2017',
        content: `  
                <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>`
    },
    'article-two': {
        title: 'Article 2 | Rohith Gilla',
        heading: 'Article 2',
        date: 'Aug 19, 2017',
        content: `  
                <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>`
    },
    'article-three': {
        title: 'Article 3 | Rohith Gilla',
        heading: 'Article 3',
        date: 'Aug 21, 2017',
        content: `  
                <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>
                    
                    <p>
                        Hey writing HTML after such a ling time :p so I am really excited. Hey writing HTML after such a ling time :p so I am really excited
                        Hey writing HTML after such a ling time :p so I am really excited
                    </p>`
    }
};

function createTemplate(data) {
    var title = data.title;
    var date = data.date;
    var content = data.content;
    var heading = data.heading;

    var htmlTemplate = `<!DOCTYPE html>
    <html>
        <head>
            <title>${title} </title>
            <meta name='viewport' content='width-device-width ,initial-scale=1'>
            <link href="/ui/style.css" rel="stylesheet" />
    
        </head>
    
        <body>
            <div class="container">
                <div>
                    <a href='/'>Home</a>
                </div>
                <hr/>
                <h3>${heading}</h3> 
                <div>
                    ${date.toDateString()}
                </div>
                <div> ${content}</div>
            </div>
        
        </body>
        
    </html>`;
    return htmlTemplate;
}
var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
    
}
app.get('/hash/:input', function(req,res){
    var hashedstring=hash(req.params.input,'Gilla');
    res.send(hashedstring);
});
app.post('/create-user',function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var salt=crypto.randomBytes(128).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO "user"(username,password) VALUES($1,$2)',[username,dbString],function(err,result){
         if(err){
           res.status(500).send(err.toString());
           
       } 
       else{
           res.send("User sucessfully created:"+username);
       }
   });
   
});
app.post('/login',function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var dbString=hash(password,salt);
   pool.query('INSERT INTO "user"(username,password) VALUES($1,$2)',[username,dbString],function(err,res){
         if(err){
           res.status(500).send(err.toString());
         
       } 
       else{
        if(result.rows.length===0){
            res.status(403).send('user not found asshole');
        }
        else{
            var dbString=result.rows[0].password;
            var salt=dbString.split('$')[2];
            var hashedPassword=hash(password,salt);
            if(hashedPassword===dbstring){
                res.send('Correct details dude');
            }
            else{
                res.status(403).send('user not found asshole');
            }
            
        }
       }
   });    
});
var pool=new Pool(config);
app.get('/user-db',function(req,res){
    pool.query('SELECT * FROM user',function(err,result){
       if(err){
           res.status(500).send(err.toString());
           
       } 
       else{
           res.send(JSON.stringify(result.rows));
       }
    });
});
app.get('/articles/:articleName', function (req, res) {
    //var articleName = req.params.articleName;
    pool.query("SELECT * FROM article WHERE title='"+req.params.articleName+"'",function(err,result){
       if(err)
       {
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length===0)
           {
               res.send('Article not found re asshole');
           }
           else{
               var articleData=result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });

});
app.get('/ui/style.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
    console.log(`IMAD course app listening on port ${port}!`);
});
