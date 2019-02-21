import { useState, useEffect, useRef } from "react";

export default function useSticky(stickee) {
    const stickerRef = useRef();

    const [style, setStyle] = useState({});

    const styleTop = {
        position: "sticky",
        top: "0"
    };

    const styleBottom = {
        position: "sticky",
        bottom: "0"
    };

    useEffect(() => {
        const sticker = stickerRef.current;
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const { top, bottom } = entry.boundingClientRect;
                    const parentHeight = stickee.current.clientHeight;

                    if (!entry.isIntersecting) {
                        if (top <= parentHeight) {
                            setStyle(styleTop);
                        } else if (bottom >= parentHeight) {
                            setStyle(styleBottom);
                        }
                    }
                });
            },
            {
                root: stickee.current,
                threshold: 1.0
            }
        );

        if (sticker) observer.observe(sticker);

        return () => {
            observer.disconnect();
            if (sticker) sticker.style.position = "";
        };
    }, [stickerRef.current]);

    function setRowRef(ref) {
        stickerRef.current = ref;
    }

    function unSetRowRef(scrollIntoView) {
        if (scrollIntoView === true) {
            stickerRef.current.scrollIntoView();
        }
        stickerRef.current = null;
    }

    return [setRowRef, unSetRowRef, style];
}
