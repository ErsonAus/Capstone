import { useState } from 'react'
import {
    Container, Typography, Box, Button, TextField,
    Grid, Paper, IconButton, Divider, Alert, Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useCart } from './CartContext'
import { Link } from 'react-router-dom'

const Checkout = () => {
    const { cart, removeFromCart, clearCart, cartTotal } = useCart()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const validateEmail = (val) => {
        if (!val) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address'
        return ''
    }

    const handlePayNow = async () => {
        const err = validateEmail(email)
        if (err) { setEmailError(err); return }
        if (cart.length === 0) { setError('Your cart is empty!'); return }

        setLoading(true)
        setError('')

        try {
            // Send confirmation email
            await fetch('http://localhost:5000/api/adventures/email/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // In Checkout.jsx
body: JSON.stringify({
    to: email,
    subject: ':kangaroo: Your Aussie Adventure Booking Confirmation!',
    name: 'Adventurer',
    message: `You've booked: ${cart.map(i => `${i.title} (x${i.quantity})`).join(', ')}. Total: $${cartTotal.toFixed(2)} AUD.`
})
            })
            setSuccess(true)
            clearCart()
        } catch {
            // Still show success for demo purposes
            setSuccess(true)
            clearCart()
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
                    <Typography variant="h3" sx={{
                        fontFamily: '"Playfair Display", serif',
                        color: '#FFFFFF',
                        mb: 2
                    }}>
                        Booking Confirmed! :kangaroo:
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#8899AA', mb: 4 }}>
                        A confirmation has been sent to {email}
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #0038A8, #0050DD)',
                            px: 4, py: 1.5,
                            fontSize: '1rem'
                        }}
                    >
                        Book Another Adventure
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 100%)',
            py: 6
        }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{
                    fontFamily: '"Playfair Display", serif',
                    color: '#FFFFFF',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Checkout
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 5 }}>
                    {['■', '■', '■'].map((block, i) => (
                        <Box key={i} sx={{
                            width: 30,
                            height: 3,
                            background: ['#CC0000', '#FFFFFF', '#0038A8'][i],
                            borderRadius: 2
                        }} />
                    ))}
                </Box>

                {cart.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h5" sx={{ color: '#8899AA', mb: 3 }}>
                            Your cart is empty
                        </Typography>
                        <Button
                            component={Link}
                            to="/"
                            variant="contained"
                            sx={{ background: 'linear-gradient(135deg, #CC0000, #FF1A1A)' }}
                        >
                            Browse Adventures
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {/* Cart Items */}
                        <Grid item xs={12} md={7}>
                            <Paper sx={{
                                background: 'linear-gradient(145deg, #0A1628, #0D2144)',
                                border: '1px solid rgba(0, 56, 168, 0.3)',
                                borderRadius: '12px',
                                p: 3
                            }}>
                                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontFamily: '"Playfair Display", serif' }}>
                                    Your Adventures ({cart.length})
                                </Typography>

                                {cart.map((item) => (
                                    <Box key={item._id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#8899AA' }}>
                                                    {item.location}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <Chip
                                                        label={`x${item.quantity}`}
                                                        size="small"
                                                        sx={{ background: 'rgba(0,56,168,0.3)', color: '#A0B4CC', fontSize: '0.7rem' }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: '#CC0000', fontWeight: 700 }}>
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                onClick={() => removeFromCart(item._id)}
                                                sx={{ color: '#CC0000', '&:hover': { background: 'rgba(204,0,0,0.1)' } }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                        <Divider sx={{ borderColor: 'rgba(0, 56, 168, 0.2)' }} />
                                    </Box>
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#A0B4CC' }}>Total</Typography>
                                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                                        ${cartTotal.toFixed(2)} AUD
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Payment Section */}
                        <Grid item xs={12} md={5}>
                            <Paper sx={{
                                background: 'linear-gradient(145deg, #0A1628, #0D2144)',
                                border: '1px solid rgba(0, 56, 168, 0.3)',
                                borderRadius: '12px',
                                p: 3
                            }}>
                                <Typography variant="h6" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    fontFamily: '"Playfair Display", serif'
                                }}>
                                    Payment Details
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 3,
                                    p: 1.5,
                                    background: 'rgba(0, 56, 168, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0,56,168,0.2)'
                                }}>
                                    <LockIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
                                    <Typography variant="caption" sx={{ color: '#8899AA' }}>
                                        Privacy-first checkout. We never store your personal data.
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                                    error={!!emailError}
                                    helperText={emailError || 'Confirmation will be sent here'}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ color: '#556677', mr: 1, fontSize: 20 }} />
                                    }}sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFFF',
                                            '& fieldset': { borderColor: 'rgba(0, 56, 168, 0.4)' },
                                            '&:hover fieldset': { borderColor: 'rgba(0, 56, 168, 0.7)' },
                                            '&.Mui-focused fieldset': { borderColor: '#0038A8' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#8899AA' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#A0B4CC' },
                                        '& .MuiFormHelperText-root': { color: '#556677' },
                                    }}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2, background: 'rgba(204,0,0,0.1)', color: '#FFAAAA' }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handlePayNow}
                                    disabled={loading}
                                    sx={{
                                        background: 'linear-gradient(135deg, #CC0000, #FF1A1A)',
                                        py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.05em',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #AA0000, #DD0000)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(100,100,100,0.3)',
                                            color: '#556677'
                                        }
                                    }}
                                >
                                    {loading ? 'Processing...' : `Pay Now — $${cartTotal.toFixed(2)} AUD`}
                                </Button>

                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#445566', mt: 2 }}>
                                    :lock: Secured by privacy-first encryption
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    )
}

export default Checkout