import { useState } from 'react';

export function useToggle(state: boolean = false): { isOpen: boolean; close: () => void; open: () => void } {
    const [isOpen, setOpen] = useState(state);
    const close = () => setOpen(false);
    const open = () => setOpen(true);
    return { isOpen, close, open };
}
