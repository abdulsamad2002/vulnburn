const apiKey = "1234567890abcdef1234567890abcdef"; // Hardcoded secret
const password = "password123";

function runCode(code) {
    eval(code); // Dangerous eval
}

console.log("Debugging something important..."); // Console log

function hash(data) {
    return md5(data); // Weak crypto
}
