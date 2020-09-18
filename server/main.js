import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../imports/api/historic';

Meteor.publish(null, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.roleAssignment.find({});
  } else if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready();
  }
});

Meteor.publish('userList', function () {
  return Meteor.users.find({}, { fields: { services: 0 } });
});

Accounts.config({
  loginExpirationInDays: 1,
});

if (Meteor.users.find().count() === 0) {
  console.log('first user created');
  Roles.createRole('admin', { unlessExists: true });
  var id;

  id = Accounts.createUser({
    email: 'admin@admin.com',
    password: 'admin',
    profile: {
      status: 'active',
    },
  });
  Roles.addUsersToRoles(id, ['admin']);
}

Accounts.validateLoginAttempt(function (attempt) {
  if (
    !!attempt.user.profile.status &&
    attempt.user.profile.status === 'active'
  ) {
    return true;
  } else {
    console.log('inactive');
    attempt.allowed = false;
    throw new Meteor.Error(403, 'User account is inactive!');
  }
});

Meteor.methods({
  createAccount: (user) => {
    try {
      Roles.createRole(user.role, { unlessExists: true });
      id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          status: 'active',
        },
      });
      Roles.addUsersToRoles(id, [user.role]);
    } catch (err) {
      throw err;
    }

    return id;
  },
  updateRole: function (targetUserId, role) {
    check(targetUserId, String);
    check(role, String);
    Roles.setUserRoles(targetUserId, [role]);
  },
  updateStatus: function (targetUserId, status) {
    check(targetUserId, String);
    check(status, String);
    if (status === 'active') {
      Meteor.users.update(
        { _id: targetUserId },
        { $set: { 'profile.status': 'inactive' } }
      );
    } else {
      Meteor.users.update(
        { _id: targetUserId },
        { $set: { 'profile.status': 'active' } }
      );
    }
  },
  updatePassword: function (targetUserId, adminPassword, newPassword) {
    check(targetUserId, String);
    check(adminPassword, String);
    check(newPassword, String);

    if (adminPassword !== 'testpassword') {
      throw new Meteor.Error('update-password', 'Wrong Adming Password.');
    }

    if (newPassword.length < 8) {
      throw new Meteor.Error('update-password', 'New Password too short');
    }

    Accounts.setPassword(targetUserId, newPassword);
  },
});
