import installer from '@amopro/widget-installer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

const __dirname = path.resolve();
dotenv.config();

const {WidgetInstaller} = installer;

const widgetPath = path.resolve(__dirname, './widget.zip');

if (!fs.existsSync(widgetPath)) {
    console.log('widget.zip not defined!');
} else {
    const installerParams = {
        subDomain: process.env.AMO_SUBDOMAIN,
        login: process.env.AMO_LOGIN,
        password: process.env.AMO_PASSWORD,
        widgetZipPath: widgetPath,
        redirectUri: process.env.APP_URL,
        amoMarket: true, // true - если аккаунт имеет доступ к amoМаркет (с 2022-06-08)
    };
    const wi = new WidgetInstaller(installerParams);

    wi.upload().then(() => {
        console.log('Widget uploaded!');
    }).catch(e => {
        console.log(e.toString())
    });
}

