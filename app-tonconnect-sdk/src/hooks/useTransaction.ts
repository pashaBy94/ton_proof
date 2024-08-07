import { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { connector } from '../api/connector/connector';
import { UserRejectsError } from '@tonconnect/sdk';
import { useToast } from '@chakra-ui/react';

export function useTransaction() {
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const toast = useToast();
    async function sendTransaction() {
        setIsConfirm(true);
        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: '0:' + '0'.repeat(64),
                    amount: '100000000',
                },
                {
                    address: '0:' + '0'.repeat(64),
                    amount: '200000000',
                },
            ],
        };
        try {
            await connector.sendTransaction(tx);
            toast({
                title: 'Transaction is success.',
                description: 'User confirmed this transaction.',
                status: 'success',
                duration: 6000,
                isClosable: true,
            });
        } catch (error) {
            if (error instanceof UserRejectsError) {
                console.log('User refused to get this transaction');
            } else {
                console.log('Diferent transaction');
            }
            toast({
                title: 'Transaction is fail.',
                description: 'There are some error.',
                status: 'error',
                duration: 6000,
                isClosable: true,
            });
        } finally {
            setIsConfirm(false);
        }
    }
    return { sendTransaction, isConfirm };
}
