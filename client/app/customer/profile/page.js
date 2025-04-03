'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../../styles/profile.css';

export default function CustomerProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: ''
  });
  const [editedProfile, setEditedProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setEditedProfile(response.data);
      } else {
        throw new Error('Invalid profile data');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile. Please try logging in again.');
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 2000);
    }
  };

  useEffect(() => {
    fetchProfile();
    return () => {
      setMessage('');
      setError('');
    };
  }, []);

  const handleChangeProfile = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setEditedProfile({ ...profile });
      setIsEditing(true);
      setMessage('');
    }
  };

  const handleCancel = () => {
    setEditedProfile({});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setEditedProfile({ ...editedProfile, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (!editedProfile.fullName?.trim() || 
          !editedProfile.phone?.trim() || 
          !editedProfile.address?.trim()) {
        throw new Error('Please fill in all required fields');
      }

      const response = await api.updateProfile({
        ...editedProfile,
        userType: 'customer'
      });

      if (response.success) {
        setProfile(editedProfile);
        setMessage(response.message);
        setIsEditing(false);
        fetchProfile();

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({
          ...currentUser,
          ...editedProfile
        }));
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      
      <div className="profile-form">
        <div className="profile-photo-section">
          <div className="photo-container">
            <img 
              src={profilePhoto || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-photo"
            />
          </div>
          <input 
            type="file"
            id="photo-upload"
            hidden
            onChange={handlePhotoUpload}
          />
          <button 
            className="photo-upload-btn"
            onClick={() => document.getElementById('photo-upload').click()}
          >
            Update Photo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea
                className="form-control"
                value={profile.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
