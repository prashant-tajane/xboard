import magazines from "../data/magazines.js";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

async function fetchNews() {
    try {
        const responses = await Promise.all(
            magazines.map(url => fetch(RSS2JSON + url))
        );
        return await Promise.all(
            responses.map(response => response.json())
        ); 
    } catch (e) {
        return null;
    }
}

function accordionItem({ feed, items }, expanded, id) {
    
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
        <h2 class='accordion-header' id='${ feed.title }'>
            <button class='accordion-button px-0' type='button' data-bs-toggle='collapse' data-bs-target='${ `#collapse-${ id }` }'>
                <span class='angle-down'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                        <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/>
                    </svg>
                </span>
                <span>${ feed.title }</span>
            </button> 
        </h2>
        <div id='${ `collapse-${ id }` }' class='accordion-collapse collapse ${ expanded ? 'show': '' }' data-bs-parent='#topics'>
            <div class='accordion-body p-0'></div>
        </div>
    `;

    item.getElementsByClassName('accordion-body')[0].appendChild(carousel(items, id));
    return item;
}

function carousel(slides, id) {
    const carouselElm = document.createElement('div'); 
    
    carouselElm.id = `carousel-${ id }`;
    carouselElm.className = 'carousel slide';
    carouselElm.setAttribute('data-bs-ride', 'carousel');

    carouselElm.innerHTML = `
        <div class='carousel-inner'></div>
        <button class='carousel-control-prev' type='button' data-bs-target='${ `#carousel-${ id }` }' data-bs-slide='prev'>
            <!-- below svg taken from fontawesome.com -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"/>
            </svg>
            <span class='visually-hidden'>Previous</span>
        </button>
        <button class='carousel-control-next' type='button' data-bs-target='${ `#carousel-${ id }` }' data-bs-slide='next'>
            <!-- below svg taken from fontawesome.com -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"/>
            </svg>
            <span class='visually-hidden'>Next</span>
        </button>
    `;

    const carouselInner = carouselElm.firstElementChild;

    for (let { title, pubDate, author, description, enclosure, link } of slides) {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item`;

        carouselItem.innerHTML = `
            <a href='${ link } target='_blank'>
                <div class='card_image px-4'>
                    <img src=${ enclosure.link } alt='${ title }' class='rounded'/>
                </div>
                <div class='card_body px-5'>
                    <div class='heading my-3'>${ title }</div>
                    <div><span>${ author }</span> <span class="fw-bold">·</span> <span>${ formatDate(pubDate) }</span></div>
                    <div class='description my-3'>${ description }</div>
                </div>
            </a>
        `;

        carouselInner.appendChild(carouselItem);
    }

    carouselInner.firstElementChild.classList.add('active');
    return carouselElm;
}

function formatDate(dateStr) {
    const [y, m, d] = dateStr.slice(0, 10).split('-');
    return `${ d }/${ m }/${ y }`;
}

export { accordionItem, fetchNews };