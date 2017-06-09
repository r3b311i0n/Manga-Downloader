import * as cheerio from 'cheerio';
import {remote} from 'electron';
import * as fs from 'fs';
import * as http from 'http';
import * as React from 'react';

export default class App extends React.Component<{}, void> {
    constructor(props: any) {
        super(props);
    }

    private scrape = () => {
        let file: any;

        fs.readFile('/home/r3b311i0n/mangafox.html', 'utf-8', (err: any, data: Buffer) => {
            if (err) {
                throw err;
            }
            const $ = cheerio.load(data.toString());

            console.log($('.manga_list').text());
        });
    };

    private download = () => {
        const file = fs.createWriteStream('/home/r3b311i0n/mangafox.html');
        http.get('http://mangafox.me/manga', (response) => {
            response.pipe(file);
        });
    };

    public render() {
        return (
            <div>
                <input type="button" value="Download" onClick={this.download}/>
                <input type="button" value="Scrape" onClick={this.scrape}/>
            </div>
        );
    }
}
