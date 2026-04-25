import { useState, useEffect } from 'react'
import {
    Grid, Container, Typography, Box, CircularProgress, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExploreIcon from '@mui/icons-material/Explore'
import AdventureCard from '../components/AdventureCard'

const darkFieldSx = {
    '& .MuiOutlinedInput-root': {
        color: '#FFFFFF',
        '& fieldset': { borderColor: 'rgba(0, 56, 168, 0.4)' },
        '&:hover fieldset': { borderColor: 'rgba(0, 56, 168, 0.7)' },
        '&.Mui-focused fieldset': { borderColor: '#0038A8' },
    },
    '& .MuiInputLabel-root': { color: '#8899AA' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#A0B4CC' },
}

const EMPTY_FORM = { name: '', location: '', description: '', price: '', imageUrl: '' }

const Adventures = () => {
    const [adventures, setAdventures] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Add adventure modal
    const [addOpen, setAddOpen] = useState(false)
    const [addForm, setAddForm] = useState(EMPTY_FORM)
    const [addError, setAddError] = useState('')

    useEffect(() => {
        const fetchAdventures = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/adventures')
                if (!res.ok) throw new Error('Failed to fetch adventures')
                const data = await res.json()
                setAdventures(data)
            } catch (err) {
                setError(err.message)
                setAdventures([
                    { _id: '1', name: 'Great Barrier Reef Dive', location: 'Queensland', description: 'Experience the world\'s largest coral reef system with expert guides. Snorkel or dive through crystal clear waters teeming with marine life.', price: 299, comments: [] },
                    { _id: '2', name: 'Uluru Sunrise Trek', location: 'Northern Territory', description: 'Witness the breathtaking sunrise over Uluru, the sacred sandstone monolith rising from the desert plains of central Australia.', price: 149, comments: [] },
                    { _id: '3', name: 'Sydney Harbour Sailing', location: 'New South Wales', description: 'Sail across the iconic Sydney Harbour with the Opera House and Harbour Bridge as your backdrop. Perfect for all experience levels.', price: 199, comments: [] },
                    { _id: '4', name: 'Daintree Rainforest Walk', location: 'Queensland', description: 'Explore the world\'s oldest tropical rainforest with a knowledgeable local guide. Spot rare wildlife and ancient plants.', price: 129, comments: [] },
                    { _id: '5', name: 'Twelve Apostles Road Trip', location: 'Victoria', description: 'Drive the iconic Great Ocean Road and witness the majestic Twelve Apostles limestone stacks rising from the Southern Ocean.', price: 179, comments: [] },
                    { _id: '6', name: 'Kangaroo Island Wildlife', location: 'South Australia', description: 'Get up close with native Australian wildlife including kangaroos, koalas, sea lions and fairy penguins in their natural habitat.', price: 249, comments: [] },
                ])
            } finally {
                setLoading(false)
            }
        }
        fetchAdventures()
    }, [])

    // ── Add Adventure ─────────────────────────────────────────────────────
    const handleAddOpen = () => { setAddForm(EMPTY_FORM); setAddError(''); setAddOpen(true) }

    const handleAddSave = async () => {
        if (!addForm.title.trim()) { setAddError('Adventure title is required'); return }
        if (!addForm.summary.trim()) { setAddError('Summary is required'); return }
console.log ('Saving new adventure:', addForm) // Debug log
        try {
            const res = await fetch('http://localhost:5000/api/adventures/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm)
            })
            const created = await res.json()
            setAdventures(prev => [created, ...prev])
        } catch {
            // Optimistic add if backend not ready
            setAdventures(prev => [
                { ...addForm, _id: Date.now().toString(), price: Number(addForm.price) || 0, comments: [] },
                ...prev
            ])
        }
        setAddOpen(false)
    }

    // ── Update / Delete callbacks passed to cards ─────────────────────────
    const handleUpdate = (updated) => {
        setAdventures(prev => prev.map(a => a._id === updated._id ? { ...a, ...updated } : a))
    }

    const handleDelete = (id) => {
        setAdventures(prev => prev.filter(a => a._id !== id))
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 50%, #050D1A 100%)',
            py: 6
        }}>
            <Container maxWidth="xl">
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" sx={{  fontFamily: '"Playfair Display", serif',  fontWeight: 900,  color: '#ffffff',  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' }, // ← responsive 
  mb: 2,  textShadow: '0 0 40px rgba(0, 56, 168, 0.6)' }}>  Discover Australia </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                        {['■', '■', '■'].map((block, i) => (
                            <Box key={i} sx={{
                                width: 40, height: 4,
                                background: ['#CC0000', '#FFFFFF', '#0038A8'][i],
                                borderRadius: 2
                            }} />
                        ))}
                    </Box>
                    <Typography variant="h6" sx={{  color: '#8899AA',  fontWeight: 300,  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, // ← responsive 
  maxWidth: { xs: '100%', md: 600 }, // ← full width on mobile 
    mx: 'auto',  lineHeight: 1.8,  px: { xs: 2, md: 0 } // ← padding on mobile so text doesn't touch edges 
     }}>
                        Privacy-first adventures across the Lucky Country.
                        Your data stays yours — your memories don't have to.
                    </Typography>

                    {/* Add Adventure Button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddOpen}
                        size="large"
                        sx={{
                            background: 'linear-gradient(135deg, #0038A8, #0050DD)',
                            px: 4, py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 700,
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 56, 168, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #002888, #0038A8)',
                                boxShadow: '0 6px 28px rgba(0, 56, 168, 0.6)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Add Adventure
                    </Button>
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#0038A8' }} size={60} />
                    </Box>
                )}

                {error && (
                    <Alert severity="warning" sx={{ mb: 4, background: 'rgba(204,0,0,0.1)', color: '#FFAAAA', border: '1px solid rgba(204,0,0,0.3)' }}>
                        Backend not connected — showing demo adventures. ({error})
                    </Alert>
                )}

                <Grid container spacing={3} justifyContent="center">
                    {adventures.map((adventure) => (
                        <Grid item xs={12} sm={6} md={4} key={adventure._id}>
                            <AdventureCard
                                adventure={adventure}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ── Add Adventure Modal ──────────────────────────────────────── */}
            <Dialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(145deg, #0A1628, #0D2144)',
                        border: '1px solid rgba(0, 56, 168, 0.5)',
                        borderRadius: '16px',
                    }
                }}
            >[10:16]<DialogTitle sx={{
                    color: '#FFFFFF',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.4rem',
                    borderBottom: '1px solid rgba(0,56,168,0.3)',
                    pb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <ExploreIcon sx={{ color: '#0038A8' }} />
                    Add New Adventure
                </DialogTitle>

                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {addError && (
                        <Alert severity="error" sx={{ background: 'rgba(204,0,0,0.1)', color: '#FFAAAA', border: '1px solid rgba(204,0,0,0.3)' }}>
                            {addError}
                        </Alert>
                    )}
                    <TextField
                        label="Adventure Name *"
                        fullWidth
                        value={addForm.title}
                        onChange={e => { setAddForm(f => ({ ...f, title: e.target.value })); setAddError('') }}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={addForm.location}
                        onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Description *"
                        fullWidth
                        multiline
                        rows={4}
                        value={addForm.summary}
                        onChange={e => { setAddForm(f => ({ ...f, summary: e.target.value })); setAddError('') }}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Price (AUD)"
                        fullWidth
                        type="number"
                        value={addForm.price}
                        onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Image URL (optional)"
                        fullWidth
                        value={addForm.image}
                        onChange={e => setAddForm(f => ({ ...f, image: e.target.value }))}
                        helperText="Leave blank to use a random scenic image"
                        sx={{
                            ...darkFieldSx,
                            '& .MuiFormHelperText-root': { color: '#556677' }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1, borderTop: '1px solid rgba(0,56,168,0.3)' }}>
                    <Button
                        onClick={() => setAddOpen(false)}
                        sx={{ color: '#8899AA', '&:hover': { color: '#FFFFFF', background: 'rgba(255,255,255,0.05)' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddSave}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #0038A8, #0050DD)',
                            px: 3,
                            '&:hover': { background: 'linear-gradient(135deg, #002888, #0038A8)' }
                        }}
                    >
                        Add Adventure
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Adventures