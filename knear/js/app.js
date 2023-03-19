const k = 3
const machine = new kNear(k)

// training - todo: meerdere voorbeelden voor cats en dogs nodig!
machine.learn([5, 6, 10], 'cat')

// predicting
let prediction = machine.classify([77, 77, 77])
console.log(`I think it's a ${prediction}`)