export function createRegResponse(name, index, error = false, errorText = "") {
    const data = JSON.stringify({
        name,
        index,
        error,
        errorText,
    });
    const response = {
        type: "reg",
        data,
        id: 0,
    };
    return JSON.stringify(response);
}
export function createResponse(type, data, id = 0) {
    const jsonData = data && JSON.stringify(data);
    const response = {
        type,
        data: jsonData,
        id,
    };
    return JSON.stringify(response);
}
export const random = (x) => Math.floor(Math.random() * x);
//# sourceMappingURL=utils.js.map