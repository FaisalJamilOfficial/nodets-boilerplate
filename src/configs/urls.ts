// destructuring assignments
const { LOCAL_3000, ADMIN_PANEL_URL } = process.env;

export default {
  LOCAL_3000: LOCAL_3000 || "",
  ADMIN_PANEL_URL: ADMIN_PANEL_URL || "",
};
