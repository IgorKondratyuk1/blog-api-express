import {SETTINGS} from "../config";

export const logData = (refreshTokenData: any) => {
    if(SETTINGS.EXTENDED_LOGS){
        console.log('\n>>>\tRefresh Token Middleware');
        try {
            console.log(refreshTokenData);
            console.log("iat: " + new Date(1000 * refreshTokenData.iat));
            console.log("exp " + new Date(1000 * refreshTokenData.exp));
            console.log("now " + new Date());
            console.log(new Date(1000 * refreshTokenData.exp) < new Date());
        } catch (err) {
            console.log('Error catch');
            console.log(err);
        }
        console.log('>>>\tEnd\n');
    }
}