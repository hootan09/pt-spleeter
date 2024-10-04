import { useRef } from 'react'
import { FlatList, Text, View, Image, StyleSheet } from 'react-native'
import { TracksListItem } from '@/components/TracksListItem'
import TrackPlayer, { Track } from 'react-native-track-player'

import tracks from '@/assets/data/library.json';
import unknownTrackImageUri from '../assets/images/unknown_track.png';
import { useRouter } from 'expo-router';


export const TracksList = ({}: any) => {

	const router = useRouter()

	const handleTrackSelect = async (selectedTrack: Track)=> {

		// await TrackPlayer.stop();
		await TrackPlayer.reset();
		await TrackPlayer.add(selectedTrack)
		await TrackPlayer.play();
		router.navigate('/player')

		// const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

		// if (trackIndex === -1) return

		// const isChangingQueue = id !== activeQueueId

		// if (isChangingQueue) {
		// 	const beforeTracks = tracks.slice(0, trackIndex)
		// 	const afterTracks = tracks.slice(trackIndex + 1)

		// 	await TrackPlayer.reset()

		// 	// we construct the new queue
		// 	await TrackPlayer.add(selectedTrack)
		// 	await TrackPlayer.add(afterTracks)
		// 	await TrackPlayer.add(beforeTracks)

		// 	await TrackPlayer.play()

		// 	queueOffset.current = trackIndex
		// 	setActiveQueueId(id)
		// } else {
		// 	const nextTrackIndex =
		// 		trackIndex - queueOffset.current < 0
		// 			? tracks.length + trackIndex - queueOffset.current
		// 			: trackIndex - queueOffset.current

		// 	await TrackPlayer.skip(nextTrackIndex)
		// 	TrackPlayer.play()
		// }
	}
	return (
		<FlatList
			data={tracks}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListEmptyComponent={
				<View>
					<Text style={{}}>No songs found</Text>

					<Image
						source={unknownTrackImageUri}
						style={styles.emptyContentImage}
					/>
				</View>
			}
			renderItem={({ item: track }) => (
				<TracksListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
		/>
	)
}

const styles = StyleSheet.create({
	emptyContentImage: {
		width: 45,
		height: 45
	}
})