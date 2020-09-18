import React, { useState } from 'react';
import PasswordInput from '../userManagement/PasswordInput';
import moment from 'moment';
import NavModal from '../nav/NavModal';

const Register = ({ location: { pathname } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [validation, setValidation] = useState('');
  const [success, setSuccess] = useState('');
  const [navModalOpen, setNavModalOpen] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '' || role === '') {
      setValidation('Please Complete All Fields!');
    } else {
      Meteor.call(
        'createAccount',
        { email: email.trim(), password: password.trim(), role },
        function (error, result) {
          if (error) {
            setValidation(error.reason);
            setInterval(() => {
              setValidation('');
            }, 5000);
          }
          if (result) {
            setSuccess('User created');
            setEmail('');
            setPassword('');
            setRole('');
            setInterval(() => {
              setSuccess('');
            }, 3000);
          }
        }
      );
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
            <img
              src='plasticos.webp'
              alt='logo'
              style={{ width: '300px', padding: '15px', cursor: 'pointer' }}
              onClick={() => setNavModalOpen(true)}
            />
            <div style={{ textTransform: 'capitalize' }}>
              {moment().format('dddd, D MMMM YYYY, h:mm a')}
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row'>
          <div className='col-md-6 col-sm-12 mx-auto'>
            <div className='card mx-auto mt-4'>
              <div className='card-body'>
                <h5 className='card-title'>Register a new user</h5>
                <form onSubmit={onSubmit}>
                  <div className='form-group'>
                    <label htmlFor='email'>Email address</label>
                    <input
                      type='email'
                      className='form-control'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby='emailHelp'
                      placeholder='Enter email'
                    ></input>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <PasswordInput
                      value={password}
                      setValue={setPassword}
                      placeholder={'Password'}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='role'>Role</label>
                    <select
                      className='custom-select'
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value='' style={{ display: 'none' }}>
                        Choose a role...
                      </option>
                      <option value='admin'>Admin</option>
                      <option value='supervisor'>Supervisor</option>
                      <option value='user'>User</option>
                    </select>
                  </div>

                  <button type='submit' className='btn btn-primary'>
                    Submit
                  </button>
                  <p>
                    <small className='text-danger'>{validation}</small>
                    <small className='text-success'>{success}</small>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavModal
        isOpen={navModalOpen}
        onRequestClose={() => setNavModalOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default Register;
