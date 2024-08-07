import { Button, Flex, Box } from '@chakra-ui/react';
import { WalletInfoRemote } from '@tonconnect/sdk';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { connector } from '../../api/connector/connector';
import { createPortal } from 'react-dom';
// eslint-disable-next-line import/no-unresolved
import { tonProofApi } from '../../ton-proof-api';

export function ModalQRCode({
    isOpen,
    onClose,
    wallet,
}: {
    isOpen: boolean;
    onClose: () => void;
    wallet: WalletInfoRemote | null;
}) {
    const [connectedWallet, setConnectedWallet] = useState('');
    useEffect(() => {
        (async()=>{
            const tonProof = await tonProofApi.generatePayload();

            if (wallet) {
                setConnectedWallet(connector.connect({ bridgeUrl: wallet.bridgeUrl, universalLink: wallet.universalLink }, tonProof) );
            }    
        })()
    }, [wallet]);

    return (
        <>
            {isOpen
                ? createPortal(
                      <Flex
                          width={'100%'}
                          height={'100vh'}
                          flexDirection={'column'}
                          gap={'10px'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          zIndex={99999}
                          position={'fixed'}
                          top={0}
                          left={0}
                          backdropFilter="blur(10px) hue-rotate(90deg)"
                          onClick={onClose}
                      >
                          <Box padding={window.innerWidth < 400 ? '10px' : '25px'} bg="white" borderRadius={'10px'}>
                              <QRCode
                                  size={window.innerWidth < 400 ? 200 : 320}
                                  value={connectedWallet}
                                  onClick={(ev) => ev.stopPropagation()}
                              />
                          </Box>
                          <Button
                              width={window.innerWidth < 400 ? 220 : 370}
                              onClick={(ev) => {
                                  ev.stopPropagation();
                                  window.open(connectedWallet);
                              }}
                          >
                              Open {wallet?.appName}
                          </Button>
                      </Flex>,
                      document.body,
                  )
                : ''}
        </>
    );
}
