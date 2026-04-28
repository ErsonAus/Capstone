import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { CartProvider } from './components/CartContext'
import Navbar from './components/Navbar'
import Adventures from './components/Adventures'
import Checkout from './components/Checkout'
import { useState } from 'react'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#0038A8' },
        secondary: { main: '#CC0000' },
        background: {
            default: '#050D1A',
            paper: '#0A1628'
        }
    },
    typography: {
        fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: '8px' }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: '12px' }
            }
        }
    }
})

function App() {
const [isAdmin, setIsAdmin] = useState(false)

const handleAdminToggle = () => {
        setIsAdmin(prev => !prev)
        // When real auth is added, this will trigger a login modal or redirect
    }



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CartProvider>
                <BrowserRouter>
                    <Navbar isAdmin={isAdmin} handleAdminToggle={handleAdminToggle}/>
                    <Routes>
                        <Route path="/" element={<Adventures isAdmin={isAdmin}/>} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </ThemeProvider>
    )
}

export default App