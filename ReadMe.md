# Withings -sync- FatSecret

This is a sync-helper from withings to [fatsecret](https://www.fatsecret.de/).

I wanted an integration but there was none. So I decided to utilize [IFTTT](https://ifttt.com/). However, since the also was no direct integration for fatsecret I decided on a `Whithings -> IFTTT -> some-magic -> fatsecret`-Flow. As it turns out there is already something like that at [github: Cerebus/withings_fatsecret](https://github.com/Cerebus/withings_fatsecret). Since that code was written in python and hosted using flask I decided on writing in Typescript and host in azure :-)

## Setup
1. Register as a fatsecret developer for [FatSecret Platform API](https://platform.fatsecret.com/api/Default.aspx?screen=prem) (Basic ed. suffices)
2. Create a new azure function app
3. Build & Deploy the function under [src/azFunc](./src/azFunc)
4. Register a new app and get your FatSecret API key and -secret from [Manage API Keys](https://platform.fatsecret.com/api/Default.aspx?screen=myk)
	* Use the url of the azure function app as website-url
5. Add Settings under `Platform features` -> `Configuration`:
	* **appKey** - your app key from step 4
	* **appSecret** - your app secret from step 4 
5. open [yourfuncname.../api/StartAuth](https://<yourfuncname>.azurewebsites.net/api/StartAuth?code=<yourcode>)
	* Follow the instuctions to authorize the function 
6. Add Settings under `Platform features` -> `Configuration`:
	* **userToken** - the userToken obtained in step 5
	* **userTokenSecret** - the userTokenSecret obtained in step 5

## Test
For testing there is an endpoint under [yourfuncname.../api/Test](https://<yourfuncname>.azurewebsites.net/api/Test?code=<yourcode>)

If everything works correctly it should list the weights of the current month (in JSON format).

## weigh in 

The "real" endpoint is `AddWeight`. It resides under [yourfuncname.../api/Test](https://<yourfuncname>.azurewebsites.net/api/AddWeight?code=<yourcode>).
It can be used using a request-parameter `weight`. I.e. calling `https://<yourfuncname>.azurewebsites.net/api/AddWeight?weight=95.3&code=<yourcode>).`

### connect to IFTTT
**TODO** Add some text on how get forward on this :-)