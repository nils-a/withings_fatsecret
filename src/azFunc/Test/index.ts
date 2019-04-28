import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Settings } from "../Common/Settings";
const FatSecret = require("fatsecret");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const settings = new Settings(context.log);

    const fs = new FatSecret(settings.appKey, settings.appSecret);
    fs.setUserAuth(settings.userToken, settings.userTokenSecret);
    const weights = await fs.method('weights.get_month', {
        format: 'json'
    });

    context.log.warn(weights);
    context.res = {
        body: weights
    };
};

export default httpTrigger;
