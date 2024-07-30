const express = require('express');
const { FormEvent } = require('../models/form');
const router = express.Router();

router.post('/forms/:id/open', async (req, res) => {
    try {
        const formId = req.params.id;
        const event = new FormEvent({ formId, eventType: 'open' });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/forms/:id/start', async (req, res) => {
    try {
        const formId = req.params.id;
        const event = new FormEvent({ formId, eventType: 'start' });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/forms/:id/complete', async (req, res) => {
    try {
        const formId = req.params.id;
        const event = new FormEvent({ formId, eventType: 'complete' });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
