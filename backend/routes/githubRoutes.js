const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

const username = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

// Solution 1: Regular expression route (most reliable)
router.get(/^\/files\/(.+)/, async (req, res) => {
  try {
    const filePath = req.params[0]; // Captured by the regex group
    
    if (!filePath) {
      return res.status(400).json({ error: 'Path is required' });
    }

    console.log('Requested File Path:', filePath);

    // Properly encode each path segment
    const encodedPath = filePath.split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');

    const url = `https://api.github.com/repos/${username}/${repo}/contents/${encodedPath}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      timeout: 5000
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error:', err);
    
    if (err.response) {
      res.status(err.response.status).json({
        error: 'GitHub API Error',
        message: err.response.data.message,
        docs: err.response.data.documentation_url
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }
});

module.exports = router;