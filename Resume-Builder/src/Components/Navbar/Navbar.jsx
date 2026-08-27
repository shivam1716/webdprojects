import { Box, Flex, HStack, IconButton, useDisclosure, useColorMode, Stack, Button, Text } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as ReachLink } from 'react-router-dom'
import logo from './../../Assets/logo.png';


export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box id='navbar' className="app-nav" px={4}>
                <Flex h={18} maxW="7xl" mx="auto" alignItems={'center'} justifyContent={'space-between'}>
                    <ReachLink to='/'>
                        <HStack spacing={2}><img style={{ height: '38px' }} className='logo' src={logo} alt="Resume Studio" /><Text className="brand-text">Resume Studio</Text></HStack>
                    </ReachLink>

                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            <ReachLink className="nav-link" to={'/'}>Workspace</ReachLink>
                            <ReachLink className="nav-link" to={'/about'}>About</ReachLink>
                        </HStack>
                        <Button className="mode-button" aria-label="Toggle color mode" onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                    </HStack>

                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />

                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            <ReachLink className="nav-link" to={'/'}>Workspace</ReachLink>
                            <ReachLink className="nav-link" to={'/about'}>About</ReachLink>
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
