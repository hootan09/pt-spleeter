import { Platform, SafeAreaView, StyleSheet, StatusBar, useColorScheme } from 'react-native'
import React from 'react'
import { TracksList } from '@/components/TracksList'
import { Colors } from '@/constants/Colors';

const index = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={[styles.AndroidSafeArea, {backgroundColor: Colors[colorScheme].backgroundColor}]}>
      <TracksList />
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
})