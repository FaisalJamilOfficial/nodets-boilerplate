/**
 * Requires an environment variable to be present.
 * @param {string} key - The name of the environment variable to require.
 * @returns {string} The value of the environment variable.
 * @throws {Error} If the environment variable is not present.
 */
export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
