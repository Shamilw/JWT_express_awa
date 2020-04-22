const test=require('ava')
const {agent, request}  =require('supertest')
const createApp = require('../app') 
const app = agent(createApp());

test('App works', async t => {
    const res = await app.get('/t');
    t.is(res.status,909);
  });
  
test('can post', async t => {
  const data={a:34,b:3}
  const res = await app.post('/testpost').send(data)
  t.is(res.status, 200);
  t.is(res.body.status, 'succses')
})