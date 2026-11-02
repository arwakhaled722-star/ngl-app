import {model, Schema} from "mongoose";
const messageSchema=new Schema(
    {
              content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 200,
            trim:true
        },
        reciever: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        identityRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'accepted', 'rejected'],
        default: 'none'
        },
        },
        
    {
        timestamps: {
            createdAt:true,
            updatedAt:true
        }
    }
)
export const Message = model ('Message',messageSchema);
export default Message;
