// import { OAuth2Client, TokenPayload } from "google-auth-library";

class GoogleAuthenticator {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || "";
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || "";
  }

  /**
   * Get Google OAuth2 URL for authentication
   * @param state Optional state parameter for CSRF protection
   * @returns Google OAuth2 URL
   */
  getAuthUrl(state?: string): string {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
    };
    if (state) params.state = state;
    const searchParams = new URLSearchParams(params);
    return `${baseUrl}?${searchParams.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   * @param code Authorization code
   * @returns Tokens
   */
  async getTokens(code: string): Promise<any> {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get tokens: ${response.status} ${error}`);
    }
    return response.json();
  }

  /**
   * Get user profile information using access token
   * @param accessToken Access token
   * @returns User profile
   */
  async getUserProfile(accessToken: string): Promise<any> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to get user profile: ${response.status} ${error}`
      );
    }
    return response.json();
  }

  /**
   * Verify and decode a Google ID token (JWT) sent from the frontend.
   * @param idToken The ID token from the frontend
   * @returns The decoded user info if valid, otherwise throws an error
   */
  async verifyIdToken(idToken: string): Promise<any> {
    // const client = new OAuth2Client(this.clientId);
    // const ticket = await client.verifyIdToken({
    //   idToken,
    //   audience: this.clientId, // Specify the CLIENT_ID of the app that accesses the backend
    // });
    // const payload = ticket.getPayload();
    // if (!payload) {
    //   throw new Error("Invalid Google ID token payload");
    // }
    // return payload;
  }

  /**
   * Authenticate a user with a Google ID token and a user ID.
   * @param token The Google ID token from the frontend
   * @param googleId The user ID from the frontend
   * @returns The decoded user info if valid, otherwise throws an error
   */
  async authenticate(token: string, googleId: string): Promise<any> {
    const user = await this.verifyIdToken(token);
    if (user.sub == googleId) return user;
    else throw new Error("Invalid or Expired Google ID Token!");
  }
}

export default GoogleAuthenticator;
