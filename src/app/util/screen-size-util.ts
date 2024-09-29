import { useState, useEffect } from "react";

export const useScreenDimensions = () => {
    const [screenDimensions, setScreenDimensions] = useState(
        getScreenDimensions()
    );

    useEffect(() => {
        const handleResize = () => {
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

export const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState(
        getScreenWidth()
    );

    useEffect(() => {
        const handleResize = () => {
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
