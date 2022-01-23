const fullNames = [
    { first: 'Albus', last: 'Dumbledore' },
    { first: 'Harry', last: 'Potter' },
    { first: 'Hermione', last: 'Granger' },
    { first: 'Ron', last: 'Weasley' },
    { first: 'Rubeus', last: 'Hagrid' },
    { first: 'Minerva', last: 'McGonagall' },
    { first: 'Severus', last: 'Snape' }
];


fullNames.push({first:"Andrei" , last:"Panaite"})

let some = fullNames.map(({first , last}) => {
    return `First name is ${first}  and last name is ${last}`
})

console.log(some);



