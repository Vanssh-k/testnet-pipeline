import axios from 'axios'
import config from '../../../config'

export const sendMessageToEnc = async (publicKey: string, message: string) => {
	try {
		const data = await Promise.all(
			config.lighthouse_encryption_nodes.map((url, index) =>
				axios({
					url,
					method: 'POST',
					data: JSON.stringify({
							address: publicKey,
							message,
					}),
					headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${config.lighthouse_encryption_auth_keys[index]}`,
					},
				})
				.then((res) => {res.data})
				.catch((err) => {return null })
			)
		)
		return data
	} catch (e: any) {
		console.log(e.message)
		return null
	}
}
