// import unknownTrackImageUri from "../assets/images/unknown_track.png";
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'

export type TracksListItemProps = {
	track: Track
	onTrackSelect: (track: Track) => void
}

export const TracksListItem = ({
	track,
	onTrackSelect: handleTrackSelect,
}: TracksListItemProps) => {
	const { playing } = useIsPlaying()

	const isActiveTrack = useActiveTrack()?.url === track.url

	return (
		<TouchableHighlight onPress={() => handleTrackSelect(track)}>
			<View style={styles.trackItemContainer}>
				<View>
					{/* <Image
						source={{
							uri: track.artwork ?? unknownTrackImageUri,
						}}
						style={{
							...styles.trackArtworkImage,
							opacity: isActiveTrack ? 0.6 : 1,
						}}
					/> */}

					{isActiveTrack &&
						(playing ? (
							<Ionicons
								style={styles.trackPlayingIconIndicator}
								name="LineScaleParty"
								size={24}
								color={"red"}
							/>
						) : (
							<Ionicons
								style={styles.trackPausedIndicator}
								name="play"
								size={24}
								color={"red"}
							/>
						))}
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					{/* Track title + artist */}
					<View style={{ width: '100%' }}>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isActiveTrack ? 'black' : 'black',
							}}
						>
							{track.title}
						</Text>

						{track.artist && (
							<Text numberOfLines={1} style={styles.trackArtistText}>
								{track.artist}
							</Text>
						)}
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
		alignItems: 'center',
		paddingRight: 20,
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
	trackTitleText: {
		fontSize: 11,
		fontWeight: '600',
		maxWidth: '90%',
	},
	trackArtistText: {
		color: 'blue',
		fontSize: 14,
		marginTop: 4,
	},
})
