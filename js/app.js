(function(app){

    app.portfolioItems= [];
    app.selectedItem = {};

    app.homepage= function(){
        setCopyRightDate();
        wireContactForm();
    }

    app.portfolio = async function(){
        await loadPageData();        
        loadPortfolioPageData();
        loadNavMenu();
        setCopyRightDate();        
    }

    app.workItem = async function(){
        setCopyRightDate();
        await loadPageData();
        loadSpecificItem();
        loadNavMenu();  
        updateItemPage();          
    }

    function setCopyRightDate(){
        const date = new Date();
        document.getElementById('copyrightYear').innerText= date.getFullYear();
    }

    function wireContactForm(){
        const contactForm = document.getElementById('contact-form');
        contactForm.onsubmit= contactFormSubmit;
    }

    function contactFormSubmit(e){
        e.preventDefault();
        const contactForm = document.getElementById('contact-form');
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');

        const mailTo= `mailto:${"federicob1399@gmail.com"}?subject=Contact From ${name.value}&body=${message.value}`;
        window.open(mailTo);

        name.value= '';
        email.value= '';
        message.value= '';
    }

    async function loadPageData(){
        const cacheData = sessionStorage.getItem('site-data');
        if(cacheData !== null){
            app.portfolioItems = JSON.parse(cacheData);
        } else{
            const rawData = await fetch('sitedata.json');
            const data = await rawData.json();
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));
        }
    }

    function loadSpecificItem(){
        const params = new URLSearchParams(window.location.search);
        let item = Number.parseInt(params.get('item'));

        if(item > app.portfolioItems.length || item < 1){
            item = 1;
        }

        app.selectedItem = app.portfolioItems[item - 1];
        app.selectedItem.id = item;
    }

    function updateItemPage(){
        const header = document.getElementById('work-item-header');
        header.innerText = `0${app.selectedItem.id}. ${app.selectedItem.title}`;

        const image = document.getElementById('work-item-image');
        image.src = app.selectedItem.largeImage;
        image.alt = app.selectedItem.largeImageAlt;

        const projectText = document.querySelector('#project-text p');
        projectText.innerText = app.selectedItem.projectText;

        const originalTechList = document.querySelector('#technologies-list ul');
        const technologySection = document.getElementById('technologies-list');
        const ul = document.createElement('ul');

        app.selectedItem.technologies.forEach(el=>{
            const li = document.createElement('li');
            li.innerText = el;
            ul.appendChild(li);
        });

        originalTechList.remove();
        technologySection.appendChild(ul);

        const challengesText = document.querySelector('#challenges-text p');
        challengesText.innerText = app.selectedItem.challengesText;

        const span = document.createElement('span');
        span.innerHTML = `Link: <a href="${app.selectedItem.link}">${app.selectedItem.link}<a /><br>`
        const div = document.getElementById('see-live');
        div.appendChild(span);

        app.selectedItem.gitHub.forEach(el=>{
            const span = document.createElement('span');
            span.innerHTML = `GitHub Repository: <a href="${el}">${el}<a /><br>`;            
            div.appendChild(span);
        });

        
        const user = document.createElement('span');
        user.innerHTML = `Test user: <small>${app.selectedItem.testUser}<small/> <br>`;
        const pass = document.createElement('span');
        pass.innerHTML = `Test password: <small>${app.selectedItem.testPassword}<small/>`;

        div.appendChild(user);
        div.appendChild(pass);
        
        
    }

    function loadPortfolioPageData(){
        const originalItems = document.querySelectorAll('.highlight');
        const main = document.getElementById('portfolio-main');
        const newItems = [];
        

        for(let i = 0; i < app.portfolioItems.length; i++){
            const el = app.portfolioItems[i];

            const highlight = document.createElement('div');
            highlight.classList.add('highlight');
            if(i % 2 > 0){
                highlight.classList.add('invert');
            }
            

            const textDiv = document.createElement('div');
            const h2= document.createElement('h2');
            const a = document.createElement('a');

            const titleWords= el.title.split(' ');
            let title = `0${i+1}. `;

            for(let j = 0 ; j < titleWords.length - 1 ; j++){
                title += titleWords[j];
                title += '<br />';
            }
            title += titleWords[titleWords.length -1];

            h2.innerHTML = title;
            a.href= `workitem.html?item=${i+1}`;
            a.innerText = 'see more';

            textDiv.appendChild(h2);
            textDiv.appendChild(a);

            highlight.appendChild(textDiv);

            const img= document.createElement('img');
            img.src= el.smallImg;
            img.alt= el.smallImgAlt;
            highlight.appendChild(img);

            newItems.push(highlight);
        }

        originalItems.forEach(el=> el.remove());
        newItems.forEach(el=> main.appendChild(el));


    }

    function loadNavMenu(){
        const originalNav = document.querySelectorAll('.work-item-nav');
        const nav = document.querySelector('nav ul');

        originalNav.forEach(el=> el.remove());

        for(let i=0; i < app.portfolioItems.length ; i++){
            const li = document.createElement('li');
            li.classList.add('work-item-nav');
            const a = document.createElement('a');
            a.href= `workitem.html?item=${i+1}`;
            a.innerText= `Item #${i+1}`;
            li.appendChild(a);
            nav.appendChild(li);
        }
    }
})(window.app = window.app || {});