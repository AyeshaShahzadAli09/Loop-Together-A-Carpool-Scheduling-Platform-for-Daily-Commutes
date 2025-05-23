import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaEdit, FaEnvelope } from 'react-icons/fa';
import DriverVerificationForm from '../driver/DriverVerificationForm';
import VerificationStatus from '../driver/VerificationStatus';

const ProfileContainer = styled(motion.div)`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const ImageUploadProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 4px;
  font-size: 12px;
`;

const ImagePreview = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;

  img {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
  }
`;

const ProfileName = styled.h1`
  font-size: 2.2rem;
  background: linear-gradient(135deg, #00ffff 0%, #4ade80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const ProfileEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-top: 0.5rem;
  
  svg {
    color: #4ade80;
  }
`;

const EditButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  svg {
    font-size: 1.1rem;
  }

  &:hover {
    background: rgba(0, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProfileSection = () => {
  const { user, dispatch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    gender: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        email: user.email || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/driver/verification-status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setVerificationStatus(data.verification);
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    if (user?.isDriver) {
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      if (data.success) {
        dispatch({ type: 'UPDATE_USER', payload: data.user });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            dispatch({ 
              type: 'UPDATE_USER', 
              payload: { ...user, profilePicture: response.profilePicture } 
            });
            setUploadProgress(0);
          }
        } else {
          console.error('Upload failed');
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        console.error('Upload failed');
        setLoading(false);
        setUploadProgress(0);
      };

      xhr.open('POST', `${import.meta.env.VITE_API_URL}/users/profile/picture`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        dispatch({ type: 'UPDATE_USER', payload: data.user });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.message.includes('401')) {
        dispatch({ type: 'LOGOUT' });
      }
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
            onClick={() => setPreviewImage(user?.profilePicture?.url)}
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
          {loading && uploadProgress > 0 && (
            <ImageUploadProgress>
              Uploading: {uploadProgress}%
            </ImageUploadProgress>
          )}
        </ProfileImage>

        <ProfileInfo>
          <ProfileName>{user?.name}</ProfileName>
          <ProfileEmail>
            <FaEnvelope />
            {user?.email}
          </ProfileEmail>
        </ProfileInfo>
      </ProfileHeader>

      {!isEditing && (
        <EditButton
          onClick={() => setIsEditing(true)}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaEdit />
          Edit Profile
        </EditButton>
      )}

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
            <VerificationStatus 
              status={verificationStatus?.status || 'Pending'} 
              feedback={verificationStatus?.feedback}
            />
          )}
        </ProfileDetails>
      )}

      {previewImage && (
        <ImagePreview onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Profile Preview" />
          <button onClick={() => setPreviewImage(null)}>×</button>
        </ImagePreview>
      )}

      <AnimatePresence>
        {showVerificationForm && (
          <DriverVerificationForm 
            onClose={() => setShowVerificationForm(false)} 
          />
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

export default ProfileSection; 