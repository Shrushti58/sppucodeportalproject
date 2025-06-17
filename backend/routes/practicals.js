const express = require('express');
const router = express.Router();
const axios = require('axios');
const Practical = require('../models/Practical');
require('dotenv').config();
const Subject=require('../models/Subject');

router.get('/subject/:id', async (req, res) => {
  try {
    const practicals = await Practical.find({ subject: req.params.id }).populate('subject');

    const withCode = await Promise.all(
      practicals.map(async (p) => {
        let code = '';
        if (p.codeLink) {
          try {
            const rawLink = p.codeLink
              .replace('https://github.com/', 'https://raw.githubusercontent.com/')
              .replace('/blob/', '/');

            const response = await axios.get(rawLink);
            code = response.data;
          } catch (err) {
            code = '// Error fetching code';
          }
        }

        return {
          _id: p._id,
          title: p.title,
          description: p.description,
          subject: p.subject,
          code, // add fetched code here
        };
      })
    );

    res.json(withCode);
  } catch (err) {
    console.error('Error fetching practicals by subject:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Utility to sanitize file names
function sanitizeFileName(title, extension) {
  const base = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return base + (extension.startsWith('.') ? extension : `.${extension}`);
}

// Route: Create new practical
router.post('/', async (req, res) => {
  const { title, description, code, subject, extension } = req.body;

  if (!title || !description || !code || !subject || !extension) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 🔍 Get full subject details
    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Prepare GitHub file info
    const owner = 'Shrushti58';
    const repo = 'sppucodeportal';
    const branch = 'main';
    const folderPath = `CS/${subjectDoc.semester}/${subjectDoc.name}/`;
    const fileName = sanitizeFileName(title, extension);
    const filePath = `${folderPath}${fileName}`;

    // 📤 Push file to GitHub
    const githubResponse = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Add practical: ${title}`,
        content: Buffer.from(code).toString('base64'),
        branch,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // ✅ GitHub link
    const codeLink = `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`;

    // 💾 Save in DB
    const newPractical = new Practical({
      title,
      description,
      codeLink,
      subject
    });

    await newPractical.save();

    res.status(201).json(newPractical);

  } catch (err) {
    console.error('Error while creating practical:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create GitHub file or save practical' });
  }
});



function extractGitHubInfo(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+?)\/(.+)/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
    branch: match[3],
    path: match[4],
  };
}

router.put('/:id', async (req, res) => {
  try {
    console.log("🔄 Updating practical with ID:", req.params.id);

    const practical = await Practical.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("✅ Practical updated in DB:", practical.title);

    if (req.body.code && practical.codeLink) {
      console.log("🔗 GitHub link found:", practical.githubLink);

      const info = extractGitHubInfo(practical.codeLink);
      if (!info) {
        console.log("❌ Could not extract GitHub info from link.");
        return res.status(400).json({ error: 'Invalid GitHub link format' });
      }

      console.log("🧩 Extracted GitHub Info:", info);

      const { owner, repo, branch, path } = info;

      try {
        const shaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
          params: { ref: branch },
        });

        const sha = shaRes.data.sha;
        console.log("📦 Current file SHA from GitHub:", sha);

        const content = Buffer.from(req.body.code).toString('base64');
        console.log("📝 Base64 encoded content (truncated):", content.slice(0, 50), "...");

        const updateRes = await axios.put(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            message: `Update practical code for ${practical.title}`,
            content,
            sha,
            branch,
          },
          {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          }
        );

        console.log("✅ GitHub push response:", updateRes.data.commit?.html_url || updateRes.data);
      } catch (githubError) {
        console.error("❌ GitHub update failed:", githubError.response?.data || githubError.message);
        return res.status(500).json({ error: 'Failed to update file on GitHub', details: githubError.response?.data || githubError.message });
      }
    }

    res.json(practical);
  } catch (err) {
    console.error("❌ General error while updating practical:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get all practicals
router.get('/', async (req, res) => {
  try {
    const practicals = await Practical.find().populate('subject');
    res.json(practicals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get practicals for a specific subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const practicals = await Practical.find({ subject: req.params.subjectId });
    res.json(practicals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new practical

router.get('/:id', async (req, res) => {
  try {
    const practical = await Practical.findById(req.params.id);
    res.json(practical);
  } catch (err) {
    res.status(404).json({ error: 'Practical not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const practical = await Practical.findById(req.params.id);
    if (!practical) {
      return res.status(404).json({ error: 'Practical not found' });
    }

    if (practical.codeLink) {
      const info = extractGitHubInfo(practical.codeLink);
      if (!info) {
        return res.status(400).json({ error: 'Invalid GitHub link format' });
      }

      const { owner, repo, branch, path } = info;

      try {
        // Get SHA first
        const shaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
          params: { ref: branch },
        });

        const sha = shaRes.data.sha;

        // Delete from GitHub
        await axios.delete(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
          data: {
            message: `Delete practical: ${practical.title}`,
            sha,
            branch,
          },
        });

        console.log('✅ Deleted from GitHub:', path);
      } catch (err) {
        console.error('❌ GitHub deletion failed:', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to delete file from GitHub', details: err.response?.data || err.message });
      }
    }

    // Finally, delete from MongoDB
    await Practical.findByIdAndDelete(req.params.id);
    res.json({ message: 'Practical and GitHub file deleted' });

  } catch (err) {
    console.error("❌ Error during delete:", err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
