export const ROLE_MATRIX = {
  SRE: {
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

  Dev: {
    view_logs: true,
    view_clusters: false,

    manage_incidents: {
      create: true,
      read: true,
      update: true,
      delete: false
    }
  },

  QA: {
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
