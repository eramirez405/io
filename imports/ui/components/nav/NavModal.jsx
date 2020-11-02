import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FiBatteryCharging, FiUsers, FiSliders, FiPower, FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

const customStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgb(64 64 64 / 75%)',
  },
  content: {
    margin: '50px 0px 20px',
    width: '400px',
    position: 'unset',
    height: 'max-content',
    background: '#000000c4',
    borderRadius: '1rem',
    border: '0px',
  },
};

const NavModal = (props) => {
  const { isOpen, onRequestClose, pathname } = props;

  return (
    <Modal
      isOpen={isOpen}
      {...props}
      style={customStyles}
      ariaHideApp={false}
      contentLabel='Edit Admin Account'
      onRequestClose={() => onRequestClose()}
    >
      <Wrapper>
        <div
          style={{
            display: 'flex',
            padding: '20px 30px',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div className='row'>
            <Link
              to={'/'}
              className='col text-center hoverButton'
              style={
                pathname === '/'
                  ? { display: 'none' }
                  : { borderRight: '2px solid white', cursor: 'pointer' }
              }
            >
              <FiSliders size={40} color='#70EC1A' />
            </Link>
            <Link
              to={'/trent'}
              className='col text-center hoverButton'
              style={
                pathname === '/trent'
                  ? { display: 'none' }
                  : { borderRight: '2px solid white', cursor: 'pointer' }
              }
            >
              <FiBatteryCharging size={40} color='#70EC1A' />
            </Link>
            <Link
              to={'/alarmHistory'}
              className='col text-center hoverButton'
              style={
                pathname === '/alarmHistory'
                  ? { display: 'none' }
                  : { borderRight: '2px solid white', cursor: 'pointer' }
              }
            >
              <FiBell size={40} color='#70EC1A' />
            </Link>
            {Roles.userIsInRole(Meteor.userId(), 'admin') && (
              <Link
                to={'/userManagement'}
                className='col text-center hoverButton'
                style={
                  pathname === '/userManagement'
                    ? { display: 'none' }
                    : { borderRight: '2px solid white', cursor: 'pointer' }
                }
              >
                <FiUsers size={40} color='#70EC1A' />
              </Link>
            )}

            <div
              className='col text-center hoverButton'
              style={{ cursor: 'pointer' }}
              onClick={() => Meteor.logout()}
            >
              <FiPower size={40} color='#70EC1A' />
            </div>
          </div>
        </div>
      </Wrapper>
    </Modal>
  );
};

export default NavModal;

const Wrapper = styled.div`
  .hoverButton > :hover {
    background: #00000085;
    border-radius: 5px;
    padding: 10px;
    transform: scale(1.5);
  }
`;
