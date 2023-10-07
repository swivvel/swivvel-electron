interface Window {
  electron: {
    getDesktopSources: () => Promise<Array<ShareableMediaSource>>;
  };
  trustedTypes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createPolicy: (policyName: string, policy: any) => any;
  };
}
