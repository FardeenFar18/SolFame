import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

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
  const [filer, setFiler] = useState(null);

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
      // Create FormData object
      const formData = new FormData();
      const fileIds = [];

      // Append form data
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('mahalName', values.mahalName);
      formData.append('mahalLocation', values.mahalLocation);
      formData.append('mahalCapacity', values.mahalCapacity);

      // Append uploaded files to FormData
      Object.keys(upload).forEach((field) => {
        if (upload[field]) {
          formData.append(field, upload[field]);
        }
      });

      // First, send the files for upload
      const fileDataResponse = await axios.post('http://localhost:5002/api/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (fileDataResponse.status === 200) {
        console.log('File data submitted successfully.',fileDataResponse.data);
        fileDataResponse.data.fileIds.forEach(fileId => fileIds.push(fileId));
        console.log("73",fileDataResponse.data.fileIds);
      } else {
        console.error('File data submission failed');
        setStatus({ error: 'File upload failed.' });
        return;
      }

      // Submit the rest of the form data including fileIds
      const textData = {
        email: values.email,
        password: values.password,
        mahalName: values.mahalName,
        mahalLocation: values.mahalLocation,
        mahalCapacity: values.mahalCapacity,
        fileIds: values.fileIds,
      };
      console.log('88',textData);

      const textDataResponse = await axios.post('http://localhost:5001/auth/register', textData);

      if (textDataResponse.status === 200) {
        console.log('Text data submitted successfully. ID:', textDataResponse.data.id);
        alert('Form submitted successfully.');
      } else {
        console.error('Text data submission failed');
        setStatus({ error: 'Form submission failed.' });
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setStatus({ error: 'An error occurred.' });
    }
  };

  return (
    <div>
      <h2>Register Marriage Mahal</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegisterSubmit}
      >
        {({ values, isSubmitting, status, touched, errors, setFieldValue }) => (
          <Form>
            {status?.error && <p style={{ color: 'red' }}>{status.error}</p>}
            {status?.success && <p style={{ color: 'green' }}>{status.success}</p>}

            {/* Owner Information */}
            <div>
              <h3>Owner Information</h3>
              <div>
                <Field name="email" type="email" placeholder="Owner Email" />
                {touched.email && errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
              </div>
              <div>
                <Field name="password" type="password" placeholder="Password" />
                {touched.password && errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
              </div>
              <div>
                <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div style={{ color: 'red' }}>{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            {/* Marriage Mahal Information */}
            <div>
              <div>
                <Field name="mahalName" type="text" placeholder="Marriage Mahal Name" />
                {touched.mahalName && errors.mahalName && <div style={{ color: 'red' }}>{errors.mahalName}</div>}
              </div>
              <div>
                <Field name="mahalLocation" type="text" placeholder="Marriage Mahal Location" />
                {touched.mahalLocation && errors.mahalLocation && (
                  <div style={{ color: 'red' }}>{errors.mahalLocation}</div>
                )}
              </div>
              <div>
                <Field name="mahalCapacity" type="number" placeholder="Marriage Mahal Capacity" />
                {touched.mahalCapacity && errors.mahalCapacity && (
                  <div style={{ color: 'red' }}>{errors.mahalCapacity}</div>
                )}
              </div>

              {/* File Upload for Marriage Mahal Profile */}
              <div>
                <label>Marriage Mahal Profile:</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'marriageMahalProfile')}
                />
                {upload.marriageMahalProfile && (
                  <p>File selected: {upload.marriageMahalProfile.name}</p>
                )}
              </div>

              {/* File Upload for required certificates */}
              {[
                'tradeLicense',
                'foodLicense',
                'fireSafetyCertificate',
                'healthSanitationLicense',
                'gstRegistration',
                'liquorLicense',
                'pestControlCertificate',
              ].map((field) => (
                <div key={field}>
                  <label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </div>
              ))}

              <button type="submit" disabled={isSubmitting}>
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
