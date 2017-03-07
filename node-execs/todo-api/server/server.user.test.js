var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');

var {Todo} = require('../modules/todo');
var {User} = require('../modules/user');

const users = [{
    _id: new ObjectID(),
    email: 'hcheng@gsw.edu',
    password: 'abc123'
  },{
    _id: new ObjectID(),
    email: 'hcheng@ksu.edu',
    password: 'abc123'
  }
];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});


beforeEach((done)=>{
  User.remove({})
  .then(()={
    return User.insertMany(users);
  }).then(()=>{
    done();
  });
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
});
