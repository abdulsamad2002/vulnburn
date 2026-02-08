import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let roastsCache = null;

function loadRoasts() {
    if (roastsCache) return roastsCache;
    try {
        const dataPath = resolve(__dirname, '../../data/roasts.json');
        roastsCache = JSON.parse(readFileSync(dataPath, 'utf-8'));
    } catch (error) {
        console.error("Failed to load roasts.json", error);
        roastsCache = {};
    }
    return roastsCache;
}

export function getRoast(issue) {
    const roasts = loadRoasts();

    // Normalize inputs
    const severity = issue.severity || 'medium';
    let type = issue.type;
    let subtype = issue.subtype;

    // Handle 'weak_crypto/md5' style subtypes
    if (subtype && subtype.includes('/')) {
        subtype = subtype.split('/')[1];
    }

    let roastList = [];

    // Lookup Strategy:
    // 1. Direct subtype match at root (e.g. roasts['sql_injection'])
    // 2. Nested match (e.g. roasts['hardcoded_secret']['aws'])
    // 3. Nested generic match (e.g. roasts['hardcoded_secret']['generic'])
    // 4. Fallback map for known aliases

    if (roasts[subtype]) {
        roastList = roasts[subtype][severity] || roasts[subtype]['high'];
    }
    else if (roasts[type]) {
        if (roasts[type][subtype]) {
            roastList = roasts[type][subtype][severity];
        } else if (roasts[type]['generic']) {
            roastList = roasts[type]['generic'][severity];
        }
    }

    // Special mappings for inconsistent naming
    if (!roastList) {
        const manualMap = {
            'eval': 'eval_usage',
            'exec': 'command_injection',
            'command_injection': 'command_injection'
        };
        const mappedKey = manualMap[subtype];
        if (mappedKey && roasts[mappedKey]) {
            roastList = roasts[mappedKey][severity];
        }
    }

    // Generic fallback
    if (!roastList || roastList.length === 0) {
        roastList = roasts['generic_severity'] ? roasts['generic_severity'][severity] : [];
    }

    // Absolute fallback
    if (!roastList || roastList.length === 0) {
        return "Your code is so bad, I'm speechless.";
    }

    const template = roastList[Math.floor(Math.random() * roastList.length)];

    return template
        .replace('{file}', issue.file ? issue.file.split(/[/\\]/).pop() : 'file')
        .replace('{line}', issue.line || '?')
        .replace('{secret_type}', subtype || 'secret')
        .replace('{vulnerability_type}', subtype || 'issue')
        .replace('{injection_type}', subtype || 'injection');
}
