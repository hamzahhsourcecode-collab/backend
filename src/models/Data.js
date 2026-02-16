import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please add content'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Data', DataSchema);
