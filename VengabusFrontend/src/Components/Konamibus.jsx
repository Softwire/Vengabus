import React, { Component } from 'react';
import KonamiCode from 'konami-code-js';
import { css } from 'react-emotion';
import bus from './vengabus.png'; //From https://pixabay.com/en/graphic-bus-school-school-bus-3345449/

export class Konamibus extends Component {
    constructor() {
        super();

        this.state = {
            vengabus: false,
            vengaVideo: false
        };

        this.animationDurationSeconds = 10;
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
        const containerStyle = css`
            perspective: 1000px;
        `;
        const fixedPosition = css`
            position: fixed;
        `;

        const offScreen = 'translateX(calc(-50% - 250px))';
        const onScreen = 'translateX(calc(-50% + 50px))';
        const facingRight = 'rotateY(0deg)';
        const facingLeft = 'rotateY(180deg)';

        //Lowers the sidebar so the bus can peek past.
        //Needs to be done on a separate component because the bus component needs to have position:fixed so
        //that it doesn't scroll with the page, but this means that changing it's height will not move other
        //components out of the way.
        const heightChanger = css`
            --final-height: 180px;
            @keyframes Height-Change {
                0% {
                    height: 0px;
                    animation-timing-function: cubic-bezier(0.5, -0.3, 0.5, 1.3);
                }
                10%, 90% {
                    height: var(--final-height);
                    animation-timing-function: cubic-bezier(0.5, -0.3, 0.5, 1.3);
                }
                100% {
                    height: 0px;
                }
            }
        transform-style: preserve-3d;
        animation: Height-Change ${this.animationDurationSeconds}s linear;
        `;
        const busPeek = css`
            @keyframes Bus-Peek {
                0%, 20% {
                    transform: ${offScreen} ${facingRight};
                }
                40%, 60% {
                    transform: ${onScreen} ${facingRight};
                }
                70% {
                    transform: ${onScreen} ${facingLeft};
                }
                80% {
                    transform: ${offScreen} ${facingLeft};
                }
                100% {
                    transform: ${offScreen} ${facingLeft};
                    visibility: hidden; /* Prevents the bus from flashing when the animation ends */
                }
            }
            transform-style: preserve-3d;
            animation: Bus-Peek ${this.animationDurationSeconds}s linear;
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
