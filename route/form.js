const express = require('express');
const router = express.Router();
const { Form, FormEvent } = require('../models/form');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create a new form
router.post('/forms', auth, async (req, res) => {
    const { title, fields } = req.body;
    const form = new Form({ title, fields, createdBy: req.user._id });

    try {
        await form.save();
        const user = await User.findById(req.user._id);
        if (!user.forms) {
            user.forms = [];  // Ensure forms array is initialized
        }
        user.forms.push(form._id);
        await user.save();
        res.status(201).send(form)
    } catch (error) {
        res.status(400).send(error);
        console.log(error)
    }
});

// Get all forms created by the authenticated user
router.get('/forms', auth, async (req, res) => {
    try {
        const forms = await Form.find({ createdBy: req.user._id });
        res.status(200).send(forms);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific form
router.get('/forms/:id', auth, async (req, res) => {
    try {
        const form = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!form) {
            return res.status(404).send();
        }
        res.status(200).send(form);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a form
router.patch('/forms/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'fields'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const form = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });

        if (!form) {
            return res.status(404).send();
        }

        updates.forEach(update => form[update] = req.body[update]);
        await form.save();
        res.status(200).json({message:"Form updated sucessfully"})
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a form
router.delete('/forms/:id', auth, async (req, res) => {
    try {
        const form = await Form.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!form) {
            return res.status(404).send({ error: 'Form not found' });
        }

        const user = await User.findById(req.user._id);

        if (user) {
            // Ensure forms array is initialized
            if (!Array.isArray(user.forms)) {
                user.forms = [];
            }

            user.forms.pull(form._id);
            await user.save();
            res.status(200).json({message:"Form deleted sucessfully"});
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during form deletion:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});
router.post('/forms/:id/submit', async (req, res) => {
    const formId = req.params.id;
    const { responses } = req.body;

    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).send({ error: 'Form not found' });
        }

        // Log form completion event
        const completeEvent = new FormEvent({ formId, eventType: 'complete' });
        await completeEvent.save();

        res.status(201).send({ message: 'Form submitted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});
router.get('/forms/:id/stats', async (req, res) => {
    const formId = req.params.id;

    try {
        const totalOpens = await FormEvent.countDocuments({ formId, eventType: 'open' });
        const totalStarts = await FormEvent.countDocuments({ formId, eventType: 'start' });
        const totalCompletes = await FormEvent.countDocuments({ formId, eventType: 'complete' });

        const completionRate = totalCompletes / totalStarts * 100;

        res.status(200).send({
            totalOpens,
            totalStarts,
            totalCompletes,
            completionRate: isNaN(completionRate) ? 0 : completionRate.toFixed(2) // Ensure rate is a number
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;



module.exports = router;
