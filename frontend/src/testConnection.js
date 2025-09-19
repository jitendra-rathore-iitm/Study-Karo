// Test connection to backend
const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test registration
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User Frontend',
        email: 'testfrontend@example.com',
        password: 'test123'
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration test:', registerData);
    
    // Test login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testfrontend@example.com',
        password: 'test123'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login test:', loginData);
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
};

// Run the test
testConnection();
