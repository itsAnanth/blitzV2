enum HttpTypes {
    GET,
    POST,
    PUT,
    DELETE
}

const httpTypeArray: string[] = [];

for (const i in HttpTypes) {
    if (typeof HttpTypes[i] !== 'string') continue
    httpTypeArray.push(HttpTypes[i]);
}

export default HttpTypes;
export { httpTypeArray, HttpTypes};