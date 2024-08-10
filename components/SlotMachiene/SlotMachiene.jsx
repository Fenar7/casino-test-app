"use client";

import { useEffect, useRef } from 'react';
import styles from './AnimatedText.module.css';

const AnimatedText = () => {
    const canvasRef = useRef(null);
    let animationStarted = false;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const fetchServerTime = async () => {
            try {
                const response = await fetch('/api/getTime',{
                    method: 'POST',
                });
                if (response.ok) {
                    const data = await response.json();
                    return new Date(data.serverTime);
                }
                throw new Error('Failed to fetch server time');
            } catch (error) {
                console.error(error);
                // return new Date(); // Fallback to client time
            }
        };

        const resizeCanvas = (scaleFactor = 2) => {
            canvas.width = canvas.clientWidth * scaleFactor;
            canvas.height = canvas.clientHeight * scaleFactor;
            ctx.scale(scaleFactor, scaleFactor); // Scale down the canvas display size
        };

        const drawRedBarAndText = (text) => {
            resizeCanvas(2); // Ensure the canvas is correctly sized
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000'; // Red color for the bar
        
            // Adjust the bar's height proportionally to the canvas height
            const barHeight = Math.min(100, canvas.height * 0.1);
            ctx.fillRect(0, (canvas.height / 2 / 2 - barHeight / 2), canvas.width / 2, barHeight);
        
            ctx.fillStyle = '#fff'; // Color for the number or message
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
        
            // Adjust the font size proportionally to the canvas size
            const fontSize = Math.min(50, canvas.height * 0.1 / 2);
            ctx.font = `80px Helvetica`;
        
            // Calculate the width of a single character
            const charWidth = ctx.measureText('0').width;
        
            // Set column spacing, adjust this value to change spacing between characters
            const columnSpacing = charWidth * 0.2; // Adjust this value for spacing between characters
        
            // Draw each character separately with the specified spacing
            let xPosition = (canvas.width / 2 / 2) - ((charWidth + columnSpacing) * (text.length - 1)) / 2;
        
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], xPosition, canvas.height / 2 / 2);
                xPosition += charWidth + columnSpacing; // Move to the next character's position
            }
        };
        

        const startAnimation = (text) => {
            const chars = '1234567890'.split('');
            const scale = 100; // Base scale for the characters
            const rectangleHeight = 180; // Adjust this value to change the height of the rectangle
            const breaks = 0.003;
            const endSpeed = 0.05;
            const firstLetter = 220;
            const delay = 40;
        
            const spacingMultiplier = 1.1; // Adjust this value to increase or decrease spacing between characters
            const verticalSpacingMultiplier = 1.7; // Adjust this value to increase or decrease vertical spacing
        
            text = text.split('');
            const charMap = [];
            const offset = [];
            const offsetV = [];
        
            // Map each character to its index in the chars array
            for (let i = 0; i < chars.length; i++) {
                charMap[chars[i]] = i;
            }
        
            // Initialize offsets and velocities for the animation
            for (let i = 0; i < text.length; i++) {
                const f = firstLetter + delay * i;
                offsetV[i] = endSpeed + breaks * f;
                offset[i] = -(1 + f) * (breaks * f + 2 * endSpeed) / 2;
            }
        
            // Resize the canvas to improve resolution
            resizeCanvas(2);
        
            const loop = () => {
                // Reset canvas transformations and clear it
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
        
                // Draw a black rectangle as the background for the animation
                ctx.fillStyle = '#000';
                ctx.fillRect(0, (canvas.height - rectangleHeight) / 2, canvas.width, rectangleHeight);
        
                for (let i = 0; i < text.length; i++) {
                    ctx.fillStyle = '#fff';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
        
                    // Adjust character position by multiplying scale with spacingMultiplier
                    const xPosition = Math.floor((canvas.width - (scale * spacingMultiplier) * (text.length - 1)) / 2) + (scale * spacingMultiplier) * i;
                    ctx.setTransform(1, 0, 0, 1, xPosition, Math.floor(canvas.height / 2));
        
                    let o = offset[i];
                    while (o < 0) o++;
                    o %= 1;
        
                    const h = Math.ceil(canvas.height / 2 / scale);
                    for (let j = -h; j < h; j++) {
                        let c = charMap[text[i]] + j - Math.floor(offset[i]);
                        while (c < 0) c += chars.length;
                        c %= chars.length;
        
                        const s = 1 - Math.abs(j + o) / (canvas.height / 2 / scale + 1);
                        ctx.globalAlpha = s;
                        ctx.font = `${(scale * s) + 60}px Helvetica`;
        
                        // Adjust the vertical position by multiplying scale with verticalSpacingMultiplier
                        ctx.fillText(chars[c], 0, (j + o) * scale * verticalSpacingMultiplier); 
                    }
        
                    offset[i] += offsetV[i];
                    offsetV[i] -= breaks;
                    if (offsetV[i] < endSpeed) {
                        offset[i] = 0;
                        offsetV[i] = 0;
                    }
                }
        
                requestAnimationFrame(loop);
            };
        
            requestAnimationFrame(loop);
        };
        
        
        

        const displayStaticNumber = async (url, fallbackText) => {
            try {
                const apiResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    console.log('API Data:', data); // Log the API response
                    const text = data.timeNumber;
                    drawRedBarAndText(text);
                } else {
                    console.error('Failed to fetch data from the API');
                    drawRedBarAndText(fallbackText); // Display fallback if API fails
                }
            } catch (error) {
                console.error('Error fetching data from API:', error);
                drawRedBarAndText(fallbackText); // Display fallback on error
            }
        };

        const checkTimeAndDisplay = async() => {
            const currentDateTime = await fetchServerTime();
            const hours = currentDateTime.getHours();
            const minutes = currentDateTime.getMinutes();
            const isExactHour = minutes === 0;

            console.log('Local DateTime:', currentDateTime);

            if (hours === 12 && isExactHour && !animationStarted) {
                startAnimationWithAPI('/api/getNum1');
            } else if (hours === 15 && isExactHour  && !animationStarted) {
                startAnimationWithAPI('/api/getNum2');
            } else if (hours === 17 && isExactHour  && isExactHour && !animationStarted) {
                startAnimationWithAPI('/api/getNum3');
            } else if (hours === 19 && isExactHour   && !animationStarted) {
                startAnimationWithAPI('/api/getNum4');
            } else {
                if (hours >= 12 && hours < 15) {
                    displayStaticNumber('/api/getNum1', 'Static 1');
                } else if (hours >= 15 && hours < 17) {
                    displayStaticNumber('/api/getNum2', 'Static 2');
                } else if (hours >= 17 && hours < 19) {
                    displayStaticNumber('/api/getNum3', 'Static 3');
                } else if (hours >= 19 && hours < 24) {
                    displayStaticNumber('/api/getNum4', 'Static 4');
                } else {
                    drawRedBarAndText('0000');
                }
            }
        };

        const startAnimationWithAPI = async (url) => {
            try {
                const apiResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    console.log('Animation API Data:', data); // Log animation data
                    startAnimation(data.timeNumber.toString()); // Adjust based on the API response
                    animationStarted = true;
                } else {
                    console.error('Failed to fetch data from the API');
                }
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };

        const checkForExactHourAndReload = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            if (minutes === 0 && seconds === 0) {
                window.location.reload();
            }
        };

        // Check every second if the exact hour has been reached
        const intervalId = setInterval(checkForExactHourAndReload, 1000);

        checkTimeAndDisplay();

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas}></canvas>;
};

export default AnimatedText;
