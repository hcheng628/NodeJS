const server = require('./server');
var expect = require('expect');
const  supertest = require('supertest');
const fs = require('fs');

it('Test Server App /', (done)=>{
    supertest(server.app)
        .get('/')
        .expect(200)
        .expect('<h1>SuperCheng</h1>')
        .expect('Content-Type', /html/)
        .end(done);
});

it('Test Server App /object', (done)=>{
    supertest(server.app)
        .get('/object')
        .expect(200)
        .expect((res)=>{
            expect(res.body).toInclude(
                [
                    { user:{
                        age: 1,
                        name: 'A'
                        }
                    }
                ]
            );
        })
        .end(done);
});

