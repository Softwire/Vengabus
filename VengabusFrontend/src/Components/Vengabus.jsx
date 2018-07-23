import React, { Component } from 'react';
import KonamiCode from 'konami-code-js';

export class Vengabus extends Component {
    constructor() {
        super();
        this.state = {
            vengabus: false
        };
        new KonamiCode(() => {
            this.setState({
                vengabus: true
            });
        });
    }
    render() {
        const vengabus = (
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/6Zbi0XmGtMw?autoplay=1"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullscreen
            />);
        return (
            <div className="App">
                {this.state.vengabus ? vengabus : ""}
            </div>
        );
    }
}
