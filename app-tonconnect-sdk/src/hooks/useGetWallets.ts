import { WalletInfo } from '@tonconnect/sdk';
import { useEffect, useState } from 'react';
import { connector } from '../api/connector/connector';

export function useGetWallets(): WalletInfo[] | null {
    const [wallets, setWallets] = useState<WalletInfo[] | null>(null);

    useEffect(() => {
        connector.getWallets().then(setWallets);
    }, []);
    return wallets;
}
