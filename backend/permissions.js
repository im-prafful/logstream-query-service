export const ROLE_MATRIX = {
  sre: {
    view_logs: true,
    view_clusters: true,

    manage_incidents: {
      create: true,
      read: true,
      update: true,
      delete: true
    },

    manage_alerts: true
  },

  dev: {
    view_logs: true,
    view_clusters: false,

    manage_incidents: {
      create: true,
      read: true,
      update: true,
      delete: false
    }
  },

  qa: {
    view_logs: true,
    view_clusters: false,

    manage_incidents: {
      create: true,
      read: true,
      update: true,
      delete: false
    }
  }
};
