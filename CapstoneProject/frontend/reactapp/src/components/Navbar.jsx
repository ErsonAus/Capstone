import { AppBar, Toolbar, Typography, Button, Badge, Box, IconButton, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useCart } from './CartContext'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Navbar = ({isAdmin, handleAdminToggle}) => {
    const { cartCount } = useCart()
    const location = useLocation()

    return (
        <AppBar position="sticky" sx={{
            background: 'linear-gradient(90deg, #000000 0%, #00008B 40%, #000080 60%, #000000 100%)',
            borderBottom: '3px solid #CC0000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                        {['★', '★', '★'].map((star, i) => (
                            <Typography key={i} sx={{ color: '#FFFFFF', fontSize: '8px', lineHeight: 1 }}>{star}</Typography>
                        ))}
                    </Box>
                    <Typography variant="h6" sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        letterSpacing: '0.05em',
                        textDecoration: 'none'
                    }} component={Link} to="/">
                       🦘 Aussie Adventures
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to="/"
                        sx={{
                            color: location.pathname === '/' ? '#FFFFFF' : '#A0B4CC',
                            fontWeight: location.pathname === '/' ? 700 : 400,
                            borderBottom: location.pathname === '/' ? '2px solid #CC0000' : 'none',
                            borderRadius: 0,
                            '&:hover': { color: '#FFFFFF', background: 'transparent' }
                        }}
                    >
                        Adventures
                    </Button>

                    <Button
                        component={Link}
                        to="/checkout"
                        sx={{
                            color: location.pathname === '/checkout' ? '#FFFFFF' : '#A0B4CC',
                            fontWeight: location.pathname === '/checkout' ? 700 : 400,
                        }}
                        startIcon={
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        }
                    >
                        Cart
                    </Button>

                    {/* Admin toggle */}
                    <Tooltip title={isAdmin ? 'Admin mode on — click to lock' : 'Click to enter admin mode'}>
                        <IconButton
                            onClick={handleAdminToggle}
                            sx={{
                                color: isAdmin ? '#4CAF50' : '#A0B4CC',
                                border: `1px solid ${isAdmin ? '#4CAF50' : 'rgba(160,180,204,0.3)'}`,
                                borderRadius: '8px',
                                padding: '6px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: isAdmin
                                        ? 'rgba(76,175,80,0.1)'
                                        : 'rgba(160,180,204,0.1)',
                                    borderColor: isAdmin ? '#4CAF50' : '#A0B4CC'
                                }
                            }}
                        >
                            {isAdmin ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>

            <Box sx={{
                height: '3px',
                background: 'linear-gradient(90deg, #CC0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0038A8 66%)'
            }} />
        </AppBar>
    )
}

export default Navbar