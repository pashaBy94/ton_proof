import { Flex } from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useGetWallets } from '../../hooks/useGetWallets';
import { isWalletInfoRemote } from '@tonconnect/sdk';
// eslint-disable-next-line import/no-unresolved
import { connector } from '../../api/connector/connector';


export function UniqQRCode(isOpen:{isOpen: boolean}) {
    const wallets = useGetWallets();
    const [remoteDeepLink, setRemoteDeepLink] = useState<string | undefined>()    

    useEffect(()=>{
        const remoteList = wallets?.filter(isWalletInfoRemote).map(el=>({bridgeUrl: el.bridgeUrl}));
        if(isOpen && remoteList?.length) setRemoteDeepLink(connector.connect(remoteList))
        
    },[wallets, isOpen])
    return (<>
        {remoteDeepLink && <Flex alignItems={'center'} justifyContent={'center'} marginBottom={'8px'} borderRadius={'2px'}><QRCode size={220} value={remoteDeepLink} /></Flex>
    }
    </>
    )
        
   
}
