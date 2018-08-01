import React, { Component } from 'react';
import KonamiCode from 'konami-code-js';
import { css } from 'react-emotion';
import bus from './vengabus.png';

export class Konamibus extends Component {
    constructor() {
        super();
        this.state = {
            vengabus: false,
            vengaVideo: false
        };
        this.animationLength = 10000; //milliseconds
        new KonamiCode(() => {
            this.setState({
                vengabus: true
            });
            setTimeout(() => {
                this.setState({
                    vengabus: false
                });
            }, this.animationLength);
        });
    }
    render() {
        const containerStyle = css`
            perspective: 1000px;
        `;
        const busPeek = css`
            --final-height: 180px;
            @keyframes Bus-Peek {
                0% {
                    transform: translateX(calc(-50% - 250px)) rotateY(0deg);
                    height: 0px;
                }
                10% {
                    transform: translateX(calc(-50% - 250px)) rotateY(0deg);
                    height: var(--final-height);
                }
                20% {
                    transform: translateX(calc(-50% - 250px)) rotateY(0deg);
                    height: var(--final-height);
                }
                40% {
                    transform: translateX(calc(-50% + 50px)) rotateY(0deg);
                    height: var(--final-height);
                }
                60% {
                    transform: translateX(calc(-50% + 50px)) rotateY(0deg);
                    height: var(--final-height);
                }
                70% {
                    transform: translateX(calc(-50% + 50px)) rotateY(-180deg);
                    height: var(--final-height);
                }
                80% {
                    transform: translateX(calc(-50% - 250px)) rotateY(-180deg);
                    height: var(--final-height);
                }
                90% {
                    transform: translateX(calc(-50% - 250px)) rotateY(-180deg);
                    height: var(--final-height);
                }
                100% {
                    transform: translateX(calc(-50% - 250px)) rotateY(-180deg);
                    height: 0px;
                }
            }
        transform-style: preserve-3d;
        animation: Bus-Peek ${this.animationLength}ms linear;
        `;
        if (this.state.vengabus) {
            return (
                <div className={containerStyle}>
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
