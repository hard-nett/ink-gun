import { exec } from 'child_process';

function inscribeOrdinal(metadataFile, minterAddr) {
    const ordInscribeCmd = `ord wallet inscribe --fee-rate ${process.env.MINT_PRICE} --file ${metadataFile} --destination ${minterAddr}`;
    exec(ordInscribeCmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
            return;
        }
        console.log(`Command stdout:\n${stdout}`);
    });
}
export { inscribeOrdinal };
