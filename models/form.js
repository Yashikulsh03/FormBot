const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    type: { type: String, required: true, enum: ['text', 'image', 'gif', 'video', 'text-input', 'number', 'email', 'date', 'rating', 'button'] },
    options: [String], // For fields like rating or dropdowns
    required: { type: Boolean, default: false }
});

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fields: [fieldSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Form', formSchema);

const formEventSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    eventType: {
        type: String,
        enum: ['open', 'start', 'complete'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FormEvent = mongoose.model('FormEvent', formEventSchema);
module.exports=FormEvent;


