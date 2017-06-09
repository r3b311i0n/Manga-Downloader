import * as cheerio from 'cheerio';
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import * as http from 'http';

function download() {
    const file = fs.createWriteStream('dist/scrapings/mangafox.html');

    return new Promise((resolve, reject) => {
        http.get('http://mangafox.me/manga', (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Download failed: ' + response.statusCode));
            }

            const body: any[] = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => {
                resolve(body.join(''));
            });
        });
    }).then((html: any) => {
        file.write(html);
        scrape();
    });
}

function scrape() {
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

export {download};
