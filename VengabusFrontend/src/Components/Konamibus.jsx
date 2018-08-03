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
        const fixedPosition = css`
            position: fixed;
        `;
        const heightChanger = css`
            --final-height: 180px;
            @keyframes Height-Change {
                0% {
                    height: 0px;
                }
                10% {
                    height: var(--final-height);
                }
                90% {
                    height: var(--final-height);
                }
                100% {
                    height: 0px;
                }
            }
        transform-style: preserve-3d;
        animation: Height-Change ${this.animationLength}ms linear;
        `;
        const busPeek = css`
            @keyframes Bus-Peek {
                0% {
                    transform: translateX(calc(-50% - 250px)) rotateY(0deg);
                }
                20% {
                    transform: translateX(calc(-50% - 250px)) rotateY(0deg);
                }
                40% {
                    transform: translateX(calc(-50% + 50px)) rotateY(0deg);
                }
                60% {
                    transform: translateX(calc(-50% + 50px)) rotateY(0deg);
                }
                70% {
                    transform: translateX(calc(-50% + 50px)) rotateY(-180deg);
                }
                80% {
                    transform: translateX(calc(-50% - 250px)) rotateY(-180deg);
                }
                100% {
                    transform: translateX(calc(-50% - 250px)) rotateY(-180deg);
                    visibility: hidden; /* Prevents the bus from flashing when the animation ends */
                }
            }
            transform-style: preserve-3d;
            animation: Bus-Peek ${this.animationLength}ms linear;
        `;
        if (this.state.vengabus) {
            return (
                <span className={containerStyle}>
                    <div className={fixedPosition}>
                        <div className={busPeek}>
                            <img src={bus} className="Vengabus" alt="Vengabus" />
                        </div>
                    </div>
                    <div className={heightChanger} />
                </span>
            );
        } else {
            return null;
        }
    }
}
