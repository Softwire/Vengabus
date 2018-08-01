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
            @keyframes Bus-Peek {
                0% {
                    transform: translateX(calc(-50% - 200px)) rotateY(0deg);
                    height: 0px;
                }
                10% {
                    transform: translateX(calc(-50% - 200px)) rotateY(0deg);
                    height: 224px;
                }
                20% {
                    transform: translateX(calc(-50% - 200px)) rotateY(0deg);
                    height: 224px;
                }
                40% {
                    transform: translateX(calc(-50% + 100px)) rotateY(0deg);
                    height: 224px;
                }
                60% {
                    transform: translateX(calc(-50% + 100px)) rotateY(0deg);
                    height: 224px;
                }
                70% {
                    transform: translateX(calc(-50% + 100px)) rotateY(-180deg);
                    height: 224px;
                }
                80% {
                    transform: translateX(calc(-50% - 200px)) rotateY(-180deg);
                    height: 224px;
                }
                90% {
                    transform: translateX(calc(-50% - 200px)) rotateY(-180deg);
                    height: 224px;
                }
                100% {
                    transform: translateX(calc(-50% - 200px)) rotateY(-180deg);
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
