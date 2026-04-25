import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { CartProvider } from './components/CartContext'
import Navbar from './components/Navbar'
import Adventures from './components/Adventures'
import Checkout from './components/Checkout'

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
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Adventures />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </ThemeProvider>
    )
}

export default App