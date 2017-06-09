import * as cheerio from 'cheerio';
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import * as http from 'http';

// todo: Optimise downloads.

class Download {
    constructor(shouldScrape: boolean, url: string, name?: string) {
        this.name = name;
        this.shouldScrape = shouldScrape;
        this.url = url;
    }

    private name: string;
    private shouldScrape: boolean;
    private url: string;

    public fetch(): Promise<void> {
        let file: fs.WriteStream;

        (this.shouldScrape) ?
            file = fs.createWriteStream('dist/scrapings/mangafox.html') :
            file = fs.createWriteStream(`dist/library/${this.name}`);

        return new Promise((resolve, reject) => {
            http.get(this.url, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Download failed: ' + response.statusCode));
                }

                const body: any[] = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => {
                    resolve(body.join(''));
                });
            });
        }).then((data: string) => {
            file.write(data);
            if (this.shouldScrape) {
                scrape();
            }
        });
    }
}

function scrape(): void {
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

export {Download};
