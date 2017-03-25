var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');

var {Todo} = require('../modules/todo');
var {User} = require('../modules/user');
const {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('Test User APIs', ()=>{
  describe('POST /users', ()=>{
    it('it should create a user', (done)=>{
      var email = 'hcheng@ksu.edu';
      var password="password";
      var newUser = {
        email: email,
        password: password
      };
      // console.log({newUser});
      // console.log({email, password});
      request(server.nodeApp)
      .post('/users')
      .send({email, password})
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
          expect(res.password).toNotBe(password);
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
      var email = 'hcheng@hcheng';
      var password = '123';
      request(server.nodeApp)
      .post('/users')
      .send({email,password})
      .expect(500)
      .expect((resp)=>{
        expect(resp.headers['x-auth']).toNotExist();
      })
      .end((err)=>{
        if(err) return done(err);
        done();
      })
    });
    it('it should not create an user if email in use', (done)=>{
      var email = 'hcheng@spsu.edu';
      var password = 'password';
      request(server.nodeApp)
      .post('/users')
      .send({email, password})
      .expect(500)
      .expect((resp)=>{
        expect(resp.headers['x-auth']).toNotExist();
      })
      .end((err)=>{
        if(err) return done(err);
        done();
      });
    });
  });

  describe('GET /users/me', ()=>{
    it('it should return a user', (done)=>{
      // console.log("Checking..." + users[0].tokens[0].token);

      request(server.nodeApp)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((resp)=>{
        // console.log(resp.body._id);
        // console.log(resp.body.email);
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

  describe('POST /users/login', ()=>{
    it('it should login', (done)=>{
      request(server.nodeApp)
      .post('/users/login')
      .send({email: users[0].email, password: users[0].password})
      .expect(200)
      .expect((resp)=>{
        expect(resp.body._id).toBe(users[0]._id.toHexString());
        expect(resp.body.email).toBe(users[0].email);
        expect(resp.headers['x-auth']).toExist();
      }).
      end((err,res)=>{
        if(err){
          done(err);
        }
        done();
      });
    });

    it('it should NOT login InCorrect Password', (done) => {
      request(server.nodeApp)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password + '1'
      })
      .expect(500)
      .expect((resp)=>{
        // console.log('---------', resp.error);
        expect(resp.error.text).toBe('InCorrect Password');
        expect(resp.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if(err){
          done(err);
        }
        done();
      });
    });
    //
    it('it should NOT login no such E-mail found', (done)=>{
      request(server.nodeApp)
      .post('/users/login')
      .send({
        email: 'haha' + users[0].email,
        password: users[0].password
      })
      .expect(500)
      .expect((resp)=>{
        expect(resp.error.text).toBe('No such E-mail Address Found');
        expect(resp.headers['x-auth']).toNotExist();
      })
      .end((err,resp)=>{
        if(err){
          done(err);
        }
        done();
      })
    });
  });

  describe('DELETE users/me/token', ()=>{
    it('it should remove a token', (done)=>{
      request(server.nodeApp)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((resp)=>{
        console.log(JSON.stringify(resp.body, undefined,2));
        var obj = {};
        // return Object.keys(obj).length;

        expect(resp.body).toEqual(obj);
      })
      .end((err,res)=>{
        if(err){
          done(err);
        }
        User.findOne({email: users[0].email}).then((doc)=>{
          expect(doc.tokens.length).toBe(0);
          done();
        }).catch((err)=>{
          done(err);
        })
      });
    });
  });
});
