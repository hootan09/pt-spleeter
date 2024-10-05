import { Entypo, Ionicons } from '@expo/vector-icons'
import { Image, StyleSheet, Text, TouchableHighlight, useColorScheme, View } from 'react-native'
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'
import unknownTrackImage from "../assets/images/unknown_track.png";
import { Colors } from '@/constants/Colors';


export type TracksListItemProps = {
	track: Track
	onTrackSelect: (track: Track) => void
}

export const TracksListItem = ({
	track,
	onTrackSelect: handleTrackSelect,
}: TracksListItemProps) => {

	const unknownTrackImageUri = Image.resolveAssetSource(unknownTrackImage).uri
	const { playing } = useIsPlaying()

	const isActiveTrack = useActiveTrack()?.url === track.url

	const colorScheme = useColorScheme();

	return (
		<TouchableHighlight onPress={() => handleTrackSelect(track)}>
			<View style={styles.trackItemContainer}>
				<View>
					<Image
						source={{
							uri: track.artwork ?? unknownTrackImageUri,
						}}
						style={[styles.trackArtworkImage,{opacity: isActiveTrack ? 0.6 : 1}]}
					/>

					{isActiveTrack &&
						(playing ? (
							<Ionicons
								style={styles.trackPlayingIconIndicator}
								name="play"
								size={24}
								color={"red"}
							/>
						) : (
							<Ionicons
								style={styles.trackPausedIndicator}
								name="pause"
								size={24}
								color={"red"}
							/>
						))}
				</View>

				<View
					style={[
						styles.rowTextWrapper, 
						{
							borderBottomWidth: Colors[colorScheme].borderWidth, 
							borderBottomColor: Colors[colorScheme].borderColor,
						}
					]}
				>
					{/* Track title + artist */}
					<View style={{ width: '100%' }}>
						<Text
							numberOfLines={1}
							style={[
								styles.trackTitleText, 
								{
									color: isActiveTrack ? Colors[colorScheme].text : Colors[colorScheme].text,
								}
							]}
						>
							{track?.title}
						</Text>

						<Text numberOfLines={1} style={[
							styles.trackArtistText, 
							{
								color: Colors[colorScheme].tint,
							}]}>
							{track?.artist || 'UKNOWN'}
						</Text>
					</View>

				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	trackItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		justifyContent: 'center',
		paddingRight: 20,
		marginBottom: 10,
		marginHorizontal: 16,
	},
	trackPlayingIconIndicator: {
		position: 'absolute',
		top: 18,
		left: 16,
		width: 16,
		height: 16,
	},
	trackPausedIndicator: {
		position: 'absolute',
		top: 14,
		left: 14,
	},
	trackArtworkImage: {
		borderRadius: 8,
		width: 50,
		height: 50,
	},
	rowTextWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
		paddingBottom: 10,
	},
	trackTitleText: {
		fontSize: 16,
		fontWeight: '600',
		maxWidth: '90%',
	},
	trackArtistText: {
		fontSize: 14,
		marginTop: 4,
	},
})
