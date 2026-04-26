# Smart University Kiosk System (Indus University)

A premium, interactive kiosk application built for Indus University, featuring an intelligent AI Assistant, real-time data synchronization, and a multi-variant design system. This project is specifically designed for high-traffic physical kiosk deployments, prioritizing performance, security, and a seamless user experience.

## 🚀 Key Features

- **Intellectual AI Assistant (Niaa)**: Context-aware conversational agent powered by **Google Gemini AI**. Provides instant answers regarding admissions, courses, fees, and campus facilities using a custom-fed university knowledge base.
- **Multi-Tenant Site Variants**: Dynamic theme and content switching between **Indus University** and **WIIA (Western India Institute of Aeronautics)** modes within a single application.
- **Real-time News Ticker**: A synchronized scrolling ticker for university announcements, powered by **Firebase Firestore** for instant cloud updates.
- **Kiosk Security & Session Management**: 
  - Integrated **Access Gate** for kiosk authentication.
  - Automatic session reset on inactivity.
  - Secure "Terminate Session" flow to protect kiosk integrity.
- **Premium UI/UX**: 
  - Smooth animations using **Framer Motion**.
  - Modern, responsive layouts styled with **Tailwind CSS**.
  - Intelligent scroll controls optimized for touch-screen hardware.
- **Cloud Integration**: Real-time logging of AI chat sessions and analytics to Firebase for administrative monitoring.

## 🛠️ Technology Stack

- **Frontend**: React.js (v18+)
- **AI/ML**: Google Generative AI (Gemini Pro)
- **Backend/Database**: Firebase Firestore
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks & LocalStorage Persistence
- **Deployment**: Optimized for kiosk hardware environments

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Kiosk_Using_React
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   REACT_APP_GEMINI_API_KEY=your_google_gemini_api_key
   # Firebase configuration (if using custom config)
   REACT_APP_FIREBASE_API_KEY=your_firebase_key
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## 🏗️ Project Structure

- `src/components/AI`: Niaa AI Assistant logic and UI.
- `src/pages`: Individual kiosk screens (Programs, Admission, Events, etc.).
- `src/data`: Static knowledge base used to ground the AI Assistant.
- `src/auth`: Security and session management logic.
- `src/firebase.js`: Firebase initialization and cloud service configuration.

## 🛡️ License

This project is developed for Indus University. All rights reserved.
