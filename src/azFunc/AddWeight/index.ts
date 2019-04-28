import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Settings } from "../Common/Settings";
const FatSecret = require("fatsecret");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const settings = new Settings(context.log);

    const weight= (req.query.weight || (req.body && req.body.weight)) as string;

    if(!weight){
        context.res = {
            headers: {
                "Content-Type": "text/html"
            },
            body: "Add todays weight:<br/>"+
            "<form action=''><label for='weight'>kg</label><input type='text' name='weight' id='weight'>"+
            "<button type='submit'>Submit</button></form>"
        };
        return;
    }

    const w = Number.parseFloat(weight.replace(",", "."));

    if(Number.isNaN(w) || w < 0){
        context.res = {
            status: 500,
            body: "not a valid number!"
        }
        return;
    }

    context.log("writing weight: "+w+" (parsed from: "+ weight +")");

    const fs = new FatSecret(settings.appKey, settings.appSecret);
    fs.setUserAuth(settings.userToken, settings.userTokenSecret);

    const result = await fs.method('weight.update', {
        current_weight_kg: w
    });

    context.log.warn(result);
    context.res = {
        body: {staus:"ok"}
    };
};

export default httpTrigger;
