import { user } from "../model/user.model.js";

export async function updateUserByEmail(email, updatedData) {
    return await user.findOneAndUpdate(
        { email: email },
        updatedData,
        { returnDocument: 'after' }
    );
}