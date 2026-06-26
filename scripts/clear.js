const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yourtube').then(async () => {
  const result = await mongoose.connection.collection('videos').deleteMany({
    channel: { $ne: 'Your Channel' }
  });
  console.log('Deleted ' + result.deletedCount + ' dummy videos!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});