"use client";

import { useEffect, useRef } from 'react';
import styles from './AnimatedText.module.css';

const AnimatedText = () => {
    const canvasRef = useRef(null);
    let animationStarted = false;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            const scaleFactor = 2; // Increase resolution
            canvas.width = canvas.clientWidth * scaleFactor;
            canvas.height = canvas.clientHeight * scaleFactor;
            ctx.scale(scaleFactor, scaleFactor); // Scale down the canvas display size
        };

        const drawRedBarAndText = (text) => {
            resizeCanvas(); // Ensure the canvas is correctly sized
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#622'; // Red color for the bar

            // Adjust the bar's height proportionally to the canvas height
            const barHeight = Math.min(50, canvas.height * 0.1);
            ctx.fillRect(0, (canvas.height / 2 / 2 - barHeight / 2), canvas.width / 2, barHeight);

            ctx.fillStyle = '#ccc'; // Color for the number or message
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            // Adjust the font size proportionally to the canvas size
            const fontSize = Math.min(50, canvas.height * 0.1 / 2);
            ctx.font = `${fontSize}px Helvetica`;

            // Calculate the width of a single character and the width of the central number
            const charWidth = ctx.measureText('0').width;
            const mainNumberWidth = ctx.measureText(text).width;

            // Calculate the spacing between columns
            const columnSpacing = charWidth * 0.08; // Adjust as needed for alignment
            const totalWidth = 3 * charWidth + 3 * columnSpacing;
            const startX = (canvas.width / 2 - totalWidth) / 2;

            // Draw the main static number in the center
            ctx.fillText(text, canvas.width / 2 / 2, canvas.height / 2 / 2);

            // Draw random numbers in columns around the center number
            const chars = '1234567890'.split('');
            const randomOffset = Math.ceil(canvas.height / 2 / fontSize / 2);

            for (let i = -randomOffset; i <= randomOffset; i++) {
                if (i === 0) continue; // Skip the center number

                // Generate random numbers for each column
                const randomChars = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]);

                ctx.globalAlpha = 1 - Math.abs(i) / (randomOffset + 1); // Gradual fade-out effect

                // Draw each column of random numbers
                for (let j = 0; j < 4; j++) {
                    ctx.fillText(randomChars[j], startX + j * (charWidth + columnSpacing), canvas.height / 2 / 2 + i * fontSize);
                }
            }
        };

        const startAnimation = (text) => {
            const chars = '1234567890'.split('');
            const scale = 100;
            const breaks = 0.003;
            const endSpeed = 0.05;
            const firstLetter = 220;
            const delay = 40;

            text = text.split('');
            const charMap = [];
            const offset = [];
            const offsetV = [];

            for (let i = 0; i < chars.length; i++) {
                charMap[chars[i]] = i;
            }

            for (let i = 0; i < text.length; i++) {
                const f = firstLetter + delay * i;
                offsetV[i] = endSpeed + breaks * f;
                offset[i] = -(1 + f) * (breaks * f + 2 * endSpeed) / 2;
            }

            resizeCanvas();

            const loop = () => {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#622';
                ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale);

                for (let i = 0; i < text.length; i++) {
                    ctx.fillStyle = '#ccc';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.setTransform(1, 0, 0, 1, Math.floor((canvas.width - scale * (text.length - 1)) / 2), Math.floor(canvas.height / 2));

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
                        ctx.font = `${scale * s}px Helvetica`;
                        ctx.fillText(chars[c], scale * i, (j + o) * scale);
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

        const checkTimeAndDisplay = async () => {
            try {
                const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
                if (!response.ok) {
                    throw new Error('Failed to fetch time from World Time API');
                }
                const timeData = await response.json();
                const currentDateTime = new Date(timeData.datetime);
                const hours = currentDateTime.getHours();
                const minutes = currentDateTime.getMinutes();
                const isExactHour = minutes === 0;

                console.log('World Time API DateTime:', currentDateTime);

                if (hours === 12 && isExactHour && !animationStarted) {
                    await startAnimationWithAPI('/api/getNum1');
                } else if (hours === 14 && isExactHour && !animationStarted) {
                    await startAnimationWithAPI('/api/getNum2');
                } else if (hours === 17 && isExactHour && !animationStarted) {
                    await startAnimationWithAPI('/api/getNum3');
                } else if (hours === 19 && isExactHour && !animationStarted) {
                    await startAnimationWithAPI('/api/getNum4');
                } else {
                    if (hours >= 12 && hours < 14) {
                        displayStaticNumber('/api/getNum1', 'Static 1');
                    } else if (hours >= 14 && hours < 17) {
                        displayStaticNumber('/api/getNum2', 'Static 2');
                    } else if (hours >= 17 && hours < 19) {
                        displayStaticNumber('/api/getNum3', 'Static 3');
                    } else if (hours >= 19 && hours < 24) {
                        displayStaticNumber('/api/getNum4', 'Static 4');
                    } else {
                        drawRedBarAndText('0000');
                    }
                }
            } catch (error) {
                console.error('Error fetching time from World Time API:', error);
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
