const getFloors = document.getElementById('floors');
const getlifts = document.getElementById('lifts');
const submitbtn = document.getElementById('submitbtn');
const body  = document.querySelector('body');

submitbtn.addEventListener('click', function () {
    const floors = getFloors.value;
    const lifts = getlifts.value;
    alert(`You have selected ${floors} floors and ${lifts} lifts`);
    generateUI(floors, lifts);
})

function generateUI(floors, lifts) {
    generateFloors(floors);
}

function generateFloors(floors) {
    const product = document.createElement('div');
    product.classList.add('product');
    for (let i = 0; i <= floors; i++) {
        const floor = document.createElement('div');
        floor.classList.add('floor');
        product.appendChild(floor);
    }
    console.log(floors);
    body.appendChild(product);
    console.log(product);
}