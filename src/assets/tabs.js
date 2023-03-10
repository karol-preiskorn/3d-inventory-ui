/*
* File:        /src/assets/tabs.js
* Description:
* Used by:
* Dependency:
*
* Date        By     Comments
* ----------  -----  ---------------------------------------------------------
* 2023-03-09  C2RLO
*/


const triggerTabList = document.querySelectorAll('#myTab a')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})
