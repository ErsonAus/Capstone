import { useState } from 'react'
import {
    Card, CardContent, CardMedia, CardActions,
    Button, Typography, Box, Chip, Collapse,
    TextField, IconButton, Divider, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions,
    DialogContentText
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CommentIcon from '@mui/icons-material/Comment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useCart } from './CartContext'

// Shared MUI dark text field styles
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

const AdventureCard = ({ adventure, onUpdate, onDelete, isAdmin }) => {
    const { addToCart } = useCart()

    // Cart
    const [added, setAdded] = useState(false)

    // Comments
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [comments, setComments] = useState(adventure.comments || [])
    const [newComment, setNewComment] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editCommentText, setEditCommentText] = useState('')

    // Edit adventure modal
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({
        title: adventure.title || '',
        location: adventure.location || '',
        summary: adventure.summary || '',
        price: adventure.price || '',
        image: adventure.image? adventure.image : `https://picsum.photos/seed/${adventure._id}/600/300`,
    })

    // Delete adventure confirmation
    const [deleteOpen, setDeleteOpen] = useState(false)

    // ── Cart ──────────────────────────────────────────────────────────────
    const handleAddToCart = () => {
        addToCart(adventure)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    // ── Edit Adventure ────────────────────────────────────────────────────
    const handleEditSave = async () => {
    console.log('Saving adventure with data:', editForm)
        try {
            const res = await fetch(`http://localhost:5000/api/adventures/${adventure._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })
            const updated = await res.json()
            onUpdate && onUpdate(updated)
        } catch {
            // Optimistic update if backend not ready
            onUpdate && onUpdate({ ...adventure, ...editForm })
        }
        setEditOpen(false)
    }

    // ── Delete Adventure ──────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        try {
            await fetch(`http://localhost:5000/api/adventures/${adventure._id}`, {
                method: 'DELETE'
            })
        } catch {}
        onDelete && onDelete(adventure._id)
        setDeleteOpen(false)
    }

    // ── Comments ──────────────────────────────────────────────────────────
    const handleAddComment = async () => {
        if (!newComment.trim()) return
        try {
            const res = await fetch(`http://localhost:5000/api/adventures/${adventure._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment })
            })
            const data = await res.json()
            setComments(data.comments || [...comments, { _id: Date.now().toString(), text: newComment, createdAt: new Date() }])
        } catch {
            setComments(prev => [...prev, { _id: Date.now().toString(), text: newComment, createdAt: new Date() }])
        }
        setNewComment('')
    }

    const handleEditComment = async (commentId) => {
        if (!editCommentText.trim()) return
        try {
            const res = await fetch(`http://localhost:5000/api/adventures/${adventure._id}/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: editCommentText })
            })
            const data = await res.json()
            setComments(data.comments || comments.map(c => c._id === commentId ? { ...c, text: editCommentText } : c))
        } catch {
            setComments(prev => prev.map(c => c._id === commentId ? { ...c, text: editCommentText } : c))
        }
        setEditingCommentId(null)
        setEditCommentText('')
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await fetch(`http://localhost:5000/api/adventures/${adventure._id}/comments/${commentId}`, { method: 'DELETE' })
        } catch {}
        setComments(prev => prev.filter(c => c._id !== commentId))
    }

    return (
        <>
            <Card sx={{
    height: '100%', // ← fills the grid item  
     display: 'flex', // ← needed for column layout  
      flexDirection: 'column', // ← stacks content vertically  
    
                background: 'linear-gradient(145deg, #0A1628 0%, #0D2144 100%)',
                border: '1px solid rgba(0, 56, 168, 0.4)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0, 56, 168, 0.4)',
                    border: '1px solid rgba(0, 56, 168, 0.8)',
                }
            }}>
                {/* Image */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="300"
                        width="600"
                        image={adventure.image || `https://picsum.photos/seed/${adventure._id}/600/300`}
                        alt={adventure.title}
                        sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                        background: 'linear-gradient(90deg, #00008B 33%, #CC0000 33%, #CC0000 66%, #FFFFFF 66%)'
                    }} />
                    {adventure.price && (
                        <Chip
                            label={`$${adventure.price}`}
                            sx={{
                                position: 'absolute', top: 12, right: 12,
                                background: 'linear-gradient(135deg, #CC0000, #FF1A1A)',
                                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}
                        />
                    )}
                    {/* Edit / Delete buttons on image */}
                    <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                        {isAdmin? <IconButton
                            size="small"
                            onClick={() => setEditOpen(true)}
                            sx={{
                                background: 'rgba(0,56,168,0.85)',
                                color: '#fff',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { background: '#0038A8' }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>: null}
                        {isAdmin?<IconButton
                            size="small"
                            onClick={() => setDeleteOpen(true)}
                            sx={{
                                background: 'rgba(204,0,0,0.85)',
                                color: '#fff',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { background: '#CC0000' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>: null}
                    </Box>
                </Box>

                <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{
                        color: '#FFFFFF', fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 0.5
                    }}>
                        {adventure.title}
                    </Typography>
                    {adventure.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: '#CC0000' }} />
                            <Typography variant="body2" sx={{ color: '#A0B4CC' }}>{adventure.location}</Typography>
                        </Box>
                    )}
                    <Typography variant="body2" sx={{
                        color: '#8899AA', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {adventure.summary}
                    </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 1, gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        size="small"
                        sx={{
                            background: added
                                ? 'linear-gradient(135deg, #006400, #008000)'
                                : 'linear-gradient(135deg, #CC0000, #FF1A1A)',
                            color: '#fff', fontWeight: 600, flex: 1, transition: 'all 0.3s ease',
                            '&:hover': { background: 'linear-gradient(135deg, #AA0000, #DD0000)' }
                        }}
                    >
                        {added ? '✓ Added!' : 'Add to Cart'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CommentIcon />}
                        onClick={() => setCommentsOpen(!commentsOpen)}
                        size="small"
                        sx={{
                            borderColor: 'rgba(0, 56, 168, 0.6)', color: '#A0B4CC',
                            '&:hover': { borderColor: '#0038A8', background: 'rgba(0, 56, 168, 0.1)' }
                        }}
                    >
    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                        <ExpandMoreIcon sx={{
                            ml: 0.5, fontSize: 16,
                            transform: commentsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} />
                    </Button>
                </CardActions>

                {/* Comments */}
                <Collapse in={commentsOpen}>
                    <Divider sx={{ borderColor: 'rgba(0, 56, 168, 0.3)' }} />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#A0B4CC', mb: 1.5 }}>
                            Anonymous Comments
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                            {comments.length === 0 && (
                                <Typography variant="body2" sx={{ color: '#556677', fontStyle: 'italic' }}>
                                    No comments yet. Be the first!
                                </Typography>
                            )}
                            {comments.map((comment) => (
                                <Box key={comment._id} sx={{
                                    display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5,
                                    p: 1.5, background: 'rgba(0, 56, 168, 0.1)',
                                    borderRadius: '8px', border: '1px solid rgba(0, 56, 168, 0.2)'
                                }}>
                                    <Avatar sx={{
                                        width: 28, height: 28, fontSize: '0.7rem',
                                        background: 'linear-gradient(135deg, #0038A8, #CC0000)', flexShrink: 0
                                    }}>:kangaroo:</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        {editingCommentId === comment._id ? (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField
                                                    value={editCommentText}
                                                    onChange={e => setEditCommentText(e.target.value)}
                                                    size="small" fullWidth multiline
                                                    sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(0,56,168,0.5)' } } }}
                                                />
                                                <IconButton size="small" onClick={() => handleEditComment(comment._id)} sx={{ color: '#4CAF50' }}>
                                                    <SendIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <>
                                                <Typography variant="body2" sx={{ color: '#CCD9E8', lineHeight: 1.5 }}>
                                                    {comment.text}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#556677' }}>
                                                    Anonymous • {new Date(comment.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                    {editingCommentId !== comment._id && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <IconButton size="small" onClick={() => { setEditingCommentId(comment._id); setEditCommentText(comment.text) }} sx={{ color: '#A0B4CC', p: 0.5 }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteComment(comment._id)} sx={{ color: '#CC0000', p: 0.5 }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add an anonymous comment..."
                                size="small" fullWidth multiline maxRows={3}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#FFFFFF', fontSize: '0.85rem',
                                        '& fieldset': { borderColor: 'rgba(0, 56, 168, 0.4)' },
                                        '&:hover fieldset': { borderColor: 'rgba(0, 56, 168, 0.7)' },
                                        '&.Mui-focused fieldset': { borderColor: '#0038A8' },
                                    },
                                    '& .MuiInputBase-input::placeholder': { color: '#556677' }
                                }}
                            />
                            <IconButton onClick={handleAddComment} sx={{
                                background: 'linear-gradient(135deg, #0038A8, #0050DD)', color: '#fff',
                                '&:hover': { background: 'linear-gradient(135deg, #002888, #0038A8)' }
                            }}>
                                <SendIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Collapse>
            </Card>

            {/* ── Edit Adventure Modal ─────────────────────────────────────── */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(145deg, #0A1628, #0D2144)',
                        border: '1px solid rgba(0, 56, 168, 0.5)',
                        borderRadius: '16px',
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#FFFFFF',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.4rem',
                    borderBottom: '1px solid rgba(0,56,168,0.3)',
                    pb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <EditIcon sx={{ color: '#0038A8' }} />
                    Edit Adventure
                </DialogTitle>

                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Adventure Name"
                        fullWidth
                        value={editForm.title}
                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={editForm.location}
                        onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={editForm.summary}
                        onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Price (AUD)"
                        fullWidth
                        type="number"
                        value={editForm.price}
                        onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                        sx={darkFieldSx}
                    />
                    <TextField
                        label="Image URL (optional)"
                        fullWidth
                        value={editForm.image}
                        onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                        sx={darkFieldSx}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1, borderTop: '1px solid rgba(0,56,168,0.3)' }}>
                    <Button
                        onClick={() => setEditOpen(false)}
                        sx={{ color: '#8899AA', '&:hover': { color: '#FFFFFF', background: 'rgba(255,255,255,0.05)' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #0038A8, #0050DD)',
                            px: 3,
                            '&:hover': { background: 'linear-gradient(135deg, #002888, #0038A8)' }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete Confirmation Dialog ───────────────────────────────── */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(145deg, #0A1628, #0D2144)',
                        border: '1px solid rgba(204, 0, 0, 0.5)',
                        borderRadius: '16px',
                        minWidth: 360
                    }
                }}
            ><DialogTitle sx={{
                    color: '#FFFFFF',
                    fontFamily: '"Playfair Display", serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid rgba(204,0,0,0.3)',
                    pb: 2
                }}>
                    <WarningAmberIcon sx={{ color: '#CC0000' }} />
                    Delete Adventure?
                </DialogTitle>

                <DialogContent sx={{ pt: 3 }}>
                    <DialogContentText sx={{ color: '#A0B4CC', lineHeight: 1.7 }}>
                        Are you sure you want to delete{' '}
                        <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                            {adventure.title}
                        </Box>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1, borderTop: '1px solid rgba(204,0,0,0.3)' }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(0,56,168,0.5)',
                            color: '#A0B4CC',
                            '&:hover': { borderColor: '#0038A8', background: 'rgba(0,56,168,0.1)' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #CC0000, #FF1A1A)',
                            px: 3,
                            '&:hover': { background: 'linear-gradient(135deg, #AA0000, #DD0000)' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AdventureCard