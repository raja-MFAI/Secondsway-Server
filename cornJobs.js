const cron = require('node-cron');
const BiddableProduct = require('./models/biddablesModel');

const updateAuctionStatus = async () => {
  try {
    const now = new Date();
    console.log(`Cron job triggered at ${now.toISOString()}`);
    const products = await BiddableProduct.find();
    console.log(`Found ${products.length} products to process.`);

    products.forEach(async (product) => {
      const bidStartTime = new Date(product.bidStartsAt);
      const bidEndTime = new Date(
        bidStartTime.getTime() +
        product.bidDuration.days * 24 * 60 * 60 * 1000 +
        product.bidDuration.hours * 60 * 60 * 1000 +
        product.bidDuration.minutes * 60 * 1000
      );

      let isUpdated = false;

      if (!product.startBid && now >= bidStartTime) {
        product.startBid = true;
        isUpdated = true;
      }

      if (!product.endedBid && now >= bidEndTime) {
        product.endedBid = true;
        isUpdated = true;
      }

      if (isUpdated) {
        await product.save();
        console.log(`Updated auction status for product: ${product.title}`);
        console.log(`Updated product: ${product.title}, startBid: ${product.startBid}, endedBid: ${product.endedBid}`);
      }
    });
  } catch (error) {
    console.error('Error updating auction status:', error);
  }
};

// Schedule the cron job
const initializeCronJobs = () => {
  cron.schedule('* * * * *', updateAuctionStatus);
};

module.exports = initializeCronJobs;
