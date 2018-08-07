import React, { Component } from 'react';
import KonamiCode from 'konami-code-js';
import { css } from 'react-emotion';
import bus from './vengabus.png'; //Released for free under the Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication license from https://pixabay.com/en/graphic-bus-school-school-bus-3345449/

export class Konamibus extends Component {
    constructor() {
        super();

        this.state = {
            vengabus: false,
            vengaVideo: false
        };

        this.animationDurationSeconds = 12;
        new KonamiCode(() => {
            this.setState({
                vengabus: true
            });
            setTimeout(() => {
                this.setState({
                    vengabus: false
                });
            }, this.animationDurationSeconds * 1000);
        });
    }
    render() {
        const fixedPosition = css`
            position: fixed;
            perspective: 1000px;
        `;

        const offScreen = 'translateX(calc(-50% - 260px))';
        const onScreen = 'translateX(calc(-50% + 75px))';
        const halfOnScreen = 'translateX(calc(-50% - 125px))';
        const facingRight = 'rotateY(0deg)';
        const facingAway = 'rotateY(150deg)';
        const facingLeft = 'rotateY(180deg)';

        //Lowers the sidebar so the bus can peek past.
        //Needs to be done on a separate component because the bus component needs to have position:fixed so
        //that it doesn't scroll with the page, but this means that changing it's height will not move other
        //components out of the way.
        const heightChanger = css`
            @keyframes Height-Change {
                0% {
                    height: 0px;
                    animation-timing-function: cubic-bezier(0.5, -0.3, 0.5, 1.3);
                }
                10%, 90% {
                    height: 180px;
                    animation-timing-function: cubic-bezier(0.5, -0.3, 0.5, 1.3);
                }
                100% {
                    height: 0px;
                }
            }
        transform-style: preserve-3d;
        animation: Height-Change ${this.animationDurationSeconds}s linear;
        `;
        const busPositionX = css`
            @keyframes Bus-Position-X {
                0%, 20% {
                    transform: ${offScreen};
                    animation-timing-function: cubic-bezier(0.5, -0.3, 0.5, 1.3);
                }
                40%, 55% {
                    transform: ${halfOnScreen};
                    animation-timing-function: cubic-bezier(.45,.18,.52,.51);
                }
                60% {
                    transform: ${onScreen};
                    animation-timing-function: ease-out
                }
                70% {
                    transform: translateX(calc(-50% + 450px));
                    animation-timing-function: cubic-bezier(0.470, 0.000, 0.745, 0.715); /* easeInSine */
                }
                80% {
                    transform: ${offScreen};
                }
                100% {
                    transform: ${offScreen};
                }
            }
            transform-style: preserve-3d;
            animation: Bus-Position-X ${this.animationDurationSeconds}s linear;
        `;

        const busPositionZ = css`
            @keyframes Bus-Position-Z {
                0%, 60% {
                    transform: translateZ(0px);
                    animation-timing-function: cubic-bezier(0.470, 0.000, 0.745, 0.715); /* easeInSine */
                }
                70% {
                    transform: translateZ(-100px);
                    animation-timing-function: cubic-bezier(0.390, 0.575, 0.565, 1.000); /* easeOutSine */
                }
                80%, 100% {
                    transform:  translateZ(-150px);
                }
            }
            transform-style: preserve-3d;
            animation: Bus-Position-Z ${this.animationDurationSeconds}s linear;
        `;
        const busRotation = css`
            @keyframes Bus-Rotation {
                0%, 55% {
                    transform: ${facingRight};
                }
                60% {
                    transform: ${facingRight};
                }
                70% {
                    transform: ${facingAway};
                }
                80%, 100% {
                    transform: ${facingLeft};
                }
            }
            transform-style: preserve-3d;
            animation: Bus-Rotation ${this.animationDurationSeconds}s linear;
        `;
        if (this.state.vengabus) {
            return (
                <span>
                    <div className={fixedPosition}>
                        <div className={busPositionX}>
                            <div className={busPositionZ}>
                                <div className={busRotation}>
                                    <img src={bus} className="Vengabus" alt="Vengabus" />
                                </div>
                            </div>
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
