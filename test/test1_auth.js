const test=require('ava')
const {agent, request}  =require('supertest')
const createApp = require('../app') 
const app = agent(createApp());
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const sleep = require('util').promisify(setTimeout)


test('User can succesfully login;User can get new access token using refresh token', async t => {
    const res = await app.post('/auth/login').send({
      login: 'login',
      password: 'password',
    })
    t.is(res.status, 200);
    t.is(res.body.status, 'succses')
    t.truthy(typeof res.body.token === 'string');
    t.truthy(typeof res.body.refreshtoken === 'string');

    const res2 = await app.post('/auth/refresh').send({
      refreshtoken: res.body.refreshtoken,
    });
    t.is(res2.status, 200);
    t.truthy(typeof res2.body.token === 'string');
    t.truthy(typeof res2.body.refreshtoken === 'string');
  });

  test('User gets 403 (invalid pass)', async t => {
    const res = await app.post('/auth/login').send({
      login: 'login',
      password: 'INVALID',
    });
    t.is(res.status, 403);
    t.is(res.body.status, 'error')

  });

  test('User gets 403 (invalid user)', async t => {
    const res = await app.post('/auth/login').send({
      login: 'INVALID',
      password: 'INVALID',
    });
    t.is(res.status, 403);
    t.is(res.body.status, 'error')
  });

  test('User receives 401 on expired token', async t => {
     const expiredToken = jwt.sign({ id: '5e6e298f9c2b8a2648db45f3',type:'level' },'SECRET_KEY',{ expiresIn: '1ms' })
    //  await sleep(0)
    const res = await app
      .post('/testpostauth')
      .set('Authorization', `Bearer ${expiredToken}`)
   
    t.is(res.body.status, 'error');
    t.is(res.status, 401);
  });

  test('User receives 401 (without token)', async t => {
    const res = await app .post('/testpostauth')
    t.is(res.status, 401);
    t.is(res.body.status, 'error');
  });

  test('401(invalid token)', async t => {
    const res = await app
      .post('/testpostauth')
      .set('Authorization', `Bearer ${'badtoken'}`);
    t.is(res.status, 401);
    t.is(res.body.status, 'error');
  });

  test('200 (OK token)', async t => {
    const token = jwt.sign({ id: '5e6e298f9c2b8a2648db45f3',type:'level' },'SECRET_KEY') 
    const res = await app
      .post('/testpostauth')
      .set('Authorization', `Bearer ${token}`);
    t.is(res.status, 200);
    t.is(res.body.data, 'secret');
 
  });

  test('403 infalid refresh token', async t => {
    const res = await app.post('/auth/refresh').send({
      refreshtoken: 'INVALID REFRESH TOKEN',
    });
    t.is(res.status, 403);
    t.is(res.body.status,'error');
  });

  
test('User can use refresh token only once', async t => {
  const res = await app.post('/auth/login').send({
    login: 'login',
    password: 'password',
  })
  
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshtoken === 'string');

  const res2 = await app.post('/auth/refresh').send({
    refreshtoken: res.body.refreshtoken,
  });
  t.is(res2.status, 200);
  t.truthy(typeof res2.body.token === 'string');
  t.truthy(typeof res2.body.refreshtoken === 'string');

  const res3 = await app.post('/auth/refresh').send({
    refreshtoken: res.body.refreshtoken,
  });
  t.is(res3.status, 403);
  t.is(res3.body.status, 'error');
});


test('Refresh tokens become invalid on logout', async t => {
  const res = await app.post('/auth/login').send({
    login: 'login',
    password: 'password',
  })
  
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshtoken === 'string');

  const res2 = await app.post('/auth/logout').send({
    refreshtoken: res.body.refreshtoken,
  });
  t.is(res2.status, 200);
  t.is(res2.body.status, 'succses');

  const res3 = await app.post('/auth/refresh').send({
    refreshtoken: res.body.refreshtoken,
  });
  t.is(res3.status, 403);
  t.is(res3.body.status, 'error');
});
