export const Required = (target:any, key:any, index:any) => {
    const tableIndex = `${key}_arguments`
    if (Array.isArray(target[tableIndex])) {
        target[tableIndex].push(index);
    } else {
        target[tableIndex] = [index];
    }

}
// say(@Required text) {
// }
