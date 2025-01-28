import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaEdit } from 'react-icons/fa';

const ProfileContainer = styled(motion.div)`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const Label = styled.span`
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;

  option {
    background: #1a1a2e;
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.type === 'submit' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.type === 'submit' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProfileSection = () => {
  const { user, dispatch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    email: user?.email || '',
    gender: user?.gender || ''
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch('/api/users/profile-picture', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { ...user, profilePicture: data.profilePicture } 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      dispatch({ type: 'UPDATE_USER', payload: data.user });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileHeader>
        <ProfileImage>
          <img 
            src={user?.profilePicture?.url || '/default-avatar.png'} 
            alt={user?.name} 
          />
          <div className="upload-overlay">
            <label htmlFor="profile-image">
              <FaCamera color="white" />
              <input
                type="file"
                id="profile-image"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
          </div>
        </ProfileImage>

        <ProfileInfo>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} disabled={loading}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </ProfileInfo>
      </ProfileHeader>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Bio</Label>
            <TextArea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              maxLength={500}
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Gender</Label>
            <Select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" onClick={() => setIsEditing(false)} disabled={loading}>
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      ) : (
        <ProfileDetails>
          <DetailItem>
            <Label>Bio</Label>
            <p>{user?.bio || 'No bio added yet'}</p>
          </DetailItem>
          <DetailItem>
            <Label>Gender</Label>
            <p>{user?.gender || 'Not specified'}</p>
          </DetailItem>
          {user?.isDriver && (
            <>
              <DetailItem>
                <Label>Driver Status</Label>
                <p>{user?.isVerified ? 'Verified Driver' : 'Verification Pending'}</p>
              </DetailItem>
              {user?.isVerified && (
                <DetailItem>
                  <Label>Vehicle Plate</Label>
                  <p>{user?.vehiclePlate}</p>
                </DetailItem>
              )}
            </>
          )}
        </ProfileDetails>
      )}
    </ProfileContainer>
  );
};

export default ProfileSection; 