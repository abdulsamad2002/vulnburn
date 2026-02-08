import { glob } from 'glob';
import path from 'path';

export async function findFiles(directory, pattern = '**/*') {
    return glob(pattern, {
        cwd: directory,
        ignore: ['**/node_modules/**', '**/.git/**'],
        nodir: true,
    });
}
