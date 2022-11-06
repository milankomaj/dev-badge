const badgeList = document.querySelector('.badge-list');
const filterInput = document.querySelector('.filter-badges');
// get list of user's public badges
const getbadges = async () => {
    let badges = [];
    let res;
    res = await fetch(
        `https://sheet.eleonora.workers.dev/1XskoOd9teJfO9KVkZDM3-T-5BAsJKr2B1QdpP-s37Wc/badge-dev`
    );
    let data = await res.json();
    badges = data;
    displaybadges(badges);
};
getbadges();
// display list of all user's public badges
const displaybadges = (badges) => {
    filterInput.classList.remove('hide');
    for (const badge of badges) {
        let listItem = document.createElement('li');
        listItem.classList.add('badge');
        listItem.innerHTML = `
           <h2>${badge.service}</h2>
            <img alt="img url" src=${badge.url} />`
        if (badge.handler && badge.case) {
            listItem.innerHTML += `
              <h3>${badge.handler}</h3>
              <a href="${badge.url}"><span>${badge.case}</span></a>`
        }
        if (badge.status != "#NAME?") {
            listItem.innerHTML += `
              <p>${badge.status}</p>`
        }
        if (badge.info) {
            listItem.innerHTML += `
              <p>* ${badge.info}</p>`
        }
        badgeList.append(listItem);
    }
};
// dynamic search
filterInput.addEventListener('input', (e) => {
    const search = e.target.value;
    const badges = document.querySelectorAll('.badge');
    const searchLowerText = search.toLowerCase();
    for (const badge of badges) {
        const lowerText = badge.innerText.toLowerCase();
        if (lowerText.includes(searchLowerText)) {
            badge.classList.remove('hide');
        } else {
            badge.classList.add('hide');
        }
    }
});
// loader spinner
window.addEventListener("load", function () {
    const loaderel = document.querySelector("#loader");
    const v2 = (window.performance.getEntriesByType("navigation")[0].domComplete);
    const v1 = (window.performance.timing.domComplete - window.performance.timing.navigationStart)
    if (v2 || v1) {
        loaderel.style.display = "none";
        console.log(JSON.parse(JSON.stringify('v1 ⏲  ' + v1 + " ms")))
        console.log(JSON.parse(JSON.stringify('v2 ⏲  ' + (window.performance.getEntriesByType("navigation")[0].domComplete + " ms"))))
    }
});
