import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Spinner,
} from '@chakra-ui/react';
import st from './Content.module.css';
import { useTransaction } from '../../hooks/useTransaction';
import { useToggle } from '../../hooks/useToggle';
import { useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
export function Content() {
    const { isConfirm, sendTransaction } = useTransaction();
    const { isOpen, close, open } = useToggle();
    const { wallet } = useWallet();

    useEffect(() => {
        if (isConfirm) open();
        else close();
    }, [isConfirm]);
    return (
        <>
            <Flex
                className={st.body}
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
                height={'calc(100vh - 140px)'}
                p={'20px 40px'}
            >
                {wallet ? (
                    <Button borderRadius={'50px'} onClick={sendTransaction} isDisabled={isConfirm}>
                        Transaction
                    </Button>
                ) : null}
                {isConfirm ? (
                    <Modal isOpen={isOpen} onClose={close} isCentered>
                        <ModalOverlay />
                        <ModalContent width={'150px'} height={'150px'}>
                            <ModalCloseButton />
                            <ModalBody display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="yellow.500"
                                    size="xl"
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                ) : null}
            </Flex>
        </>
    );
}
