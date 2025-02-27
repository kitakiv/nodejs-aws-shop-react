
function generateUUID4() {
    return Math.abs(Math.random() * 0xFFFFFFFF | 0).toString(36);
}
function uuid() {
    return [
        generateUUID4(), generateUUID4(), generateUUID4(), generateUUID4()
    ].join("-");
}

export default uuid;