export const TRANSLATION_KEYS = {
  common: {
    actions: {
      save: "common.actions.save",
      cancel: "common.actions.cancel",
      delete: "common.actions.delete",
      edit: "common.actions.edit",
      create: "common.actions.create",
      publish: "common.actions.publish",
      draft: "common.actions.draft",
      search: "common.actions.search",
      filter: "common.actions.filter",
      export: "common.actions.export",
      import: "common.actions.import",
    },
  },

  navigation: {
    user: "navigation.User",
    role: "navigation.Role",
  },

  navbar: {
    profileMenu: {
      profile: "navbar.profileMenu.profile",
      settingAndSecurity: {
        value: "navbar.profileMenu.settingAndSecurity.value",
        changePassword: "navbar.profileMenu.settingAndSecurity.changePassword",
      },
      logout: "navbar.profileMenu.Logout",
    },
  },

  footer: {
    builtBy: "footer.builtBy",
  },

  login: {
    title: "login.title",
    form: {
      identifier: "login.form.identifier",
      password: "login.form.password",
    },
    button: {
      signin: "login.button.signin",
    },
    link: {
      forgotPassword: "login.link.forgotPassword",
    },
    errors: {
      identifier: {
        required: "login.errors.identifier.required",
        invalid: "login.errors.identifier.invalid",
      },
      password: {
        required: "login.errors.password.required",
      },
    },
  },

  forgotPassword: {
    title: "forgotPassword.title",
    description: "forgotPassword.description",
    form: {
      email: "forgotPassword.form.email",
    },
    button: {
      send: "forgotPassword.button.send",
    },
  },

  resetPassword: {
    title: "resetPassword.title",
    form: {
      newPassword: "resetPassword.form.newPassword",
      confirmPassword: "resetPassword.form.confirmPassword",
    },
    button: {
      send: "resetPassword.button.send",
    },
    errors: {
      password: {
        required: "resetPassword.errors.password.required",
        invalid: "resetPassword.errors.password.invalid",
      },
      confirmPassword: {
        required: "resetPassword.errors.confirmPassword.required",
        invalid: "resetPassword.errors.confirmPassword.invalid",
        notMatch: "resetPassword.errors.confirmPassword.notMatch",
      },
    },
  },
  profile: {
    title: "profile.title",
    form: {
      firstName: "profile.form.firstName",
      lastName: "profile.form.lastName",
      email: "profile.form.email",
      phoneNumber: "profile.form.phoneNumber",
      dateOfBirth: "profile.form.dateOfBirth",
      gender: "profile.form.gender",
    },
    gender: {
      male: "profile.gender.male",
      female: "profile.gender.female",
      other: "profile.gender.other",
    },
  },
  changePassword: {
    title: "changePassword.title",
    form: {
      currentPassword: "changePassword.form.currentPassword",
      newPassword: "changePassword.form.newPassword",
      confirmPassword: "changePassword.form.confirmPassword",
    },
    errors: {
      currentPassword: {
        required: "changePassword.errors.currentPassword.required",
      },
    },
  },
  user: {
    errors: {
      firstName: {
        required: "user.errors.firstName.required",
        tooLong: "user.errors.firstName.tooLong",
      },
      lastName: {
        required: "user.errors.lastName.required",
        tooLong: "user.errors.lastName.tooLong",
      },
      email: {
        required: "user.errors.email.required",
        invalid: "user.errors.email.invalid",
      },
      phoneNumber: {
        invalidLength: "user.errors.phoneNumber.invalidLength",
      },
      dateOfBirth: {
        invalid: "user.errors.dateOfBirth.invalid",
        future: "user.errors.dateOfBirth.future",
      },
      username: {
        required: "user.errors.username.required",
        invalid: "user.errors.username.invalid",
      },
      password: {
        required: "user.errors.password.required",
        invalid: "user.errors.password.invalid",
      },
      gender: {
        required: "user.errors.gender.required",
        invalid: "user.errors.gender.invalid",
      },
    },
  },
} as const;
