import { useState, useRef, useEffect } from "react";

function useClickOutside() {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        const clickedNode = event.target;
        if (!ref.current.contains(clickedNode)) {
            close();
        }
    }

    function close() {
        setOpen(false);
    }

    function toggle() {
        setOpen(!open);
    }

    return [ref, open, toggle];
}

export default useClickOutside;
