import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const closeIcon = '/x-button.png';
const supportIcon = '/support.png';
import { IconButton } from '@neo4j-ndl/react';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { filesToBase64 } from '../../utils/shareUtils';

const Feedback = () => {
  const [showModal, setShowModal] = useState(false);
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; description?: string }>({
    name: undefined,
    email: undefined,
    description: undefined,
  });
  const modalRef = useRef(null);
  const TIMEOUT_DURATION = 1000;
  const MAX_DESCRIPTION_LENGTH = 500;
  const mode = process.env.NODE_ENV;

  let dbQueryUrl = '';
  if (mode == 'development') {
    dbQueryUrl = 'https://updpath-dev.dvb.corpinter.net/oupt/api';
  } else if (mode == 'production') {
    dbQueryUrl = 'https://updpath.dvb.corpinter.net/oupt/api';
  } else {
    dbQueryUrl = 'http://localhost:8080/oupt/api';
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      setEmailStatus('Fetching data from profile...');
      try {
        const userInfo = await axios.get(`${dbQueryUrl}/v1/userInfo`);
        if (userInfo && userInfo.data.email && userInfo.data.email.length > 0) {
          setReporterEmail(userInfo.data.email);
          setReporterName(userInfo.data.userName);
          setEmailStatus('Email autofilled from profile.');
        } else {
          throw new Error('Email not found');
        }
      } catch {
        setEmailStatus('Failed to get your email. Please enter manually.');
      }
    };
    fetchUserInfo();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleOutsideClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      closeModal();
    }
  };

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const resetForm = () => {
    setReporterName('');
    setReporterEmail('');
    setEmailStatus('');
    setDescription('');
    setAttachments(null);
    setIsError(false);
    setIsSuccess(false);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
      newErrors.email = 'Invalid email address';
    }
    if (!description.trim()) {
      newErrors.description = 'Description should not be empty';
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const reporterContact = {
          email: reporterEmail,
          name: reporterName,
        };
        const emailRecipient = {
          email: 'harman.matapathi@mercedes-benz.com',
          name: 'Jochen',
        };
        const base64EncodedFiles = attachments ? await filesToBase64(attachments) : null;
        const requestBody = {
          contact: reporterContact,
          emailRecipient: emailRecipient,
          description: description,
          attachments: base64EncodedFiles,
        };

        await axios
          .post(`${dbQueryUrl}/v1/send-feedback`, requestBody, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            resetForm();
            setIsSuccess(true);
          })
          .catch((err) => {
            console.error('Unable to submit feedback: ', err);
            setIsError(true);
          });
        closeModal();
      } catch (error) {
        console.error('Unable to submit feedback: ', error);
        setIsError(true);
      }
    }
  };

  return (
    <>
      <Tooltip title={'Report a bug/share feedback'} aria-label='Report a bug/share feedback' disableInteractive>
        <IconButton
          onClick={openModal}
          aria-label={'Report a bug/share feedback'}
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
        >
          <img src={supportIcon} alt='close icon' style={{ width: 20, height: 20 }} />
        </IconButton>
      </Tooltip>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSuccess}
        autoHideDuration={TIMEOUT_DURATION}
        onClose={() => setIsSuccess(false)}
      >
        <Alert severity='success' variant='filled' sx={{ width: '100%' }}>
          Feedback submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isError}
        autoHideDuration={TIMEOUT_DURATION}
        onClose={() => setIsError(false)}
      >
        <Alert severity='error' variant='filled' sx={{ width: '100%' }}>
          Feedback submission failed. Please try again.
        </Alert>
      </Snackbar>

      <div className={`modal${showModal ? ' is-active' : ''}`} ref={modalRef} onClick={handleOutsideClick}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div className='modal-close-wrapper' onClick={closeModal}>
            <img className='modal-closed' src={closeIcon} alt='close icon' />
          </div>

          <h4 className='modal-title'>Report a Bug / Share Feedback</h4>
          <hr />
          <br />

          <form onSubmit={submitFeedback} noValidate>
            <label>
              Reporter Name
              <input
                type='text'
                className='input-style'
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder='John'
                required
              />
              {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </label>
            <label>
              Reporter Email
              <input
                type='email'
                className='input-style'
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder='your.email@example.com'
                required
              />
              {emailStatus && <small style={{ color: 'lightgray' }}>{emailStatus}</small>}
            </label>

            <label style={{ marginTop: '1em' }}>
              Description
              <textarea
                className='input-style'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder='Provide detailed info about the issue including issue description, relavant links, steps to reproduce.'
                required
              ></textarea>
              {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
            </label>

            <label
              style={{
                marginTop: '1em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Attach screenshot
              <input type='file' onChange={handleFileChange} multiple />
            </label>

            <div
              className='btn'
              style={{
                marginTop: '2em',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1em',
              }}
            >
              <button className='cancel' style={{ padding: '10px 24px' }} type='button' onClick={closeModal}>
                Cancel
              </button>
              <button style={{ padding: '10px 24px' }} type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Feedback;
