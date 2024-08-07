import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    List,
    ListItem,
    Image,
    Box,
    useColorMode,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { isWalletInfoCurrentlyInjected, isWalletInfoRemote, WalletInfo, WalletInfoRemote } from '@tonconnect/sdk';
import st from './Modal.module.css';
import {  useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { tonProofApi } from './../../ton-proof-api'
// eslint-disable-next-line import/no-unresolved
import { connector } from '../../api/connector/connector';
// eslint-disable-next-line import/no-unresolved
import { ModalQRCode } from '../modalQRCode/ModalQRCode';
// eslint-disable-next-line import/no-unresolved
import { useTonConnectonRestored } from '../../hooks/useTonConnectionRestored';
// eslint-disable-next-line import/no-unresolved
import { useGetWallets } from '../../hooks/useGetWallets';
// eslint-disable-next-line import/no-unresolved
import { UniqQRCode } from './UniqQrCode';
export function ModalConnect({
    isOpen,
    onClose,
    onOpen,
}: {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}) {
    const wallets = useGetWallets();
    const [choisyWallet, setChoisyWallet] = useState<WalletInfoRemote | null>(null);
    const closeQRCode = () => setChoisyWallet(null);
    const isRestored = useTonConnectonRestored();

    const { colorMode } = useColorMode();
    const onWalletClick = async (wallet: WalletInfo) => {
        const tonProof = await tonProofApi.generatePayload();
        if (isWalletInfoCurrentlyInjected(wallet)) {
            return connector.connect({ jsBridgeKey: wallet.jsBridgeKey }, tonProof);
        }
        if (isWalletInfoRemote(wallet)) {            
            return setChoisyWallet(wallet as WalletInfoRemote);
        }
        window.open(wallet.aboutUrl, '_blank');
    };

    return (
        <>
            <Button borderRadius={'50px'} onClick={onOpen}>
                {isRestored ? 'Connect wallet' : <Spinner />}
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
                <ModalContent>
                    <ModalHeader>Connect wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <UniqQRCode isOpen={isOpen}/>
                        <List className={st.list} display={'grid'}>
                            {wallets?.map((wal, ind) => {
                                return (
                                    <ListItem
                                        key={ind}
                                        className={st.item}
                                        padding={'5px'}
                                        backgroundColor={colorMode === 'light' ? 'rgb(226, 239, 245)' : '#4d5564'}
                                        boxShadow={'3px 3px 4px 0 rgb(172, 172, 172)'}
                                        borderRadius={'5px'}
                                        textAlign={'left'}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        _hover={{
                                            backgroundColor: `${colorMode === 'light' ? '#bfcbd8' : '#4d5564'}`,
                                            boxShadow: '1px 1px 2px 0 rgb(172, 172, 172)',
                                        }}
                                        as={'button'}
                                        onClick={() => {
                                            onWalletClick(wal);
                                        }}
                                    >
                                        <Box display={'flex'} gap={'5px'}>
                                            <Image
                                                src={wal.imageUrl}
                                                width={'20px'}
                                                height={'20px'}
                                                borderRadius={'3px'}
                                            />
                                            <Text className={st.wallet_name} fontWeight={'bold'} fontSize={'0.8em'}>
                                                {wal.name}
                                            </Text>
                                        </Box>
                                        <Text className={st.wallet_text} padding={'4px'} fontSize={'0.3em'}>
                                            {[
                                                ...wal.platforms.map((el, ind, arr) => {
                                                    return (
                                                        <span key={ind}>
                                                            {el}
                                                            {ind === arr.length - 1 ? '' : ', '}
                                                        </span>
                                                    );
                                                }),
                                            ]}
                                        </Text>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
            <ModalQRCode isOpen={!!choisyWallet} onClose={closeQRCode} wallet={choisyWallet} />
        </>
    );
}
