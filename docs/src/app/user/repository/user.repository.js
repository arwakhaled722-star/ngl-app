import { user } from "../model/user.model.js";

export async function updateUserByEmail(email, updatedData) {
    return user.findOneAndUpdate(
        { email: email },
        updatedData,
        { returnDocument: 'after' }
    );
}
export async function findUserById(id){
    return user.findOne({_id:id,isDeleted:false},{password:0},{});
}
export async function updateUserById(id, updatedData) {
    return user.findOneAndUpdate(
        { _id: id },
        updatedData,
        { returnDocument: 'after' }
    );
}