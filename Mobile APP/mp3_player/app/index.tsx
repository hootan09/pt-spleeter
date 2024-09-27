import { Platform, SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { TracksList } from '@/components/TracksList'

const index = () => {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <TracksList />
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
})