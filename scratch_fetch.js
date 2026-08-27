const http = require('http');

const data = new URLSearchParams({
  email: 'test' + Date.now() + '@example.com',
  password: 'password',
  name: 'Test User',
  redirect: 'false'
}).toString();

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/callback/credentials-signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  res.on('data', (d) => {
    console.log('BODY:', d.toString());
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
