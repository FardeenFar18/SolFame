import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [upload, setUpload] = useState({
    marriageMahalProfile: null,
    businessRegistration: null,
    tradeLicense: null,
    foodLicense: null,
    fireSafetyCertificate: null,
    healthSanitationLicense: null,
    gstRegistration: null,
    liquorLicense: null,
    pestControlCertificate: null,
  });

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    mahalName: '',
    mahalLocation: '',
    mahalCapacity: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    mahalName: Yup.string().required('Marriage Mahal Name is required'),
    mahalLocation: Yup.string().required('Marriage Mahal Location is required'),
    mahalCapacity: Yup.number().positive('Capacity must be a positive number').required('Capacity is required'),
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setUpload((prev) => ({ ...prev, [field]: file }));
  };

  const handleRegisterSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('mahalName', values.mahalName);
      formData.append('mahalLocation', values.mahalLocation);
      formData.append('mahalCapacity', values.mahalCapacity);

      Object.keys(upload).forEach((field) => {
        if (upload[field]) {
          formData.append(field, upload[field]);
        }
      });

      const fileUploadResponse = await axios.post('http://localhost:5002/api/upload-file', formData, {
        timeout: 5000,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (fileUploadResponse.status === 200) {
        const fileId = fileUploadResponse.data.fileId;

        const registrationData = {
          email: values.email,
          password: values.password,
          mahalName: values.mahalName,
          mahalLocation: values.mahalLocation,
          mahalCapacity: values.mahalCapacity,
          fileId,
        };

        const registerResponse = await axios.post('http://localhost:5001/auth/register', registrationData);

        if (registerResponse.status === 201) {
          alert('Registration successful');
          window.location.reload();
        } else {
          setStatus({ error: 'Registration failed.' });
        }
      } else {
        setStatus({ error: 'File upload failed.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ error: 'An error occurred.' });
    }
  };

  return (
    <div className="register-container">
      <h2 className="heading">Register Marriage Mahal</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegisterSubmit}
      >
        {({ values, isSubmitting, status, touched, errors }) => (
          <Form className="register-form">
            {status?.error && <p className="error-message">{status.error}</p>}
            {status?.success && <p className="success-message">{status.success}</p>}

            {/* Owner Information */}
            <div className="section">
              <h3 className="section-heading">Owner Information</h3>

              <div className="input-group">
                <label htmlFor="email" className="input-label">Owner Email:</label>
                <Field name="email" type="email" placeholder="Owner Email" className="input" id="email" />
                {touched.email && errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">Password:</label>
                <Field name="password" type="password" placeholder="Password" className="input" id="password" />
                {touched.password && errors.password && <div className="error-text">{errors.password}</div>}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm Password:</label>
                <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="input" id="confirmPassword" />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="error-text">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            {/* Marriage Mahal Information */}
            <div className="section">
              <h3 className="section-heading">Marriage Mahal Information</h3>

              <div className="input-group">
                <label htmlFor="mahalName" className="input-label">Marriage Mahal Name:</label>
                <Field name="mahalName" type="text" placeholder="Marriage Mahal Name" className="input" id="mahalName" />
                {touched.mahalName && errors.mahalName && <div className="error-text">{errors.mahalName}</div>}
              </div>

              <div className="input-group">
                <label htmlFor="mahalLocation" className="input-label">Marriage Mahal Location:</label>
                <Field name="mahalLocation" type="text" placeholder="Marriage Mahal Location" className="input" id="mahalLocation" />
                {touched.mahalLocation && errors.mahalLocation && (
                  <div className="error-text">{errors.mahalLocation}</div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="mahalCapacity" className="input-label">Marriage Mahal Capacity:</label>
                <Field name="mahalCapacity" type="number" placeholder="Marriage Mahal Capacity" className="input" id="mahalCapacity" />
                {touched.mahalCapacity && errors.mahalCapacity && (
                  <div className="error-text">{errors.mahalCapacity}</div>
                )}
              </div>

              {/* File Upload for Marriage Mahal Profile */}
              <div className="file-upload-group">
                <label htmlFor="marriageMahalProfile" className="file-upload-label">Marriage Mahal Profile:</label>
                <input
                  type="file"
                  className="file-upload-input"
                  onChange={(e) => handleFileChange(e, 'marriageMahalProfile')}
                  id="marriageMahalProfile"
                />
                {upload.marriageMahalProfile && (
                  <p className="file-selected-text">File selected: {upload.marriageMahalProfile.name}</p>
                )}
              </div>

              {/* File Upload for Required Certificates */}
              {[
                'tradeLicense',
                'foodLicense',
                'fireSafetyCertificate',
                'healthSanitationLicense',
                'gstRegistration',
                'liquorLicense',
                'pestControlCertificate',
              ].map((field) => (
                <div key={field} className="file-upload-group">
                  <label htmlFor={field} className="file-upload-label">
                    {field.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                  </label>
                  <input
                    type="file"
                    className="file-upload-input"
                    onChange={(e) => handleFileChange(e, field)}
                    id={field}
                  />
                  {upload[field] && (
                    <p className="file-selected-text">File selected: {upload[field].name}</p>
                  )}
                </div>
              ))}

              <button type="submit7" className="submit-button" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
