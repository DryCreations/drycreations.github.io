import fs from 'fs';
import path from 'path';

export function buildSketches() {
    const sketchesDir = path.resolve('static/sketches');
    const outputDir = path.resolve('static/sketches');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read all sketch files
    const files = fs.readdirSync(sketchesDir).filter(f => f.endsWith('.js'));
    
    // Create 10 variations by cycling through available sketches
    for (let i = 0; i < 10; i++) {
        const sourceFile = files[i % files.length];
        const content = fs.readFileSync(path.join(sketchesDir, sourceFile), 'utf-8');
        fs.writeFileSync(path.join(outputDir, `sketch${i}.js`), content);
    }
}
