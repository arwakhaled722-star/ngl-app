import {OAuth2Client} from"google-auth-library";
import {AppError} from "../../pkg/error/error.js";
const client = new OAuth2Client({client_id:process.env.GOOGLE_OAUTH_CLIENT_ID});
export async function verifyGoogleToken(idToken){
    try{
        const ticket =await client.verifyIdToken({
            idToken:idToken,
            audience:process.env.GOOGLE_OAUTH_CLIENT_ID
        });
        return ticket.getPayload();
    }catch(err){
        throw new AppError('invalid google token',403);
    }
    
}