import { model, Schema } from 'mongoose';

const conversationSchema = new Schema({
    originalMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
        unique: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Conversation = model('Conversation', conversationSchema);
export default Conversation;