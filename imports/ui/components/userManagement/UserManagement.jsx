import React, { useState } from 'react';
import DataTableContainer from './DataTableContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import NavModal from '../nav/NavModal';
import moment from 'moment';

const UserManagement = ({ location: { pathname } }) => {
  const [navModalOpen, setNavModalOpen] = useState(false);

  const Loading = useTracker(() => {
    const handle = Meteor.subscribe('userList');
    return !handle.ready();
  }, []);

  const userList = useTracker(() => Meteor.users.find({}).fetch(), []);

  const userList2 = [];

  for (let i = 0; i < userList.length; i++) {
    const item = { ...userList[i] };
    if (Roles.userIsInRole(item, 'admin')) {
      item.checkedRole = 'admin';
    } else if (Roles.userIsInRole(item, 'supervisor')) {
      item.checkedRole = 'supervisor';
    } else if (Roles.userIsInRole(item, 'user')) {
      item.checkedRole = 'user';
    } else {
      item.checkedRole = 'undefined';
    }

    if (!item.profile) {
      item.profile = {
        status: 'undefined',
      };
    }
    userList2.push(item);
  }

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
        <div className='card mx-auto mt-4' style={{ height: '30rem' }}>
          <div className='card-body' style={{ overflow: 'auto' }}>
            <h5 className='card-title'>
              Users Management
              <Link
                to='/register'
                style={{ float: 'right', marginRight: '27px' }}
              >
                <FiUserPlus />
              </Link>
            </h5>

            <DataTableContainer userList={userList2} />
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

export default UserManagement;
