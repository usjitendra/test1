import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, IconButton,
  Avatar, Chip, CircularProgress, Popover,
} from '@mui/material';
import { Send as SendIcon, InsertEmoticon as EmojiIcon } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
const BACKEND = import.meta.env.VITE_APP_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';
const roleColor = { super_admin: 'error', admin: 'warning', employee: 'default' };
const roleLabel = { super_admin: 'Super Admin', admin: 'Admin', employee: 'Employee' };
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('accessToken');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BACKEND_URL}/chat/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setMessages(res.data.data);
      })
      .finally(() => setLoading(false));
    const socket = io(BACKEND, { auth: { token } });
    socketRef.current = socket;
    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    socketRef.current.emit('send_message', trimmed);
    setText('');
    setAnchorEl(null);
  };
  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? text.length;
      const end = input.selectionEnd ?? text.length;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setText(newText);
      setTimeout(() => {
        input.focus();
        const newCursorPos = start + emoji.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      setText((prev) => prev + emoji);
    }
  };
  const handleEmojiClick = (emojiData) => {
    if (emojiData && emojiData.emoji) {
      insertEmoji(emojiData.emoji);
    }
  };
  const getInitial = (name) => (name || 'U').charAt(0).toUpperCase();
  return (
    <Container maxWidth="md" sx={{ py: 2, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#0f172a' }}>
        Group Chat
      </Typography>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          mb: 2,
          backgroundColor: '#f8fafc',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">No messages yet. Say hello! 👋</Typography>
          </Box>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === currentUser._id || msg.sender?._id === currentUser._id;
            const displayName = msg.senderName || msg.sender?.full_name || 'User';
            return (
              <Box
                key={msg._id || idx}
                sx={{
                  display: 'flex',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    bgcolor: isMe ? 'primary.main' : '#94a3b8',
                    flexShrink: 0,
                  }}
                >
                  {getInitial(displayName)}
                </Avatar>
                <Box sx={{ maxWidth: '70%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5,
                      flexDirection: isMe ? 'row-reverse' : 'row',
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} color="text.primary">
                      {isMe ? 'You' : displayName}
                    </Typography>
                    {msg.senderRole !== 'employee' && (
                      <Chip
                        label={roleLabel[msg.senderRole]}
                        color={roleColor[msg.senderRole]}
                        size="small"
                        sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  <Paper
                    elevation={1}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isMe ? 'primary.main' : '#ffffff',
                      color: isMe ? '#ffffff' : '#1e293b',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', mt: 0.3, textAlign: isMe ? 'right' : 'left' }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Paper>
      <Paper
        component="form"
        onSubmit={handleSend}
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
          <IconButton
            type="button"
            onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
            sx={{
              color: anchorEl ? 'primary.main' : '#64748b',
              '&:hover': { color: 'primary.main', bgcolor: '#f1f5f9' },
              transition: 'color 0.2s',
            }}
            title="Choose Emoji"
          >
            <EmojiIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                borderRadius: 0,
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                mb: 1,
                overflow: 'hidden',
              },
            }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              width={330}
              height={400}
              previewConfig={{ showPreview: false }}
              searchPlaceHolder="Search emoji..."
            />
          </Popover>
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
            InputProps={{ disableUnderline: true }}
            inputRef={inputRef}
            sx={{ fontSize: 15 }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!text.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Paper>
    </Container>
  );
};
export default ChatPage;
