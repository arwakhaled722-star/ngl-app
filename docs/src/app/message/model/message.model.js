import {model, Schema} from "mongoose";
const messageSchema=new schema(
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
            ref: "User",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: {
            createdAt:true,
            updatedAt:true
        }
    }
)
export const Message = model ('Message','messageSchema');
export default Message;
