import { readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let roastsCache = null;

function loadRoasts() {
    if (roastsCache) return roastsCache;
    try {
        // Resolve path to data/roasts.json
        // We are in src/roasts/. We need to go up two levels to root, then into data/
        const dataPath = resolve(__dirname, '../../data/roasts.json');
        const content = readFileSync(dataPath, 'utf-8');
        roastsCache = JSON.parse(content);
        return roastsCache;
    } catch (error) {
        console.error("Failed to load roasts.json from data directory", error);
        return {};
    }
}

export function getRoast(issue) {
    const roasts = loadRoasts();

    let category = roasts[issue.type];

    // Handle specific mappings if type names technically differ slightly or need grouping
    // But currently my scanner produces 'hardcoded_secret', 'code_issue', 'crypto_issue'
    // The json has 'hardcoded_secret', 'sql_injection', 'weak_crypto' etc as TOP level keys. 
    // This is a mismatch. The JSON structure is a mix of types and direct subtypes at the top level.

    // Strategy: Try to find a match by specific subtype first (most specific), then by general type.

    let severity = issue.severity || 'medium';
    let roastList = [];

    // 1. Try matching top-level keys by subtype (e.g. 'sql_injection', 'aws')
    // My scanner produces subtype like 'aws' or 'weak_crypto/md5'
    let cleanSubtype = issue.subtype;
    if (cleanSubtype && cleanSubtype.includes('/')) {
        cleanSubtype = cleanSubtype.split('/')[1]; // 'md5' from 'weak_crypto/md5'
    }

    // Try finding the subtype directly at root level (e.g. "sql_injection" is at root)
    if (roasts[issue.subtype]) {
        roastList = roasts[issue.subtype][severity] || roasts[issue.subtype]['high'] || [];
    }
    else if (roasts[cleanSubtype]) {
        roastList = roasts[cleanSubtype][severity] || [];
    }

    // 2. If not found, try finding via [type][subtype] (e.g. roasts['hardcoded_secret']['aws'])
    if ((!roastList || roastList.length === 0) && roasts[issue.type]) {
        if (roasts[issue.type][cleanSubtype]) {
            roastList = roasts[issue.type][cleanSubtype][severity] || [];
        } else if (roasts[issue.type][issue.subtype]) {
            roastList = roasts[issue.type][issue.subtype][severity] || [];
        } else if (roasts[issue.type]['generic']) {
            roastList = roasts[issue.type]['generic'][severity] || [];
        }
    }

    // 3. Special Case Mappings (Manual fixups for inconsistent naming)
    if (!roastList || roastList.length === 0) {
        // Map 'code_issue' with subtype 'eval' -> json key 'eval_usage'
        if (issue.subtype === 'eval') {
            roastList = roasts['eval_usage'] ? roasts['eval_usage'][severity] : [];
        }
    }

    // 4. Fallback to generic severity roasts
    if (!roastList || roastList.length === 0) {
        if (roasts['generic_severity']) {
            roastList = roasts['generic_severity'][severity] || [];
        }
    }

    // 5. Ultimate Fallback
    if (!roastList || roastList.length === 0) {
        return "Your code is so bad, even my roast database refused to return a result.";
    }

    // Pick random roast
    const roastTemplate = roastList[Math.floor(Math.random() * roastList.length)];

    // Replace variables
    return roastTemplate
        .replace('{file}', issue.file ? issue.file.split(/[/\\]/).pop() : 'this file')
        .replace('{line}', issue.line || '?')
        .replace('{secret_type}', cleanSubtype || 'secret')
        .replace('{vulnerability_type}', issue.subtype || 'issue')
        .replace('{injection_type}', cleanSubtype || 'injection');
}
