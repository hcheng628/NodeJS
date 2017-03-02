var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');

var {Todo} = require('../modules/todo');

const todos = [{
    _id: new ObjectID(),
    text: "1st Todo"
},{
    _id: new ObjectID(),
    text: "2nd Todo"
}
];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});


describe('Test Todo APIs', ()=>{
  describe("test POST",()=>{
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

  describe("test GET",()=>{
      it("should GET all todos && statusCode_OK_200",(done)=>{
              request(server.nodeApp)
              .get('/todos')
              .expect(200)
              .expect((resp)=> {
                  expect(resp.body.todos.length).toBe(2);
              })
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

      it("should not GET a todo & 404", (done)=>{
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
});
