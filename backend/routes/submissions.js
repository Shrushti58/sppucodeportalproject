const axios = require('axios');
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Practical = require('../models/Practical');
const Subject = require('../models/Subject');
const sendEmail = require('../utils/email');



function sanitizeFileName(title, extension = '.txt') {
  const base = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (!extension.startsWith('.')) extension = '.' + extension;
  return base + extension;
}


router.post('/:submissionId/approve', async (req, res) => {
  const { submissionId } = req.params;

  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' });
    }

    const submission = await Submission.findById(submissionId).populate('subject');
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (submission.status === 'approved') {
      return res.status(400).json({ error: 'Submission already approved' });
    }

    const { title, description, code, subject } = submission;
    const extension = submission.extension || '.py';
    if (!code) return res.status(400).json({ error: 'Code is empty' });

    const subjectDoc = submission.subject;
    const owner = 'Shrushti58';
    const repo = 'sppucodeportal';
    const branch = 'main';
    const folderPath = `CS/${subjectDoc.semester}/${subjectDoc.name}/`;

    let fileName = sanitizeFileName(title, extension);
    let filePath = `${folderPath}${fileName}`;

    // Avoid conflicts
    let counter = 1;
    while (true) {
      try {
        await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
          headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        });
        fileName = sanitizeFileName(title, extension).replace(extension, `_${counter}${extension}`);
        filePath = `${folderPath}${fileName}`;
        counter++;
      } catch (err) {
        break;
      }
    }

    // Push to GitHub
    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Approve student submission: ${title}`,
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

    const codeLink = `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`;

    const newPractical = new Practical({ title, description, codeLink, subject: subjectDoc._id });
    await newPractical.save();

    submission.status = 'approved';
    await submission.save();

    // Send Appreciation Email
await sendEmail(
  submission.email,
  '🎉 Congratulations! Your Practical is Approved!',
  `
  <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; background-color: #f7f7f7;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #2ecc71;">Hello ${submission.name},</h2>

      <p>We’re excited to share that your submitted practical <strong>"${submission.title}"</strong> has been <strong style="color: green;">approved</strong> and published on the <strong>SPPU Code Portal</strong>! 🚀</p>

      <p>Your effort, clarity, and dedication truly stood out — thank you for your valuable contribution!</p>

      <p>You can now view your approved code here:</p>

      <blockquote style="background: #f9f9f9; padding: 12px 18px; border-left: 5px solid #2ecc71; color: #555;">
        <a href="${codeLink}" target="_blank" style="color: #3498db; text-decoration: none;">${codeLink}</a>
      </blockquote>

      <p>We look forward to seeing more amazing work from you in the future. Keep sharing your knowledge and inspiring others! 🌱</p>

      <br/>

      <p>Keep learning, keep coding. 💻✨</p>
      <p><strong>— The SPPU Code Portal Team</strong></p>
    </div>
  </div>
  `
);



    res.status(200).json({ message: '✅ Submission approved and code pushed to GitHub', practical: newPractical });

  } catch (error) {
    console.error('❌ Approval error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to approve submission' });
  }
});





router.put('/:submissionId/reject', async (req, res) => {
  const { submissionId } = req.params;
  const { reason } = req.body;

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (submission.status === 'rejected') return res.status(400).json({ error: 'Already rejected' });
    if (submission.status === 'approved') return res.status(400).json({ error: 'Cannot reject an approved submission' });

    submission.status = 'rejected';
    submission.rejectionReason = reason;
    await submission.save();

    // Send Rejection Email
    await sendEmail(
  submission.email,
  '🛠 Feedback on Your Practical Submission',
  `
  <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; background-color: #f7f7f7;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #e74c3c;">Hello ${submission.name},</h2>

      <p>Thank you for submitting <strong>"${submission.title}"</strong> to the <strong>SPPU Code Portal</strong>.</p>

      <p>After a careful review, we couldn't approve the submission this time. Please find the feedback below:</p>

      <blockquote style="background: #f9f9f9; padding: 12px 18px; border-left: 5px solid #e74c3c; color: #555; font-style: italic;">
        ${reason}
      </blockquote>

      <p>We truly appreciate the effort and enthusiasm you've shown. Don’t let this discourage you — every step you take is part of a valuable learning journey.</p>

      <p>You're always welcome to refine and resubmit your practical. If you need any help or clarification, feel free to reach out.</p>

      <br/>

      <p>Keep learning, keep coding. 💻✨</p>
      <p><strong>— The SPPU Code Portal Team</strong></p>
    </div>
  </div>
  `
);


    res.status(200).json({ message: '❌ Submission rejected and email sent' });

  } catch (error) {
    console.error('Rejection error:', error.message);
    res.status(500).json({ error: 'Failed to reject submission' });
  }
});


router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const pendingSubmissions = await Submission.find({ status: 'pending' }).populate('subject');
    res.status(200).json(pendingSubmissions);
  } catch (error) {
    console.error('Error fetching pending submissions:', error.message);
    res.status(500).json({ error: 'Failed to fetch pending submissions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, title, description, code } = req.body;

    if (!name || !email || !subject || !title || !description || !code) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const submission = new Submission({
      name,
      email,
      subject,
      title,
      description,
      code
    });

    await submission.save();
    res.status(201).json({ message: 'Submission received. Awaiting admin review.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});

module.exports = router;
