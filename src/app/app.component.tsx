import * as fs from 'fs';
import * as React from 'react';
import {Download} from './download';

export default class App extends React.Component<{}, void> {
    constructor(props: any) {
        super(props);

        if (!fs.existsSync('./dist/scrapings')) {
            fs.mkdirSync('./dist/scrapings');
        }
        if (!fs.existsSync('./dist/json')) {
            fs.mkdirSync('./dist/json');
        }
        if (!fs.existsSync('./dist/library')) {
            fs.mkdirSync('./dist/library');
        }
    }

    private handleSyncBtnClick = async () => {
        const sync = new Download(true, 'http://mangafox.me/manga');
        await sync.fetch();
    };

    public render() {
        return (
            <div>
                <input type="button" value="Sync" onClick={this.handleSyncBtnClick}/>
            </div>
        );
    }
}
