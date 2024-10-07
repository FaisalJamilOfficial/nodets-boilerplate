// destructuring assignments
const { LOCAL_3000, ADMIN_PANEL_URL, PIE_HOST_URL } = process.env;

export default {
  LOCAL_3000: LOCAL_3000 || "",
  ADMIN_PANEL_URL: ADMIN_PANEL_URL || "",
  PIE_HOST_URL: PIE_HOST_URL || "",
};
