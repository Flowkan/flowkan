"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pickDefaultImage() {
    const backend = process.env.BACKEND_URL;
    const defaults = [
        `${backend}/uploads/defaults/1.png`,
        `${backend}/uploads/defaults/2.png`,
        `${backend}/uploads/defaults/3.png`,
        `${backend}/uploads/defaults/4.png`,
        `${backend}/uploads/defaults/5.png`,
        `${backend}/uploads/defaults/6.png`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}
exports.default = pickDefaultImage;
