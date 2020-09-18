import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PasswordInput from '../userManagement/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setValidation('Please Complete All Fields!');
    } else {
      Meteor.loginWithPassword(email.trim(), password.trim(), function (error) {
        if (error) {
          //console.log(error);
          if (error.error === 403) {
            setValidation('Incorrect Credentials or Inactive');
          } else {
            setValidation('Internal Error While Logging in!');
          }
        }
      });
    }
  };

  return (
    <div
      style={{
        background: '#f5a423d4',
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 col-sm-12 mx-auto'>
            <div className='card mx-auto mt-4'>
              <div className='card-body'>
                <h5 className='card-title'>Login</h5>
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

                  <button type='submit' className='btn btn-primary'>
                    Submit
                  </button>
                  <p>
                    <small className='text-danger'>{validation}</small>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
