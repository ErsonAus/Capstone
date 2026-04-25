import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from './CartContext'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
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
                    {/* Mini Australian flag stars */}
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
                        :kangaroo: Aussie Adventures
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
                </Box>
            </Toolbar>

            {/* Red/white/blue stripe below navbar */}
            <Box sx={{
                height: '3px',
                background: 'linear-gradient(90deg, #CC0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0038A8 66%)'
            }} />
        </AppBar>
    )
}

export default Navbar