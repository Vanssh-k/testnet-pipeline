import app from './app'
import dotenv from 'dotenv'
dotenv.config()

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000')
})
