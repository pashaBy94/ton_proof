import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { isRestored } from '../api/connector/connector';

export function useTonConnectonRestored(): boolean {
    const [isConnectionRestored, setisConnectionRestored] = useState<boolean>(false);
    useEffect(() => {
        isRestored.then(() => setisConnectionRestored(true));
    }, []);
    return isConnectionRestored;
}
