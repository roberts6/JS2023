import mongoose from "mongoose";

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: String
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);

