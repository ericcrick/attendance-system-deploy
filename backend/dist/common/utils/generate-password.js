"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemporaryPassword = generateTemporaryPassword;
const crypto_1 = require("crypto");
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
const ALL = UPPER + LOWER + DIGITS;
function generateTemporaryPassword(length = 12) {
    const pick = (set) => set[(0, crypto_1.randomInt)(set.length)];
    const required = [pick(UPPER), pick(LOWER), pick(DIGITS)];
    const rest = Array.from({ length: length - required.length }, () => pick(ALL));
    const chars = [...required, ...rest];
    for (let i = chars.length - 1; i > 0; i--) {
        const j = (0, crypto_1.randomInt)(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
}
//# sourceMappingURL=generate-password.js.map