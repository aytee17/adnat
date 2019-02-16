import { useState, useRef, useEffect } from "react";

function useClickOutside(initial) {
    const [open, setOpen] = useState(initial);
    const ref = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        // only if ref has been assigned to
        if (ref.current) {
            const clickedNode = event.target;
            if (!ref.current.contains(clickedNode)) {
                close();
            }
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
