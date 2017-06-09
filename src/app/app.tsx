import * as cheerio from 'cheerio';
import {remote} from 'electron';
import * as fs from 'fs';
import * as http from 'http';
import * as React from 'react';
import ErrnoException = NodeJS.ErrnoException;

export default class App extends React.Component<{}, void> {
    constructor(props: any) {
        super(props);

        if (!fs.existsSync('./dist/scrapings')) {
            fs.mkdirSync('./dist/scrapings');
        }
        if (!fs.existsSync('./dist/json')) {
            fs.mkdirSync('./dist/json');
        }
    }

    private static scrape() {
        fs.readFile('dist/scrapings/mangafox.html', 'utf-8', (err: ErrnoException, data: Buffer) => {
            if (err) {
                throw err;
            }
            const $ = cheerio.load(data.toString());
            const index: any = {};
            const alphabet =
                ['#', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

            for (const letter of alphabet) {
                const content = $(`#idx_\\${letter}`);

                index[letter] = content.text().replace(/\t+/g, '').trim().slice(1).split('\n');
            }

            fs.writeFileSync('dist/json/mangafox.json', JSON.stringify(index));
        });
    }

    private download = () => {
        const file = fs.createWriteStream('dist/scrapings/mangafox.html');

        return new Promise((resolve) => {
            http.get('http://mangafox.me/manga', (response) => {
                const body: any[] = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => {
                    resolve(body.join(''));
                });
            });
        }).then((html: any) => {
            file.write(html);
            App.scrape();
        });
    };

    public render() {
        return (
            <div>
                <input type="button" value="Download" onClick={this.download}/>
            </div>
        );
    }
}
