import React, { useEffect, useState } from 'react';
import { ListItem, ListItemAvatar, ListItemText, Typography, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { arrayBufferToBase64, getProfilePhoto } from '../../services/ProfileService';
import { blue } from '@mui/material/colors';

const MessageItem = styled(ListItem)(({ theme }) => ({
  marginBottom: '10px',
}));

const MyMessage = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#fff',
  padding: '15px',
  borderRadius: '10px',
  alignSelf: 'flex-end',
}));

const OtherMessage = styled(Paper)(({ theme }) => ({
  backgroundColor: '#e0e0e0',
  padding: '15px',
  borderRadius: '10px',
}));

const Message = ({ message, currentUser }) => {

  const isMyMessage = message.userId === currentUser.id;
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchUserProfilePhoto = async (id) => {
    const response = await getProfilePhoto(id);
    if (response) {
      const base64Flag = 'data:image/png;base64,';
      const base64Image = arrayBufferToBase64(response.data);
      setProfilePicture(base64Flag + base64Image);
    }
  }

  useEffect(() => {
    fetchUserProfilePhoto(message.userId);
  }, [message]);

  const getInitials = (fullName) => {
    const names = fullName.split(' ');
    const initials = names.map(name => name[0].toUpperCase()).join('');
    return initials;
  }

  return (
    <MessageItem>
      <ListItemAvatar>
        <Avatar src={profilePicture} sx={{ bgcolor: blue[500] }}>
          {!profilePicture && getInitials(message.sender)}
        </Avatar>
      </ListItemAvatar>
      <>
        {isMyMessage ? (
          <MyMessage component="div">
            <ListItemText
              primary={message.content}
              secondary={
                <>
                  <Typography component="span" variant="body3" color="textPrimary">
                    {message.sender}
                  </Typography>
                </>
              }
            />
          </MyMessage>
        ) : (
          <OtherMessage component="div">
            <ListItemText
              primary={message.content}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {message.sender}
                  </Typography>
                </>
              }
            />
          </OtherMessage>
        )}
      </>
    </MessageItem>
  );
};

export default Message;