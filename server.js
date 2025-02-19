// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the docs directory
app.use(express.static(path.join(__dirname, 'docs')));

// SAML callback route
app.post('/auth/callback', (req, res) => {
  const { SAMLResponse } = req.body;
  
  // Store SAML response in session or handle as needed
  // Redirect to the main app with authentication info
  res.redirect('/?authenticated=true&samlResponse=' + encodeURIComponent(SAMLResponse));
});

// Serve the main index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});