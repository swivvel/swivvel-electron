export default (url: string): string| null => {
  if (url.startsWith(`https://meet.google.com/`)) {
    return `/electron/google-meet?meetingUrl=${encodeURIComponent(url)}`
  }

  return null;
}