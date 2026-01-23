require('dotenv').config()
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (error) => {
    console.error('Connection error:', error)
    process.exit(1)
})

db.once('open', async () => {
    console.log('Connected to Database')

    try {
        // Drop the phone index if it exists
        const indexInfo = await db.collection('users').getIndexes()
        console.log('Current indexes:', Object.keys(indexInfo))

        if (indexInfo.phone_1) {
            await db.collection('users').dropIndex('phone_1')
            console.log('✓ Successfully dropped phone_1 index')
        } else {
            console.log('✓ phone_1 index does not exist, no action needed')
        }

        // List remaining indexes
        const updatedIndexes = await db.collection('users').getIndexes()
        console.log('Updated indexes:', Object.keys(updatedIndexes))

        process.exit(0)
    } catch (error) {
        console.error('Error dropping index:', error)
        process.exit(1)
    }
})
