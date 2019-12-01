import moment from 'moment';

export default class User {
  static userEnabled = {
    active: 1,
    disabled: 0
  };

  static userRole = {
    administrator: 99,
    staff: 50,
    user: 1
  };

  constructor({
    rowNum,
    id,
    username,
    firstName,
    lastName,
    email,
    confirmedAt,
    registrationIp,
    lastLoginAt,
    lastLoginIp,
    blockedAt,
    role,
    roleName,
    permissions,
    enabled,
    enabledName
  }) {
    this.rowNum = rowNum || null;
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.confirmedAt = confirmedAt;
    this.registrationIp = registrationIp;
    this.lastLoginAt = lastLoginAt;
    this.lastLoginIp = lastLoginIp;
    this.blockedAt = blockedAt;
    this.role = role;
    this.roleName = roleName;
    this.permissions = permissions;
    this.enabled = enabled;
    this.enabledName = enabledName;

    this.expand();
  }

  expand() {
    let confirmedAtFormatted = null;

    if (moment(this.confirmedAt).isValid()) {
      confirmedAtFormatted = moment(this.confirmedAt).from();
    } else {
      confirmedAtFormatted = null;
    }
    this.confirmedAtFormatted = confirmedAtFormatted;

    let lastLoginAtFormatted = null;

    if (moment(this.lastLoginAt).isValid()) {
      lastLoginAtFormatted = moment(this.lastLoginAt).from();
    } else {
      lastLoginAtFormatted = null;
    }

    this.lastLoginAtFormatted = lastLoginAtFormatted;

    let blockedAtFormatted = null;

    if (moment(this.blockedAt).isValid()) {
      blockedAtFormatted = moment(this.blockedAt).from();
    } else {
      blockedAtFormatted = null;
    }

    this.blockedAtFormatted = blockedAtFormatted;
  }

  get fullName() {
    return `${this.firstName}, ${this.lastName}`;
  }
}
