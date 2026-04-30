import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/users'; // Asegúrate de tener la función logout
import Swal from 'sweetalert2';
import LoadingSpinner from '../Loading/Loading'

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Navbar() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Mostrar el modal de confirmación antes de ejecutar logout
    const showLogoutConfirmation = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de cerrar sesión.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(); // Llamar a la función de logout si el usuario confirma
            }
        });
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente.',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/'); 
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cerrar sesión',
                text: error.message || 'Error de red, intenta nuevamente.',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleNavigation = (path) => {
        navigate(path);
        toggleDrawer(); // Opcional: cierra el drawer al navegar
    };

    const menuItems = [
        { text: 'Añadir', icon: <GroupAddIcon />, path: '/configuration' },
        { text: 'Cuentas', icon: <SupervisorAccountIcon />, path: '/accounts' },
        { text: 'Estadísticas', icon: <AnalyticsIcon />, path: '/stats' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#E29700', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="black"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        sx={{ mr: 2 }}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
                        BettPrime
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="black"
                        aria-label="exit"
                        sx={{ ml: 2 }}
                        onClick={showLogoutConfirmation} // Muestra el modal de confirmación
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={open}
                onClose={toggleDrawer}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 240,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <DrawerHeader>
                    <IconButton onClick={toggleDrawer}>
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {menuItems.map((item) => (
                        <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
                <DrawerHeader />
            </Box>
            <LoadingSpinner isLoading={isLoading} />
        </Box>
    );
}
