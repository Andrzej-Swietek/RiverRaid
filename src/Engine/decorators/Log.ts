export function Log(target: object, name: string, descriptor: object) {
    console.log('%c Dekorator', 'color: purple')
    console.log(target)
    console.log(name)
    console.log(descriptor)
}
