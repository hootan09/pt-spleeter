import { useRef } from 'react'
import { FlatList, Text, View, Image, StyleSheet } from 'react-native'
import { TracksListItem } from '@/components/TracksListItem'
import TrackPlayer, { Track } from 'react-native-track-player'

import tracks from '@/assets/data/library.json';
import unknownTrackImageUri from '../assets/images/unknown_track.png';


export const TracksList = ({}: any) => {
	const handleTrackSelect = async ()=> {}
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