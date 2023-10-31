export interface SignInService {
  initiateSignIn: () => Promise<boolean>;
  handleSignInOAuthCallback: (url: string) => Promise<boolean>;
}
