# Smart Attendance System

A premium, high-performance mobile application for workforce management and identity-verified attendance tracking. Built with React Native and Expo, featuring a state-of-the-art static UI inspired by modern financial platforms.

## Key Features

- **Live Location Tracking**: Real-time GPS tracking during active work sessions with background execution support.
- **Identity Verification**: Integrated selfie-capture requirement for duty commencement.
- **Admin Command Center**:
  - Employee lifecycle management and registration.
  - Granular duty logs and geospatial timeline verification.
  - Real-time session monitoring with "Last Signal" indicators.
- **Tactile Feedback**: Haptic-enriched interactions (selection, success, and error signals).
- **Offline Resilience**: Intelligent retry queues for location data to ensure no node is lost during network drops.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Background Tasks**: [Expo TaskManager](https://docs.expo.dev/versions/latest/sdk/task-manager/) & [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- **Haptics**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Icons**: [Ionicons](https://ionic.io/icons) via `@expo/vector-icons`

## Getting Started

### Prerequisites

- Node.js (v18+)
- EAS CLI (if building for production)
- Android/iOS physical device for location tracking testing

### Environment Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

## Architecture

- **`/app`**: File-based routing using `expo-router`.
- **`/components`**: Reusable premium UI components.
- **`/hooks`**: Custom logic for location tracking and permissions.
- **`/redux`**: Global state and API slice definitions.
- **`/tasks`**: Background worker definitions for location updates.
