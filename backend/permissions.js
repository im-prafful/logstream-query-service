export const ROLE_MATRIX = {
  sre: {
    view_logs: true,
    view_clusters: true,

    manage_incidents: {
      create: true,
      read: true,
      update: true
    },

    manage_alerts: true
  },

  dev: {
    view_logs: true,
    view_clusters: false,

    manage_incidents: {
      create: true,
      read: true,
      update: true
    }
  },

  qa: {
    view_logs: true,
    view_clusters: false,

    manage_incidents: {
      create: true,
      read: true,
      update: true
    }
  }
};
