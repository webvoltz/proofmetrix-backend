const API_V = "v1";
require("dotenv").config();

const CONSTANT_ROUTES = {
  CHATGPT: {
    SAMPLE: `/${API_V}/chat-gpt/find-data`,
    GENERATE_CONTENT: { POST: `/${API_V}/chat-gpt/generate-content` },
    LIST_GENERATED_CONTENT: { GET: `/${API_V}/chat-gpt/list-generated-content` },
    VIEW_GENERATED_CONTENT: { GET: `/${API_V}/chat-gpt/view-generated-content/:id` }
  },
  ADMIN: {
    CREATE: `/${API_V}/admin/create`,
    LOGIN: `/${API_V}/admin/login`,
    LOG_IN_AS_USER: `/${API_V}/admin/login-asuser`,
    FORGOT_PASSWORD: `/${API_V}/admin/forgot-password`,
    RESET_PASSWORD: `/${API_V}/admin/reset-password`,
    VERIFY_KEY: {
      FORGOT_KEY: `/${API_V}/admin/verify-key/:key`,
    },
    CHANGE_PASSWORD: `/${API_V}/admin/change-password/:userId`,
    USER_MANAGEMENT: {
      ADD: `/${API_V}/admin/user-management/add`,
      VERIFY_API: `/${API_V}/admin/user-management/verify-key/:key`,
      ARCHIVE_USER: `/${API_V}/admin/user-management/archive-user/:id`,
      UNARCHIVE_USER: `/${API_V}/admin/user-management/unarchive-user/:id`,
      BLOCK_USER: `/${API_V}/admin/user-management/block-user/:id`,
      UNBLOCK_USER: `/${API_V}/admin/user-management/unblock-user/:id`,
      ACTIVE_USER: `/${API_V}/admin/user-management/active-user/:id`,
      INACTIVE_USER: `/${API_V}/admin/user-management/inactive-user/:id`,
      LIST_USERS: `/${API_V}/admin/user-management/list-user`,
      ARCHIVE_USER_LIST: `/${API_V}/admin/user-management/archive-list-user`,
      RESEND_INVITATION_LINK: `/${API_V}/admin/user-management/resend-link/:id`
    },
    TEST_TYPE: {
      ADD: `/${API_V}/test-type/add`,
      UPDATE: `/${API_V}/test-type/update/:id`,
      GET_ALL: `/${API_V}/test-type/get-all`,
      DELETE: `/${API_V}/test-type/delete`,
      DRAG_DROP: `/${API_V}/test-type/drag-drop`
    }
  },
  USER: {
    LOGIN: `/${API_V}/user/login`,
    SIGNUP: `/${API_V}/user/signup`,
    PROFILE: {
      USER_PROFILE: `/${API_V}/user/profile/:id`,
    },
    FORGOT_PASSWORD: `/${API_V}/user/forgot-password`,
    RESET_PASSWORD: `/${API_V}/user/reset-password`,
    TOKEN: {
      VERIFY_TOKEN: `/${API_V}/user/verify-token`,
    },
    VERIFY_USER: { PUT: `/${API_V}/user/verify-user/:key` },
    VERIFY_KEY: {
      FORGOT_KEY: `/${API_V}/verify-key/:key`,
      SIGNUP_KEY: `/${API_V}/verify-signup-key/:key`,
    },
    ACCOUNT_SETTING: {
      GET: `/${API_V}/user/acc-settings/profile/:userId`,
      UPDATE: `/${API_V}/user/acc-settings/profile/update/:userId`,
      UPDATE_EMAIL: `/${API_V}/user/acc-settings/profile/update/email/:userId`,
      CHANGE_OLD_PASSWORD: `/${API_V}/user/acc-settings/profile/update-password/:userId`,
    },
    VERIFY_API: `/${API_V}/user/verify-api`,
  },
  MAIN_DASHBOARD: {
    VISITOR_CONVERSION: `/${API_V}/dashboard/visitor-conversion/:userId`,
    SESSION: `/${API_V}/dashboard/session/:userId`,
    SPILT_TEST_DATA: `/${API_V}/dashboard/test-data/:userId`,
    GEOGRAPHY_DEVICE: `/${API_V}/dashboard/geoGraphy-device/:userId`,
    REFERRAL_DATA: `/${API_V}/dashboard/referral-data/:userId`,
    VISITOR_LOG_TABLE: `/${API_V}/dashboard/visitor-log-table/:userId`,
  },
  SPILT_TEST_DASHBOARD: {
    VISITOR_CONVERSION: `/${API_V}/spilt-test-dashboard/visitor-conversion/:testId`,
    SESSION: `/${API_V}/spilt-test-dashboard/session/:testId`,
    SPILT_TEST_DATA: `/${API_V}/spilt-test-dashboard/test-data/:testId`,
    REFERRAL_GEOGRAPHY_DEVICE: `/${API_V}/spilt-test-dashboard/referral-geoGraphy-device/:testId`
  },
  PORT: {
    PORT: process.env.PORT || 5000,
  },
  WIDGETS: {
    CREATE: `/${API_V}/widget/testimonials-slider/create`,
    DELETE: `/${API_V}/widget/testimonials-slider/delete/:widgetId`,
    GETALL: `/${API_V}/widget/testimonials-slider/getAll`,
    GET_PUBLISHED: `/${API_V}/widget/testimonials-slider/get-published/:widgetId`,
    REVISION: {
      EMBED: {
        GET_WIDGET_REVISION: `/${API_V}/widget/getWidgetRevision/:widget_pid`,
      },
    },
    TESTIMONIAL: {
      ITEM: {
        CREATE_ITEM: `/${API_V}/widget/testimonials-slider/:widgetId/create`,
        DELETE_ITEM: `/${API_V}/widget/testimonials-slider/delete`,
        UPDATE_ITEM: `/${API_V}/widget/testimonials-slider/update`,
        UPDATE_ITEM_ORDER: `/${API_V}/widget/testimonials-slider/updateOrder/:widgetId`,
      },
      SETTINGS: {
        UPDATE_SETTINGS: `/${API_V}/widget/testimonials-slider/update-settings/:widgetId`,
      },
    },
  },
  THANKYOU_PAGE: {
    PUT: `/${API_V}/urls/:userId`,
    POST: `/${API_V}/urls/:userId`,
    UPDATE: { PUT: `/${API_V}/urls/update-page-settings` },
  },
  SET_EMAIL_NOTIFICATION: {
    SET: `/${API_V}/user/acc-settings/profile/emailNotification/set/:userId`,
    GET: `/${API_V}/user/acc-settings/profile/emailNotification/details/:userId`,
    UPDATE: `/${API_V}/user/acc-settings/profile/emailNotification/details/update/:userId`,
  },
  PUBLISHED_WIDGETS_VISITOR: {
    USER_DASHBOARD_METRICS: {
      VISITOR_DETAILS: {
        GET: `/${API_V}/user/dashboard-metrics/details/:userId`,
      },
      EXTERNAL_FRONTEND_SESSION_DATA: {
        POST: `/${API_V}/user/dashboard-metrics/sessionData/:userId`,
      },
      HANDLE_EXTERNAL_VISITOR: {
        POST: `/${API_V}/trackVisitor/:userId`,
      },
    },
  },
  SPILT_TEST: {
    CREATE: { POST: `/${API_V}/spilt-test/create` },
    LIST: { GET: `/${API_V}/spilt-test/list` },
    EDIT_RUNNING_STATUS_LIST: {
      PUT: `/${API_V}/spilt-test/edit-running-status-list/:testId`,
    },
    UPDATE: { PUT: `/${API_V}/spilt-test/update/:testId` },
    CANCEL_TEST: { DELETE: `/${API_V}/spilt-test/cancel-test/:testId` },
    DELETE_TEST: { PUT: `/${API_V}/spilt-test/delete-test` },
    STOP_TEST: { PUT: `/${API_V}/spilt-test/stop-test/:testId` },
    DASHBOARD_DATA: { GET: `/${API_V}/spilt-test/dashboard-data/:testId` },
    DETAILED_NOTED: { PUT: `/${API_V}/spilt-test/update-notes/:testId` },
    MANUAL_CONVERSION: { PUT: `/${API_V}/spilt-test/manual-conversion/:testId` },
    UPDATE_VISITOR_CONVERSION: { PUT: `/${API_V}/spilt-test/update-visitor-conversion/:id` },
    SCRIPT_SPLIT_TEST: `/${API_V}/spilt-test/script`,
    STOP_RUNNING_TEST: { POST: `/${API_V}/split-test/stop-running-test` }
  },
};

module.exports = { CONSTANT_ROUTES, API_V };
