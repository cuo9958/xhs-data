import React from 'react';

export default class extends React.Component {
    render() {
        return (
            <div id="login">
                <div className="mask">{this.props.children}</div>
            </div>
        );
    }
}
