import * as React from 'react';

export default class App extends React.Component<{}, void> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <input type="text"/>
            </div>
        );
    }
}
