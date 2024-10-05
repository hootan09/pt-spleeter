import { useTrackPlayerRepeatMode } from '@/hooks/useTrackPlayerRepeatMode'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ComponentProps } from 'react'
import { RepeatMode } from 'react-native-track-player'


type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'>
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

const repeatOrder = [RepeatMode.Off, RepeatMode.Track, RepeatMode.Queue] as const

export const PlayerRepeatToggle = ({ ...iconProps }: IconProps) => {
	const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode()

	const toggleRepeatMode = () => {
		if (repeatMode == null) return

		const currentIndex = repeatOrder.indexOf(repeatMode)
		const nextIndex = (currentIndex + 1) % repeatOrder.length

		changeRepeatMode(repeatOrder[nextIndex])
	}

	const getIconName = ()=>{
		switch(repeatMode) {
			case RepeatMode.Off:
				return 'repeat-off'
			case RepeatMode.Track:
				return 'repeat-once'
			case RepeatMode.Queue:
				return 'repeat'
			default:
				return 'repeat-off';
		}
	}

	return (
		<MaterialCommunityIcons
			name={getIconName()}
			onPress={toggleRepeatMode}
			color={'white'}
			{...iconProps}
		/>
	)
}
