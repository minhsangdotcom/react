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
      upload: "common.actions.upload",
    },
    notification: {
      action: {
        success: {
          create: "common.notification.action.success.create",
          update: "common.notification.action.success.update",
        },
      },
    },
    table: {
      toolbar: {
        search: {
          placeholder: "common.table.toolbar.search.placeholder",
        },
        filter: {
          label: "common.table.toolbar.filter.label",
          column: {
            placeholder: "common.table.toolbar.filter.column.placeholder",
          },
          value: {
            placeholder: "common.table.toolbar.filter.value.placeholder",
          },
          suggestion: {
            byValue: "common.table.toolbar.filter.suggestion.byValue",
          },
          fields: {
            searchPlaceholder:
              "common.table.toolbar.filter.fields.searchPlaceholder",
          },
          operators: {
            iLike: "common.table.toolbar.filter.operators.iLike",
            notILike: "common.table.toolbar.filter.operators.notILike",
            eq: "common.table.toolbar.filter.operators.eq",
            ne: "common.table.toolbar.filter.operators.ne",
            lt: "common.table.toolbar.filter.operators.lt",
            lte: "common.table.toolbar.filter.operators.lte",
            gt: "common.table.toolbar.filter.operators.gt",
            gte: "common.table.toolbar.filter.operators.gte",
            isBetween: "common.table.toolbar.filter.operators.isBetween",
            isEmpty: "common.table.toolbar.filter.operators.isEmpty",
            isNotEmpty: "common.table.toolbar.filter.operators.isNotEmpty",
            isRelativeToToday:
              "common.table.toolbar.filter.operators.isRelativeToToday",
            isArray: "common.table.toolbar.filter.operators.isArray",
            notInArray: "common.table.toolbar.filter.operators.notInArray",
          },
          options: {
            placeholder: "common.table.toolbar.filter.options.placeholder",
          },
          join: {
            and: "common.table.toolbar.filter.join.and",
            or: "common.table.toolbar.filter.join.or",
          },
        },
        sort: {
          label: "common.table.toolbar.sort.label",
          title: {
            hasSort: {
              text: "common.table.toolbar.sort.title.hasSort.text",
            },
            noSort: {
              text: "common.table.toolbar.sort.title.noSort.text",
              description: "common.table.toolbar.sort.title.noSort.description",
            },
          },
          field: {
            label: "common.table.toolbar.sort.field.label",
          },
          direction: {
            asc: "common.table.toolbar.sort.direction.asc",
            desc: "common.table.toolbar.sort.direction.desc",
          },
          actions: {
            add: "common.table.toolbar.sort.actions.add",
            reset: "common.table.toolbar.sort.actions.reset",
            remove: "common.table.toolbar.sort.actions.remove",
          },
        },
        view: {
          label: "common.table.toolbar.view.label",
          placeholder: "common.table.toolbar.view.placeholder",
        },
      },
      fields: {
        createdAt: "common.table.fields.createdAt",
      },
      actions: {
        hide: "common.table.actions.hide",
      },
      selection: {
        count: "common.table.selection.count",
      },
      pagination: {
        rowsPerPage: "common.table.pagination.rowsPerPage",
        pageOf: "common.table.pagination.pageOf",
      },
      noContent: "common.table.noContent",
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
    entity: "user.entity",
    title: "user.title",
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
    modal: {
      create: {
        title: "user.modal.create.title",
      },
      update: {
        title: "user.modal.update.title",
      },
    },
    form: {
      fields: {
        firstName: {
          label: "user.form.fields.firstName.label",
          placeholder: "user.form.fields.firstName.placeholder",
        },
        lastName: {
          label: "user.form.fields.lastName.label",
          placeholder: "user.form.fields.lastName.placeholder",
        },
        email: {
          label: "user.form.fields.email.label",
          placeholder: "user.form.fields.email.placeholder",
        },
        phoneNumber: {
          label: "user.form.fields.phoneNumber.label",
          placeholder: "user.form.fields.phoneNumber.placeholder",
        },
        username: {
          label: "user.form.fields.username.label",
          placeholder: "user.form.fields.username.placeholder",
        },
        password: {
          label: "user.form.fields.password.label",
          placeholder: "user.form.fields.password.placeholder",
        },
        dateOfBirth: {
          label: "user.form.fields.dateOfBirth.label",
          placeholder: "user.form.fields.dateOfBirth.placeholder",
        },
        gender: {
          label: "user.form.fields.gender.label",
          placeholder: "user.form.fields.gender.placeholder",
        },
        roles: {
          label: "user.form.fields.roles.label",
          description: "user.form.fields.roles.description",
        },
        permissions: {
          label: "user.form.fields.permissions.label",
          description: "user.form.fields.permissions.description",
        },
        avatar: {
          label: "user.form.fields.avatar.label",
          description: "user.form.fields.avatar.description",
          button: {
            label: "user.form.fields.avatar.button.label",
          },
        },
        status: {
          label: "user.form.fields.status.label",
        },
      },
      sections: {
        contactAndAccount: "user.form.sections.contactAndAccount",
        accessControl: "user.form.sections.accessControl",
      },
    },
    table: {
      filter: {
        items: {
          username: {
            label: "user.table.filter.items.username.label",
            placeholder: "user.table.filter.items.username.placeholder",
          },
          fullName: {
            label: "user.table.filter.items.fullName.label",
            placeholder: "user.table.filter.items.fullName.placeholder",
          },
          email: {
            label: "user.table.filter.items.email.label",
            placeholder: "user.table.filter.items.email.placeholder",
          },
          phoneNumber: {
            label: "user.table.filter.items.phoneNumber.label",
            placeholder: "user.table.filter.items.phoneNumber.placeholder",
          },
          dateOfBirth: {
            label: "user.table.filter.items.dateOfBirth.label",
            placeholder: "user.table.filter.items.dateOfBirth.placeholder",
          },
          status: {
            label: "user.table.filter.items.status.label",
            placeholder: "user.table.filter.items.status.placeholder",
          },
        },
      },
      fields: {
        username: "user.table.fields.username",
        fullName: "user.table.fields.fullName",
        email: "user.table.fields.email",
        phoneNumber: "user.table.fields.phoneNumber",
        dateOfBirth: "user.table.fields.dateOfBirth",
        status: "user.table.fields.status",
      },
    },
    status: {
      active: "user.status.active",
      inactive: "user.status.inactive",
    },
  },
  role: {
    entity: "role.entity",
    title: "role.title",
    table: {
      fields: {
        name: "role.table.fields.name",
        description: "role.table.fields.description",
      },
    },
    modal: {
      create: {
        title: "role.modal.create.title",
      },
      update: {
        title: "role.modal.update.title",
      },
    },
    form: {
      fields: {
        name: {
          label: "role.form.fields.name.label",
          placeholder: "role.form.fields.name.placeholder",
        },
        description: {
          label: "role.form.fields.description.label",
          placeholder: "role.form.fields.description.placeholder",
        },
      },
      sections: {
        permission: {
          label: "role.form.sections.permission.label",
        },
      },
    },
    errors: {
      name: {
        required: "role.errors.name.required",
        tooLong: "role.errors.name.tooLong",
      },
      description: {
        tooLong: "role.errors.description.tooLong",
      },
    },
  },
} as const;
