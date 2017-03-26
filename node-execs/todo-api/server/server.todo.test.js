var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');
var {Todo} = require('../modules/todo');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');
// const todos = [{
//     _id: new ObjectID(),
//     text: "1st Todo"
// },{
//     _id: new ObjectID(),
//     text: "2nd Todo"
// }];
//
//
// beforeEach((done)=>{
//     Todo.remove({}).then(()=>{
//         return Todo.insertMany(todos);
//     }).then(()=>done());
// });

beforeEach(populateTodos);
beforeEach(populateUsers);


describe('Todo APIs', ()=>{
  describe("test POST",()=>{
          it("should save Todo",(done)=>{
            var text = "Testing Text";
            var _creator = users[0]._id;
            request(server.nodeApp)
              .post('/todos')
              .set('x-auth', users[0].tokens[0].token)
              .send({text, _creator})
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

          it("should NOT save Todo with empty text",(done) => {
            var text = "";
            var _creator = users[0]._id;
            request(server.nodeApp)
              .post('/todos')
              .set('x-auth', users[0].tokens[0].token)
              .send({text, _creator})
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

  describe("test GET",()=>{
      it("should GET all todos && statusCode_OK_200",(done)=>{
        request(server.nodeApp)
          .get('/todos')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((resp)=> {
            expect(resp.body.todos.length).toBe(1);
          })
          .end(done);
        });

      it("should NOT GET all todos && statusCode_UnAuthorized_401",(done)=>{
        request(server.nodeApp)
          .get('/todos')
          .expect(401)
          .end(done);
      });

      it("should GET a todo && statusCode_OK_200", (done)=>{
        request(server.nodeApp)
          .get('/todos/' + todos[0]._id.toHexString())
          .expect(200)
          .expect((resp)=>{
            expect(resp.body.text).toBe(todos[0].text);
          })
          .end(done);
      });

      it("should NOT GET a todo & 404", (done)=>{
        request(server.nodeApp)
          .get('/todos/' + new ObjectID().toHexString())
          .expect(404)
          .end(done);
      });

      it("should GET - BadInput & statusCode_BadClientRequest_400", (done)=>{
        request(server.nodeApp)
          .get('/todos/123')
          .expect(400)
          .end(done);
      });
  });

  describe('test PATCH',()=>{
    it('should PATCH a todo & statusCode_OK_200',(done)=>{
      var text = 'Writing Node Test Cases';
      request(server.nodeApp)
      .patch('/todos/' + todos[0]._id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect((returnVal)=>{
        // console.log('---------: ' + JSON.stringify(returnVal.body,undefined,2));
        expect(returnVal.body.text).toBeA('string').toBe(text);
      })
      .expect(200)
      .end(done);
    });

    it('should NOT PATCH a todo & statusCode_UnAuthorized_401',(done)=>{
      var text = 'Writing Node Test Cases';
      request(server.nodeApp)
      .patch('/todos/' + todos[0]._id.toHexString())
      .send({ text })
      .expect(401)
      .end(done);
    });

    it('should NOT PATCH a todo & 404',(done)=>{
      var text = 'Writing Node Test Cases';
      request(server.nodeApp)
      .patch('/todos/' + new ObjectID().toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(404)
      .end(done);
    });

    it('should NOT PATCH a todo & statusCode_BadClientRequest_400',(done)=>{
      var tempText = {
        text: 'Writing Node Test Cases'
      };
      request(server.nodeApp)
      .patch('/todos/' + '123')
      .set('x-auth', users[0].tokens[0].token)
      .send({tempText})
      .expect(400)
      .end(done);
    });
  });

  describe('test DELETE',()=>{

    it('should NOT DELETE a Todo & statusCode_UnAuthorized_401',(done)=>{
      request(server.nodeApp)
      .delete('/todos/' + todos[0]._id.toHexString())
      //.set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
    });

    it('should NOT DELETE a Todo & statusCode_NotFound_404',(done)=>{
      request(server.nodeApp)
      .delete('/todos/' + new ObjectID().toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should NOT DELETE a Todo with different login & statusCode_NotFound_404',(done)=>{
      request(server.nodeApp)
      .delete('/todos/' + todos[0]._id.toHexString())
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should fail DELETE & statusCode_BadClientRequest_400',(done)=>{
      request(server.nodeApp)
      .delete('/todos/' + 'BADINPUT')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
    });

    it('should DELETE a Todo',(done)=>{
      request(server.nodeApp)
      .delete('/todos/' + todos[0]._id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end(done);
    });
  });
});
