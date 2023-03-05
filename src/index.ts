import app from './app'
import dotenv from 'dotenv'
import config from './config'

app.listen(config.port, () => {
    console.log('Server is running on port 8000')
})
