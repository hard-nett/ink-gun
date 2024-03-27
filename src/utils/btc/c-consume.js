import redis from 'redis';
import { signInscriptionMetadata, signMetadata } from './d-format-and-sign';
const client = redis.createClient();

const metadataIndexer = (() => {
    let consumedMetadataIds = new Set();
    // consume metadata, associate metadata with minter in Redis
    function consumeMetadata(metadataId, minterAddr) {
        // Assuming metadataId is a number
        client.multi()
            .set(`metadata:${metadataId}`, 'consumed')
            .set(`minter:${metadataId}`, minterAddr)
            .exec((err) => {
                if (err) {
                    console.error('Error consuming metadata:', err);
                } else {
                    // add the metadata as consumed
                    consumedMetadataIds.add(metadataId);
                    console.log('Metadata added to consumed', metadataId, minterAddr);
                    // format & sign the inscription
                    signInscriptionMetadata(metadataId, minterAddr);
                }
            });
    }

    function isMetadataConsumed(metadataId, callback) {
        client.get(`metadata:${metadataId}`, (err, reply) => {
            if (err) {
                console.error('Error checking if metadata is consumed:', err);
                callback(err, null);
                return;
            }
            if (reply === 'consumed') {
                consumedMetadataIds.add(metadataId);
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    }

    return {
        consumeMetadata,
        isMetadataConsumed
    };
})();

// Export the functions from the module
export default metadataIndexer;

//Example:
// import metadataIndexer from './metadataIndexerModule';
// metadataIndexer.consumeMetadata(metadataId)
// metadataIndexer.isMetadataConsumed(metadataId, callback)
