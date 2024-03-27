import bitcoin from 'bitcoinjs-lib';
import zmq from 'zeromq';
import metadataIndexer from './c-consume';
import { getRandomMetadata } from './b-select-metadata';

// listens for tx's to publisher with sufficient mint cost
const publisherAddr = process.env.PUBLISHER_ADDR;
const mintSats = process.env.MINT_SAT_PRICE;
const btc_node = process.env.BTC_NODE_ADDR;

function startBitcoinListener() {
    // use zeromq socket from bitcoin node
    const socket = zmq.socket('sub');
    socket.connect(btc_node);
    socket.subscribe('rawtx');

    // get txid for raw tx
    socket.on('message', function (topic, message) {
        if (topic.toString() === 'rawtx') {
            const rawTx = message.toString('hex');
            const tx = bitcoin.Transaction.fromHex(rawTx);
            const txid = tx.getId();

            tx.ins = tx.ins.map(function (input) {
                input.address = bitcoin.address.fromOutputScript(input.script, bitcoin.networks.bitcoin);
                return input;
            });

            tx.outs = tx.outs.map(function (output) {
                output.address = bitcoin.address.fromOutputScript(output.script, bitcoin.networks.bitcoin);
                return output;
            });

            // Check if any output matches the target address and required amount
            const hasRequiredOutput = tx.outs.some(function (output) {
                return (
                    output.address === publisherAddr &&
                    output.value === mintSats
                );
            });

            if (hasRequiredOutput) {
                // assuming minter address is the first input address
                const minterAddr = tx.ins[0].address;
                // get metadata to associate with minter
                let metadataId = getRandomMetadata(minterAddr);
                
                console.log('new inscription mint:', txid, tx);
                console.log('metadata id:', metadataId)
            } else { }
        }
    });
}

export default startBitcoinListener;
