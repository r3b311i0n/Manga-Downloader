import * as fs from 'fs';
import * as React from 'react';
import {download} from './download';

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

    private syncDb = async () => {
        await download();
    };

    public render() {
        return (
            <div>
                <input type="button" value="Sync" onClick={this.syncDb}/>
            </div>
        );
    }
}
