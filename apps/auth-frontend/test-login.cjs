const axios = require('axios');

async function test() {
  try {
    // 1. Signup
    const email = 'test' + Date.now() + '@example.com';
    const password = 'mypassword123';
    
    console.log('Signing up...');
    let res = await axios.post('http://localhost:4000/api/auth/callback/credentials-signup', new URLSearchParams({
      name: 'Test',
      email,
      password,
      redirect: 'false'
    }));
    console.log('Signup status:', res.status, res.data);

    // 2. Login
    console.log('Logging in...');
    res = await axios.post('http://localhost:4000/api/auth/callback/credentials-signin', new URLSearchParams({
      email,
      password,
      redirect: 'false'
    }), {
      validateStatus: () => true,
      maxRedirects: 0
    });
    console.log('Login status:', res.status, res.headers.location);
    console.log('Login cookies:', res.headers['set-cookie']);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
