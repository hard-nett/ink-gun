import express from 'express';
import fs from 'fs';
import { pick } from "nois";
import metadataIndexer from './c-consume';
const metadataFolder = '../../../metadata';

function getRandomMetadata(minterAddr) {
    const files = fs.readdirSync(metadataFolder);
    const availableFiles = files.filter((file) => {
        if (file.endsWith('.json')) {
            const metadataId = getMetadataIdFromFile(file);
            return !metadataIndexer.isMetadataConsumed(metadataId);
        }
        return false;
    });

    if (availableFiles.length === 0) {
        console.error('All files have been consumed.');
        return null;
    } else {
        // use nois to pick available metadata
        let picked = pick(randomness, 1, availableFiles.length);
        // consume & associate metadata with minter address
        metadataIndexer.consumeMetadata(picked, minterAddr);
        
        return picked;
    }
}

function readMetadataFolder(metadataFolder) {
    let ordinalMetadata = [];
    try {
        // define where metadata is
        const allMetadata = fs.readdirSync(metadataFolder);
        // check if we have consumed the metadata id already
        allMetadata.forEach((file) => {
            if (file.endsWith('.json') && !metadataIndexer.isMetadataConsumed(getMetadataIdFromFile(file))) {
                const fileData = fs.readFileSync(metadataFolder + file, 'utf-8');
                const jsonData = JSON.parse(fileData);
                ordinalMetadata.push(jsonData);
            }
        });
    } catch (err) {
        console.error('Error reading JSON files:', err);
    }
    return ordinalMetadata;
}

function getMetadataIdFromFile(fileName) {
    const id = fileName.split('.')[0]; // Extract numerical ID from file name (e.g., "0.json" -> "0")
    return parseInt(id, 10); // Parse ID as integer
}

function getMetadataFilePath(metadataId) {
    const metadataDir = 'metadata';
    const fileName = `metadata-${metadataId}.json`;
    const filePath = path.join(metadataDir, fileName);
    return filePath;
}


export { getRandomMetadata, readMetadataFolder, getMetadataIdFromFile, getMetadataFilePath };