import React, { Fragment, useState } from 'react';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { Meteor } from 'meteor/meteor';
import PasswordInput from './PasswordInput';

const DataTableContainer = ({ userList }) => {
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [clearSelection, setClearSelection] = useState(false);
  const [role, setRole] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [validation, setValidation] = useState('');
  const [formSelector, setFormSelector] = useState('');

  const columns = [
    {
      name: 'User',
      selector: 'emails[0].address',
      sortable: true,
    },
    {
      name: 'Role',
      selector: 'checkedRole',
      sortable: true,
      right: true,
      hide: 'md',
    },
    {
      name: 'Status',
      selector: 'profile.status',
      sortable: true,
      right: true,
      hide: 'md',
    },
    {
      name: 'Since',
      selector: 'createdAt',
      sortable: true,
      right: true,
      format: (row) => moment(row.createdAt).format('DD/MM/YYYY'),
      hide: 'md',
    },
  ];

  let tableData = {
    columns,
    data: userList,
  };

  // Handle every added item
  const handleChange = (e) => {
    setSelectedCount(e.selectedCount);
    setSelectedItems(e.selectedRows);
  };

  // Multiple changes of status
  const multipleChangeStatus = () => {
    selectedItems.forEach(async (item) => {
      await Meteor.call(
        'updateStatus',
        item._id,
        item.profile.status || 'undefined'
      );
    });
    setClearSelection(!clearSelection);
    setFormSelector('');
  };

  // Multiple changes of role
  const multipleRoleChange = () => {
    if (role === '') {
      setValidation('Please select a role');
      setInterval(() => {
        setValidation('');
      }, 5000);
    } else {
      selectedItems.forEach(async (item) => {
        await Meteor.call('updateRole', item._id, role);
      });
      setClearSelection(!clearSelection);
      setRole('');
      setFormSelector('');
    }
  };

  // Multiple changes of passwords
  const multiplePasswordChange = () => {
    if (adminPassword === '' || newPassword === '') {
      setValidation('Please complete all the fields');
      setInterval(() => {
        setValidation('');
      }, 5000);
    } else {
      selectedItems.forEach(async (item) => {
        await Meteor.call(
          'updatePassword',
          item._id,
          adminPassword,
          newPassword,
          (error) => {
            if (error && error.error === 'update-password') {
              setValidation(error.reason);
              setInterval(() => {
                setValidation('');
              }, 5000);
            } else {
              setAdminPassword('');
              setNewPassword('');
              setFormSelector('');
              setClearSelection(!clearSelection);
            }
          }
        );
      });
    }
  };

  return (
    <Fragment>
      <DataTable
        noHeader
        data={userList}
        columns={columns}
        title='Messages'
        highlightOnHover={true}
        keyField={'_id'}
        pagination={true}
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20, 25, 30]}
        selectableRows={true}
        selectableRowsHighlight={true}
        onSelectedRowsChange={handleChange}
        clearSelectedRows={clearSelection}
      />
      {selectedCount > 0 ? (
        <Fragment>
          <form className='form-inline'>
            <div className='form-group mx-sm-3 mb-2'>
              <select
                className='custom-select'
                value={formSelector}
                onChange={(e) => setFormSelector(e.target.value)}
              >
                <option value='' style={{ display: 'none' }}>
                  Choose action...
                </option>
                <option value='statusChange'>Change Status</option>
                <option value='rolesChange'>Change Roles</option>
                <option value='passwordsChange'>Change passwords</option>
              </select>
            </div>
            <div className='form-group mx-sm-3 mb-2 text-secondary'>|</div>
            {formSelector === 'statusChange' && (
              <Fragment>
                <div className='form-group mx-sm-3 mb-2'>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={multipleChangeStatus}
                  >
                    Change Status
                  </button>
                </div>
                <div className='form-group mx-sm-3 mb-2 text-secondary'>|</div>
              </Fragment>
            )}

            {formSelector === 'rolesChange' && (
              <Fragment>
                <div className='form-group mx-sm-3 mb-2'>
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
                  <small className='text-danger ml-2'>{validation}</small>
                </div>
                <div className='form-group mx-sm-3 mb-2 text-secondary'>|</div>
                <div className='form-group mx-sm-3 mb-2'>
                  <button
                    type='button'
                    className='btn btn-info'
                    onClick={multipleRoleChange}
                  >
                    Change Role
                  </button>
                </div>
              </Fragment>
            )}

            {formSelector === 'passwordsChange' && (
              <Fragment>
                <div className='form-group mx-sm-3 mb-2'>
                  {/* <div className='input-group'>
                    <input
                      type='password'
                      className='form-control'
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder='Admin Password'
                    ></input>
                    <div className='input-group-append'>
                      <span className='input-group-text'>
                        <EyeSlashFill />
                      </span>
                    </div>
                  </div> */}
                  <PasswordInput
                    value={adminPassword}
                    setValue={setAdminPassword}
                    placeholder={'Admin Password'}
                  />
                </div>
                <div className='form-group mx-sm-3 mb-2 text-secondary'>|</div>
                <div className='form-group mx-sm-3 mb-2'>
                  {/* <div className='input-group'>
                    <input
                      type='password'
                      className='form-control'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder='New Password'
                    ></input>
                    <div className='input-group-append'>
                      <span className='input-group-text'>
                        <EyeSlashFill />
                      </span>
                    </div>
                  </div> */}
                  <PasswordInput
                    value={newPassword}
                    setValue={setNewPassword}
                    placeholder={'New Password'}
                  />
                </div>
                <div className='form-group mx-sm-3 mb-2 text-secondary'>|</div>
                <div className='form-group mx-sm-3 mb-2'>
                  <button
                    type='button'
                    className='btn btn-info'
                    onClick={multiplePasswordChange}
                  >
                    Change Password
                  </button>
                </div>
                <small className='text-danger ml-2'>{validation}</small>
              </Fragment>
            )}
          </form>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default DataTableContainer;
