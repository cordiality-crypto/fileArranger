import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, 'clutter');

// Step eins: Fetching the Filenames
function getFiles(directory, files = []) {
    const fileList = fs.readdirSync(directory);
    for (const file of fileList) {
        const checker = path.join(directory, file);
        if (fs.statSync(checker).isDirectory()) {
            getFiles(checker, files);
        } else {
            files.push(checker);
        }
    }
    return files;
}

// Step zwei: creating a list to store the file names in them
let files = [];
try {
    files = getFiles(directoryPath);
    console.log(files);
} catch (error) {
    console.error('Error reading directory:', error);
}

// Step drei: making directories using their extensions
for (const file of files) {
    let extension = path.extname(file).slice(1);
    let directory = path.join(__dirname, 'newClutter', extension);
    if (!fs.existsSync(directory)) {
        try {
            fs.mkdirSync(directory, { recursive: true });
        } catch (err) {
            console.error(`Error creating directory ${directory}:`, err);
        }
    }
    let currPath = file;  // use the full path already stored in files array
    let newPath = path.join(directory, path.basename(file));
    try {
        fs.renameSync(currPath, newPath);
    } catch (error) {
        console.error(`Error moving file into ${directory}:`, error);
    }
}

// Step vier: remove the old clutter directory
fs.rm(directoryPath, { recursive: true, force: true }, err => {
    if (err) {
        throw err;
    }
    console.log(`${directoryPath} has been deleted.`);
});
