import React, { Component } from 'react';
import KonamiCode from 'konami-code-js';
import { css } from 'react-emotion';
import bus from './vengabus.png';

export class Vengabus extends Component {
    constructor() {
        super();
        this.state = {
            vengabus: false,
            vengaVideo: false
        };
        new KonamiCode(() => {
            this.setState({
                vengabus: true
            });
            setTimeout(() => {
                this.setState({
                    vengaVideo: true
                });
            }, 10000);
            setTimeout(() => {
                this.setState({
                    vengabus: false,
                    vengaVideo: false
                });
            }, 234000);
        });
    }
    render() {
        const busPeek = css`
            @keyframes Bus-Peek {
                0% {
                    transform: translateX(-60%);
                }
                4% {
                    transform: translateX(-45%);
                }
                96% {
                    transform: translateX(-45%);
                }
                100% {
                    transform: translateX(-60%);
                }
            }
            animation: Bus-Peek 234s linear;
        `;
        const backgroundVideoStyle = css`
            position: fixed;
            z-index: -99;
            width: 100%;
            height: 100%;
        `;

        const vengaVideo = (
            <div className={backgroundVideoStyle}>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/6Zbi0XmGtMw?autoplay=1"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullscreen
                />
            </div>);
        if (this.state.vengabus) {
            return (
                <div>
                    {this.state.vengaVideo ? vengaVideo : ""}
                    <div className={busPeek}>
                        <img src={bus} className="Vengabus" alt="Vengabus" />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}
