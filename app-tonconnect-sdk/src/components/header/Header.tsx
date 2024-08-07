import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, useColorMode } from '@chakra-ui/react';
import st from './Header.module.css';
import { CheckIcon, LinkIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
// eslint-disable-next-line import/no-unresolved
import { useWallet } from '../../hooks/useWallet';
// eslint-disable-next-line import/no-unresolved
import { connector } from '../../api/connector/connector';
// eslint-disable-next-line import/no-unresolved
import { ModalConnect } from '../modal/Modal';
// eslint-disable-next-line import/no-unresolved
import { useToggle } from '../../hooks/useToggle';
import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useGetWallets } from '../../hooks/useGetWallets';
import { isWalletInfoCurrentlyEmbedded } from '@tonconnect/sdk';
// eslint-disable-next-line import/no-unresolved
import { tonProofApi } from '../../ton-proof-api';
// eslint-disable-next-line import/no-unresolved

export function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { wallet, fryndlyAddress } = useWallet();
    const { isOpen, close, open } = useToggle(false);
    const [isCopy, setCopy] = useState(false);
    useEffect(() => setCopy(false), []);
    const wallets = useGetWallets();
    const embedded = useMemo(() => wallets && wallets.find(isWalletInfoCurrentlyEmbedded), [wallets]);
    const onClickOpen = async () => {
        const tonProof = await tonProofApi.generatePayload();
        if (embedded) {
            connector.connect({ jsBridgeKey: embedded.jsBridgeKey },tonProof);
        }
        open();
    };
    return (
        <header className={st.head}>
            <LinkIcon position={'relative'} width={'30px'} height={'30px'} color="yellow.200"></LinkIcon>
            <Flex gap={'10px'} position={'relative'}>
                <Button onClick={toggleColorMode} padding={0} borderRadius={'50px'}>
                    {colorMode === 'dark' ? <SunIcon color={'yellow.200'} /> : <MoonIcon color={'gray.600'} />}
                </Button>
                {!wallet ? (
                    <ModalConnect isOpen={isOpen} onClose={close} onOpen={onClickOpen} />
                ) : (
                    <Menu isLazy>
                        <MenuButton
                            padding={' 2px 5px'}
                            fontWeight={'bold'}
                            color={colorMode === 'dark' ? 'rgb(255, 255, 255)' : '#4a4a4a'}
                            borderRadius={'50px'}
                            backgroundColor={colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : '#edf2f7'}
                        >
                            {fryndlyAddress.split('').splice(0, 7).join('').concat('...')}
                        </MenuButton>
                        <MenuList color={colorMode === 'dark' ? 'rgb(255, 255, 255)' : '#4a4a4a'}>
                            <MenuItem
                                closeOnSelect={false}
                                as={Button}
                                onClick={() => {
                                    setCopy(true);
                                    navigator.clipboard.writeText(fryndlyAddress);
                                }}
                            >
                                {isCopy ? <CheckIcon color={colorMode === 'dark' ? 'greenyellow' : '#35af2f'} /> : null}{' '}
                                &nbsp; Copy address
                            </MenuItem>
                            <MenuItem as={Button} onClick={() => connector.disconnect()}>
                                Disconect
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </Flex>
        </header>
    );
}
