'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../../styles/profile.css';

export default function FarmerProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    farmName: '',
    farmAddress: '',
    phone: '',
    profilePhoto: ''
  });
  const [editedProfile, setEditedProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    fetchProfile();
    return () => {
      setMessage('');
      setError('');
    };
  }, []);

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

  const handleEditProfile = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setEditedProfile({ ...profile });
      setIsEditing(true);
      setMessage('');
      setError('');
    }
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
    if (e) e.preventDefault();
    setError('');
    setMessage('');

    try {
      const requiredFields = ['fullName', 'phone', 'farmName', 'farmAddress'];
      const missingFields = requiredFields.filter(field => !editedProfile[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const response = await api.updateProfile({
        ...editedProfile,
        userType: 'farmer'
      });

      if (response.success) {
        setProfile(editedProfile);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        
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

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
    setError('');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Farmer Profile</h1>
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
                value={editedProfile.fullName || profile.fullName || ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email || ''}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={editedProfile.phone || profile.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Farm Name</label>
              <input
                type="text"
                className="form-control"
                value={editedProfile.farmName || profile.farmName || ''}
                onChange={(e) => handleChange('farmName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Farm Address</label>
              <textarea
                className="form-control"
                value={editedProfile.farmAddress || profile.farmAddress || ''}
                onChange={(e) => handleChange('farmAddress', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="profile-actions">
            {isEditing && (
              <>
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
