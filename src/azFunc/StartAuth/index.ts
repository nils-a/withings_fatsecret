import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Settings } from "../Common/Settings";
import axios from "axios";
const FatSecret = require("fatsecret");
import { parse as parseQueryString } from "querystring";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const settings = new Settings(context.log);
    const apiKey = settings.appKey;
    const secret = settings.appSecret;

    if(!apiKey || !secret){
        context.res = {
            headers: {
                "Content-Type": "text/html"
            },
            body: "<h2>missing api-key or secret</h2>"
        };
        context.done(null, context.res);
        return;
    }

    // load FS-API
    const fs = new FatSecret(apiKey, secret);
    const pin = req.query.pin;

    if(!pin){
        // 1st call... need to redirect user...
        const tokenUrl = fs.getOauthUrl();
        const tokenRawData = await axios.get(tokenUrl);
        const tokenData = parseQueryString(tokenRawData.data);
        context.log(tokenData);
        const url2 = "http://www.fatsecret.com/oauth/authorize?oauth_token="+tokenData["oauth_token"];

        context.res = {
            headers: {
                "Content-Type": "text/html"
            },
            body: "You need to click below, then allow and paste the pin here<br/>"+
            "<br/><a href='" + url2 + "' target='_blank'>Click to authorize!</a><br/><br/>"+
            "<form action=''><label for='pin'>PIN</label><input type='text' name='pin' id='pin'>"+
            "<input type='hidden' name='oauth_token' value='"+ tokenData["oauth_token"] +"'>"+
            "<input type='hidden' name='oauth_token_secret' value='"+ tokenData["oauth_token_secret"] +"'>"+
            "<button type='submit'>Process PIN</button></form>"
        };
    
        context.done(null, context.res);
        return;
    }

    const token = req.query.oauth_token;
    const tokenSecret = req.query.oauth_token_secret;
    const authUrl = await fs.getAccessToken(token, tokenSecret, pin);
    const authRawData = await axios.get(authUrl);
    const authData = parseQueryString(authRawData.data);
    context.log(authData);

    context.res = {
        headers: {
            "Content-Type": "text/html"
        },
        body: "<h2>Success.</h2><div>You need to add the following to your settings:<br/><ul>"+
        "<li><strong>userToken</strong>: "+authData["oauth_token"]+"</li>" +
        "<li><strong>userTokenSecret</strong>: "+authData["oauth_token_secret"]+"</li>" +
        "</ul></div>"
    };
    context.done(null, context.res);
};

export default httpTrigger;
