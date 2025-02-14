import fs from 'fs';
import path from 'path';

export function buildSketches() {
    // Change sourceDir to use the new location
    const sourceDir = path.resolve('src/static/sketches');
    const outputDir = path.resolve('static/sketches');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read and copy sketch files
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.js'));
    files.forEach((file, index) => {
        const content = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
        fs.writeFileSync(path.join(outputDir, `sketch${index}.js`), content);
    });
}
