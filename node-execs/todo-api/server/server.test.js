var expect = require('expect');
var request = require('supertest');
var server = require('../server');

var {Todo} = require('../modules/todo');

describe("Test POST",()=>{
    // 
    describe("POST /todos",()=>{
    
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
                    Todo.find().then((todos)=>{
                        // expect(todos.length).toBe(5);
                        // expect(todos[4].text).toBe(text);
                        done();
                    }).catch((error)=>{
                        done(error)
                    })
                });
        });
        
        it("Fail Todo Save with Empty Text",(done)=>{
            var text = "   ";
            request(server.nodeApp)
                .post('/todos')
                .send({text})
                .expect(200)
                .end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    Todo.find().then((todos)=>{
                        // expect(todos.length).toBe(5);
                        // expect(todos[4].text).toBe(text);
                        done();
                    }).catch((error)=>{
                        done(error);
                    })
                });
                done();

        });
    });
});
