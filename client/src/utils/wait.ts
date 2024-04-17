// function wait(ms: number) {
//     return new Promise(res => {
//         setTimeout(res, ms);
//     })
// }


const wait = (ms: number): any => new Promise(res => setTimeout(res, ms))
export default wait;