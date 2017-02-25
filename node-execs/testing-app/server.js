const express = require('express');

const app = express();
const portNum = process.env.PORT || 3000;

console.log("portNum: " + portNum);

app.get('/',(req,resp,error)=>{
    resp.send("<h1>SuperCheng</h1>");
});

app.get('/object',(req,resp,error)=>{
    resp.send(
        [ 
            {user:{
                    name: 'A',
                    age: 1
                }
            },
            {user:{
                    name: 'B',
                    age: 2
                }
            },
            {user:{
                    name: 'C',
                    age: 3
                }
            }
        
        ]
    );
});



app.listen(portNum, ()=>{
    console.log('Server is up and running @Port: ' + portNum);
});

module.exports = {
    app
}