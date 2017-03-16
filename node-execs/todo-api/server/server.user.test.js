var expect = require('expect');
var request = require('supertest');
var server = require('../server');
var {ObjectID} = require('mongodb');

var {Todo} = require('../modules/todo');
var {User} = require('../modules/user');
const {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('Test User APIs', ()=>{
  it("Success User Save",(done)=>{
    done();
  });
});
