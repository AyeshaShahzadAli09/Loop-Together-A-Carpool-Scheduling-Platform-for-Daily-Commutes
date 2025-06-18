# Progressive Web App (PWA) Setup for Loop Together

This guide contains instructions for setting up and completing the PWA configuration for the Loop Together application.

## What's Already Set Up

1. Added PWA dependencies (`vite-plugin-pwa` and `workbox-window`)
2. Configured the Vite config file for PWA support
3. Updated the HTML file with necessary PWA meta tags
4. Added service worker registration in the main application entry point

## Steps to Complete the Setup

### 1. Create Icon Files

You need to create the following icon files and place them in the `public` folder:

- `favicon.ico` - Standard favicon (16x16 or 32x32)
- `apple-touch-icon.png` - 180x180 PNG icon for iOS
- `pwa-192x192.png` - 192x192 PNG icon for Android
- `pwa-512x512.png` - 512x512 PNG icon for Android
- `maskable-icon.png` - 512x512 PNG icon with padding for "maskable" support

You can use tools like [Favicon Generator](https://realfavicongenerator.net/) or [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) to create these icons from your app logo.

### 2. Install Dependencies

Run the following command to install the PWA-related dependencies:

```bash
npm install
```

### 3. Test PWA Functionality

When testing your PWA:

1. Build the application for production:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

3. Use Chrome DevTools to verify PWA functionality:
   - Open DevTools (F12)
   - Go to "Application" tab
   - Check "Manifest" section to verify your PWA configuration
   - Check "Service Workers" to verify service worker registration

### 4. Offline Support

The current setup provides basic offline capabilities through the service worker. For more advanced offline features:

1. Implement a custom offline page
2. Cache specific API responses for offline access
3. Add offline storage using IndexedDB

### 5. App Installation

Your app should now support "Add to Home Screen" functionality on supported devices. To improve the install experience:

1. Consider adding a custom install prompt using the `beforeinstallprompt` event
2. Add an "Install" button to your application UI

## Resources

- [Vite PWA Plugin Documentation](https://vite-pwa-org.netlify.app/)
- [Google's PWA Checklist](https://web.dev/pwa-checklist/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) 