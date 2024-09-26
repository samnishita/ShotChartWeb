import { useState, useEffect } from "react";

export function useScreenDimensions() {
    const [screenDimensions, setScreenDimensions] = useState(
        getScreenDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setScreenDimensions(getScreenDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenDimensions;
}

const getScreenDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width, height
    };
}

export function useScreenWidth() {
    const [screenWidth, setScreenWidth] = useState(
        getScreenWidth()
    );

    useEffect(() => {
        function handleResize() {
            setScreenWidth(getScreenWidth());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenWidth;
}

const getScreenWidth = () => {
    return window.innerWidth;
}
