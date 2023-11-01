export interface LogInService {
  initiateLogIn: () => Promise<boolean>;
  handleLogInOAuthCallback: (url: string) => Promise<boolean>;
}
