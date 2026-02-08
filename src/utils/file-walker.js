import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

export async function findFiles(directory) {
    try {
        // Enhanced pattern to match the requested extensions
        const pattern = '**/*.{js,ts,jsx,tsx,py,java,yml,yaml,env,json}';

        const filePaths = await glob(pattern, {
            cwd: directory,
            ignore: [
                '**/node_modules/**',
                '**/.git/**',
                '**/dist/**',
                '**/build/**',
                '**/.next/**',
                '**/coverage/**',
                '**/*.min.js'
            ],
            nodir: true,
            absolute: false,
            dot: true // include .env files
        });

        const files = [];
        for (const filePath of filePaths) {
            try {
                const fullPath = path.resolve(directory, filePath);
                // Check format/extension to avoid reading binaries erroneously caught
                if (/\.(png|jpg|jpeg|gif|ico|pdf|zip|tar|gz|bin|exe|dll|so|dylib)$/i.test(filePath)) {
                    continue;
                }

                const content = await fs.readFile(fullPath, 'utf-8');

                // Double check for binary content (null bytes)
                if (content.indexOf('\0') !== -1) {
                    continue;
                }

                files.push({
                    path: filePath,
                    content: content
                });
            } catch (error) {
                // Silently skip unreadable files
                if (process.env.DEBUG) console.warn(`Skipping file ${filePath}: ${error.message}`);
            }
        }

        return files;
    } catch (err) {
        console.error('Error walking files:', err);
        return [];
    }
}
