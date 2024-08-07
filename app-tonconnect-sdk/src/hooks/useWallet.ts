import { CHAIN, toUserFriendlyAddress, Wallet } from '@tonconnect/sdk';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { connector } from '../api/connector/connector';

export function useWallet(): { wallet: Wallet | null; fryndlyAddress: string } {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [fryndlyAddress, setFryndlyAddress] = useState('');

    // console.log(wallet);

    useEffect(() => {
        return connector.onStatusChange((wallet) => {
            setWallet(wallet);
            setFryndlyAddress(
                toUserFriendlyAddress(wallet?.account.address || '', wallet?.account.chain === CHAIN.TESTNET),
            );
        });
    }, []);
    return { wallet, fryndlyAddress };
}
