// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from '@/constants/playBackService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [playerLoad, setPlayerLoad] = useState(false);
  useSetupTrackPlayer({ onLoad: () => setPlayerLoad(true),});
  useLogTrackPlayerState();
  
  useEffect(() => {
    if (loaded && playerLoad) {
      SplashScreen.hideAsync();
    }
  }, [loaded, playerLoad]);

  if (!loaded && !playerLoad) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme}/>
        <Stack initialRouteName='index'>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="player" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

      </GestureHandlerRootView>
    // </ThemeProvider>
  );
}
