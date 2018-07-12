import React, { Component } from 'react';

export class BootstrapCssLinks extends Component {
    render() {
        return (
            /*
                See installation notes for React-Boostrap: https://react-bootstrap.github.io/getting-started/introduction/#install
                The CSS must be included separately. Fetch it from a CDN for ease.

                This component should be near the top of the page.
            */
            <div>
                <link
                    comment="Provides the Latest compiled and minified bootstrap CSS"
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                    integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                    crossOrigin="anonymous"
                />
                <link
                    comment="Provides the Latest compiled and minified bootstrap CSS Theme"
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
                    integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
                    crossOrigin="anonymous"
                />
            </div>
        );
    }
}
