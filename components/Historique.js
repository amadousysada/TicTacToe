import React, {useContext} from 'react'
import { View, Text} from 'react-native'
import { MyContext } from '../provider'


export const Historique = ()=>{

	const context = useContext(MyContext)

	return (
		<View>
			<Text>AI: {context.historique.ai}</Text>
			<Text>HUMAIN: {context.historique.hum}</Text>
			<Text>NULL: {context.historique.tie}</Text>
		</View>
	)
}