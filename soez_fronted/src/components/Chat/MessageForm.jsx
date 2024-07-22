import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const MessageForm = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" color="primary" variant="contained" style={{ marginLeft: '10px' }}>
        <SendIcon/>
      </Button>
    </FormContainer>
  );
};

export default MessageForm;