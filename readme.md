# Create New apps 
npx create-expo-app --template
# Generate Functional component
Shortcut= rsf
Shortcut= rnfes
StyleShet =rnss
# React Native Nagivator
npm install @react-navigation/native@^5.
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack@^5.x
npm install @react-navigation/bottom-tabs@^5.x

#Build a Apps
npx expo run:android

eas build -p android --profile preview

#Cache clear
Zustand -- state management

#EMpty App folder
npm run reset-project

#Generate Metro Config
npx expo customize metro.config.js