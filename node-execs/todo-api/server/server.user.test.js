var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');

var {Todo} = require('../modules/todo');
var {User} = require('../modules/user');
const {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('Test User APIs', ()=>{
  describe('GET /users/me', ()=>{
    it('it should return a user', (done)=>{
      // console.log("Checking..." + users[0].tokens[0].token);

      request(server.nodeApp)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((resp)=>{
        console.log(resp.body._id);
        console.log(resp.body.email);
        expect(resp.body._id).toBe(users[0]._id.toHexString());
        expect(resp.body.email).toBe(users[0].email);
        })
      .end((err,res)=>{
        if(err) return done(err);
        done();
      });
    });
    it('it should return a 401 not authenticated', (done)=>{
      request(server.nodeApp)
      .get('/users/me')
      .expect(401)
      .end(done);
    });
  });

  describe('POST /users', ()=>{
    it('it should create a user', (done)=>{
      var email = 'hcheng@ksu.edu';
      var password="password";
      var newUser = {
        email: email,
        password: password
      };
      request(server.nodeApp)
      .post('/users')
      .send({newUser})
      .expect(200)
      .expect((resp)=>{
        expect(resp.body.email).toBe(email);
        expect(resp.headers['x-auth']).toExist();
        expect(resp.body._id).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findOne({email: email}).then((res)=>{
          expect(res.email).toBe(email);
          expect(res.password)toNotBe(password);
          done();
        }).catch((err)=>{
          if(err){
            return done(err);
          }
          done();
        });
      });
    });
    it('it should return a validation error', (done)=>{
    });
    it('it should not create an user if email in use', (done)=>{
    });
  });
});
