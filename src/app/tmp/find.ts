/*
* File:        /src/app/tmp/find.ts
* Description: find object in array
* Used by:
* Dependency:
*
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-02-19  C2RLO
*/


const inventory: { name: string, quantity: number }[] = [
  {name: 'apples', quantity: 2},
  {name: 'bananas', quantity: 0},
  {name: 'cherries', quantity: 5}
];

function findCherries(fruit: { name: string, quantity: number }) {
  return fruit.name === 'x';
}

inventory.find(findCherries); // { name: 'cherries', quantity: 5 }

/* OR */

inventory.find(e => e.name === 'bananas'); // { name: 'apples', quantity: 2 }