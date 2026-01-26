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
  },
} as const;
