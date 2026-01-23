const mongoose = require('mongoose');

/**
 * Initialize database indexes and clean up old ones
 * This ensures proper handling of optional fields with unique constraints
 */
async function initializeDatabase() {
    try {
        // Get the users collection
        const usersCollection = mongoose.connection.collection('users');

        // Get current indexes
        const indexes = await usersCollection.getIndexes();
        console.log('Current User collection indexes:', Object.keys(indexes));

        // Drop the old phone_1 index if it exists (from when phone was unique)
        if (indexes.phone_1) {
            try {
                await usersCollection.dropIndex('phone_1');
                console.log('✓ Dropped old phone_1 unique index');
            } catch (err) {
                if (err.code === 27) {
                    // Index not found - that's okay
                    console.log('✓ phone_1 index was not present');
                } else {
                    console.warn('Warning: Could not drop phone_1 index:', err.message);
                }
            }
        }

        // Ensure proper indexes are created
        // The sparse index allows multiple documents without the field or with null values
        await usersCollection.createIndex({ phone: 1 }, { sparse: true });
        console.log('✓ Created sparse phone index');

        // Verify indexes
        const updatedIndexes = await usersCollection.getIndexes();
        console.log('✓ Final User collection indexes:', Object.keys(updatedIndexes));

    } catch (error) {
        console.error('Error initializing database:', error.message);
        // Don't throw - this is not critical to server operation
    }
}

module.exports = { initializeDatabase };
