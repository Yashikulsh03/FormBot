const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create a new form
router.post('/forms', auth, async (req, res) => {
    const { title, fields } = req.body;
    const form = new Form({ title, fields, createdBy: req.user._id });

    try {
        await form.save();
        const user = await User.findById(req.user._id);
        user.forms.push(form._id);
        await user.save();
        res.status(201).send(form);
    } catch (error) {
        res.status(400).send(error);
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
        res.send(form);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a form
router.delete('/forms/:id', auth, async (req, res) => {
    try {
        const form = await Form.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!form) {
            return res.status(404).send();
        }

        const user = await User.findById(req.user._id);
        user.forms.pull(form._id);
        await user.save();

        res.send(form);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
