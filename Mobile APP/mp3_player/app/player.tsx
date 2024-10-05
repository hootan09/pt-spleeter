import { MovingText } from '@/components/MovingText'
// import { PlayerControls } from '@/components/PlayerControls'
// import { PlayerProgressBar } from '@/components/PlayerProgressbar'
// import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
// import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
// import { unknownTrackImageUri } from '@/constants/images'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useActiveTrack } from 'react-native-track-player'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'

import unknownTrackImage from '../assets/images/unknown_track.png';
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { Colors } from '@/constants/Colors'

const {width, height} = Dimensions.get('window');

const PlayerScreen = () => {

	const colorScheme = useColorScheme();

	const activeTrack = useActiveTrack()

    const unknownTrackImageUri = Image.resolveAssetSource(unknownTrackImage).uri
	const { imageColors } = usePlayerBackground(activeTrack?.artwork ?? unknownTrackImageUri)
	

	const { top, bottom } = useSafeAreaInsets()

	// const { isFavorite, toggleFavorite } = useTrackPlayerFavorite()

	if (!activeTrack) {
		return (
			<View style={[{ justifyContent: 'center' }]}>
				<ActivityIndicator color={Colors[colorScheme].text} />
			</View>
		)
	}

	return (
		<LinearGradient
			style={{ flex: 1 }}
			colors={
				imageColors ? 
					imageColors.platform == 'ios' ? 
						[imageColors?.background, imageColors?.primary] 
						:
						["blue", "blue"]
					: 
					["blue"]}
		>
			<View style={styles.overlayContainer}>
				<View style={{ flex: 1, marginTop: top, marginBottom: bottom }}>
					<View style={styles.artworkImageContainer}>
						<Image
							source={{uri: activeTrack.artwork ?? unknownTrackImageUri}}
							resizeMode="cover"
							style={styles.artworkImage}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<View style={{ marginTop: 'auto' }}>
							<View style={{ height: 60 }}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									{/* Track title */}
									<View style={styles.trackTitleContainer}>
										<MovingText
											text={activeTrack.title ?? ''}
											animationThreshold={30}
											style={styles.trackTitleText}
										/>
									</View>
								</View>

								{/* Track artist */}
								{activeTrack.artist && (
									<Text numberOfLines={1} style={[styles.trackArtistText, { marginTop: 6 }]}>
										{activeTrack.artist}
									</Text>
								)}
							</View>

							<PlayerProgressBar style={{ marginTop: 32 }} />

							<PlayerControls style={{ marginTop: 40 }} />
						</View>

						<PlayerVolumeBar style={{ marginTop: 'auto', marginBottom: 30 }} />

						<View style={{}}>
							<PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
						</View>
					</View>
				</View>
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	overlayContainer: {
		paddingHorizontal: 5,
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1,
	},
	artworkImageContainer: {
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: width - width / 5,
		height: width - width / 5,
		resizeMode: 'cover',
		borderRadius: 12,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	trackTitleText: {
		fontSize: 22,
		fontWeight: '700',
	},
	trackArtistText: {
		fontSize: 12,
		opacity: 0.8,
		maxWidth: '90%',
	},
})

export default PlayerScreen
