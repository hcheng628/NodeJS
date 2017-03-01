var expect = require('expect');
var request = require('supertest');
var server = require('../server');

var {Todo} = require('../modules/todo');

const todos = [{
    text: "1st Todo"
},{
    text: "2nd Todo"
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe("Test POST",()=>{
        it("Success Todo Save",(done)=>{
            var text = "Testing Text";
            request(server.nodeApp)
                .post('/todos')
                .send({text})
                .expect(200)
                .expect((response)=>{
                    expect(response.body.text).toBeA('string').toBe(text);
                })
                .end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    Todo.find({text}).then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((error)=>{
                        done(error);
                    })
                });
        });
        
        it("Fail Todo Save with Empty Text",(done) => {
            request(server.nodeApp)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err,res) => {
                    if(err){
                        return done(err);
                    }
                    Todo.find().then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                    }).catch((error)=> done(error));
                });
        });
});

describe("Test GET",()=>{
    it("GET /todos should get all todos",(done)=>{
            request(server.nodeApp)
            .get('/todos')
            .expect(200)
            .expect((resp)=> {
                console.log("Hello:" + JSON.stringify(resp.body.todos.length));
                expect(resp.body.todos.length).toBe(2);
            })
            .end(done);
        });
});