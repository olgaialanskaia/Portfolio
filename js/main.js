{
    class Details {
        constructor() {
            this.DOM = {};

            const detailsTmpl = `
            <div class="details__bg details__bg--up"></div>
            <div class="details__bg details__bg--down"></div>
            <img class="details__img" src="" alt="img 01"/>
            <h2 class="details__title"></h2>
            <div class="details__deco"></div>
            <h3 class="details__subtitle"></h3>
            <a class="details__site" target="_blank" href="">
              <i class="fas fa-arrow-alt-circle-right"></i>
            </a>
            <p class="details__description"></p>
            <a class="details__source" target="_blank" href="">
              <i class="fab fa-github fa-lg mr-2"></i>
            </a>
            <button class="details__close"><svg class="icon icon--cross"><use xlink:href="#icon-cross"></use></svg></button>
            <button class="details__magnifier"><svg class="icon icon--magnifier"><use xlink:href="#icon-magnifier"></use></svg></button>
            `;

            this.DOM.details = document.createElement('div');
            this.DOM.details.className = 'details';
            this.DOM.details.innerHTML = detailsTmpl;
            DOM.content.appendChild(this.DOM.details);
            this.init();
        }
        init() {
            this.DOM.bgUp = this.DOM.details.querySelector('.details__bg--up');
            this.DOM.bgDown = this.DOM.details.querySelector('.details__bg--down');
            this.DOM.img = this.DOM.details.querySelector('.details__img');
            this.DOM.title = this.DOM.details.querySelector('.details__title');
            this.DOM.deco = this.DOM.details.querySelector('.details__deco');
            this.DOM.subtitle = this.DOM.details.querySelector('.details__subtitle');
            this.DOM.site = this.DOM.details.querySelector('.details__site');
            this.DOM.description = this.DOM.details.querySelector('.details__description');
            this.DOM.source = this.DOM.details.querySelector('.details__source');
            this.DOM.close = this.DOM.details.querySelector('.details__close');
            this.DOM.magnifier = this.DOM.details.querySelector('.details__magnifier');

            this.initEvents();
        }
        initEvents() {
            this.DOM.close.addEventListener('click', () => this.isZoomed ? this.zoomOut() : this.close());
            this.DOM.magnifier.addEventListener('click', () => this.zoomIn());
        }
        fill(info) {
            this.DOM.img.src = info.img;
            this.DOM.title.innerHTML = info.title;
            this.DOM.deco.style.backgroundImage = `url(${info.img})`;
            this.DOM.subtitle.innerHTML = info.subtitle;
            this.DOM.site.href = info.site;
            this.DOM.description.innerHTML = info.description;
            this.DOM.source.href = info.source;
        }
                getProjectDetailsRect() {
            return {
                projectBgRect: this.DOM.projectBg.getBoundingClientRect(),
                detailsBgRect: this.DOM.bgDown.getBoundingClientRect(),
                projectImgRect: this.DOM.projectImg.getBoundingClientRect(),
                detailsImgRect: this.DOM.img.getBoundingClientRect(),
            };
        }
        open(data) {
            if ( this.isAnimating ) return false;
            this.isAnimating = true;

            this.DOM.details.classList.add('details--open');

            this.DOM.projectBg = data.projectBg;
            this.DOM.projectImg = data.projectImg;

            this.DOM.projectBg.style.opacity = 0;
            this.DOM.projectImg.style.opacity = 0;

            const rect = this.getProjectDetailsRect();

            this.DOM.bgDown.style.transform = `translateX(${rect.projectBgRect.left-rect.detailsBgRect.left}px) translateY(${rect.projectBgRect.top-rect.detailsBgRect.top}px) scaleX(${rect.projectBgRect.width/rect.detailsBgRect.width}) scaleY(${rect.projectBgRect.height/rect.detailsBgRect.height})`;
            this.DOM.bgDown.style.opacity = 1;

            this.DOM.img.style.transform = `translateX(${rect.projectImgRect.left-rect.detailsImgRect.left}px) translateY(${rect.projectImgRect.top-rect.detailsImgRect.top}px) scaleX(${rect.projectImgRect.width/rect.detailsImgRect.width}) scaleY(${rect.projectImgRect.height/rect.detailsImgRect.height})`;
            this.DOM.img.style.opacity = 1;

            anime({
                targets: [this.DOM.bgDown,this.DOM.img],
                duration: (target, index) => index ? 800 : 250,
                easing: (target, index) => index ? 'easeOutElastic' : 'easeOutSine',
                elasticity: 250,
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1,
                complete: () => this.isAnimating = false
            });

            anime({
                targets: [this.DOM.title, this.DOM.deco, this.DOM.subtitle, this.DOM.site, this.DOM.description, this.DOM.source, this.DOM.magnifier],
                duration: 600,
                easing: 'easeOutExpo',
                delay: (target, index) => {
                    return index*60;
                },
                translateY: (target, index, total) => {
                    return index !== total - 1 ? [50,0] : 0;
                },
                scale:  (target, index, total) => {
                    return index === total - 1 ? [0,1] : 1;
                },
                opacity: 1
            });

            anime({
                targets: this.DOM.bgUp,
                duration: 100,
                easing: 'linear',
                opacity: 1
            });

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: ['100%',0],
                opacity: 1
            });

            anime({
                targets: DOM.hamburger,
                duration: 250,
                easing: 'easeOutSine',
                translateY: [0,'-100%']
            });
        }
        close() {
            if ( this.isAnimating ) return false;
            this.isAnimating = true;

            this.DOM.details.classList.remove('details--open');

            anime({
                targets: DOM.hamburger,
                duration: 250,
                easing: 'easeOutSine',
                translateY: 0
            });

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: '100%',
                opacity: 0
            });

            anime({
                targets: this.DOM.bgUp,
                duration: 100,
                easing: 'linear',
                opacity: 0
            });

            anime({
                targets: [this.DOM.title, this.DOM.deco, this.DOM.subtitle, this.DOM.site, this.DOM.description, this.DOM.source, this.DOM.magnifier],
                duration: 20,
                easing: 'linear',
                opacity: 0
            });

            const rect = this.getProjectDetailsRect();
            anime({
                targets: [this.DOM.bgDown,this.DOM.img],
                duration: 250,
                easing: 'easeOutSine',
                translateX: (target, index) => {
                    return index ? rect.projectImgRect.left-rect.detailsImgRect.left : rect.projectBgRect.left-rect.detailsBgRect.left;
                },
                translateY: (target, index) => {
                    return index ? rect.projectImgRect.top-rect.detailsImgRect.top : rect.projectBgRect.top-rect.detailsBgRect.top;
                },
                scaleX: (target, index) => {
                    return index ? rect.projectImgRect.width/rect.detailsImgRect.width : rect.projectBgRect.width/rect.detailsBgRect.width;
                },
                scaleY: (target, index) => {
                    return index ? rect.projectImgRect.height/rect.detailsImgRect.height : rect.projectBgRect.height/rect.detailsBgRect.height;
                },
                complete: () => {
                    this.DOM.bgDown.style.opacity = 0;
                    this.DOM.img.style.opacity = 0;
                    this.DOM.bgDown.style.transform = 'none';
                    this.DOM.img.style.transform = 'none';
                    this.DOM.projectBg.style.opacity = 1;
                    this.DOM.projectImg.style.opacity = 1;
                    this.isAnimating = false;
                }
            });
        }
        zoomIn() {
            this.isZoomed = true;

            anime({
                targets: [this.DOM.title, this.DOM.deco, this.DOM.subtitle, this.DOM.site, this.DOM.description, this.DOM.source, this.DOM.magnifier],
                duration: 100,
                easing: 'easeOutSine',
                translateY: (target, index, total) => {
                    return index !== total - 1 ? [0, index === 0 || index === 1 ? -50 : 50] : 0;
                },
                scale:  (target, index, total) => {
                    return index === total - 1 ? [1,0] : 1;
                },
                opacity: 0
            });

            const imgrect = this.DOM.img.getBoundingClientRect();
            const win = {w: window.innerWidth, h: window.innerHeight};

            const imgAnimeOpts = {
                targets: this.DOM.img,
                duration: 250,
                easing: 'easeOutCubic',
                translateX: win.w/2 - (imgrect.left+imgrect.width/2),
                translateY: win.h/2 - (imgrect.top+imgrect.height/2)
            };

            if ( win.w > 0.8*win.h ) {
                this.DOM.img.style.transformOrigin = '50% 50%';
                Object.assign(imgAnimeOpts, {
                    scaleX: 0.95*win.w/parseInt(1.5*win.h),
                    scaleY: 0.95*win.w/parseInt(1.5*win.h),
                    rotate: 0
                });
            }
            anime(imgAnimeOpts);

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeInOutCubic',
                scale: 1.8,
                rotate: 180
            });
        }
        zoomOut() {
            if ( this.isAnimating ) return false;
            this.isAnimating = true;
            this.isZoomed = false;

            anime({
                targets: [this.DOM.title, this.DOM.deco, this.DOM.subtitle, this.DOM.site, this.DOM.description, this.DOM.source, this.DOM.magnifier],
                duration: 250,
                easing: 'easeOutCubic',
                translateY: 0,
                scale: 1,
                opacity: 1
            });

            anime({
                targets: this.DOM.img,
                duration: 250,
                easing: 'easeOutCubic',
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1,
                rotate: 0,
                complete: () => {
                    this.DOM.img.style.transformOrigin = '0 0';
                    this.isAnimating = false;
                }
            });

            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeInOutCubic',
                scale: 1,
                rotate: 0
            });
        }
    };

    class Item {
		    constructor(el) {
			      this.DOM = {};
            this.DOM.el = el;
            this.DOM.project = this.DOM.el.querySelector('.project');
            this.DOM.projectBg = this.DOM.project.querySelector('.project__bg');
            this.DOM.projectImg = this.DOM.project.querySelector('.project__img');
            this.DOM.projectSrc = this.DOM.project.querySelector('.project__source');
            this.DOM.projectSite = this.DOM.project.querySelector('.project__site')

            this.info = {
                img: this.DOM.projectImg.src,
                source: this.DOM.projectSrc,
                title: this.DOM.project.querySelector('.project__title').innerHTML,
                subtitle: this.DOM.project.querySelector('.project__subtitle').innerHTML,
                description: this.DOM.project.querySelector('.project__description').innerHTML,
                site: this.DOM.projectSite
            };

			      this.initEvents();
		    }
        initEvents() {
            this.DOM.project.addEventListener('click', () => this.open());
        }
        open() {
            DOM.details.fill(this.info);
            DOM.details.open({
                projectBg: this.DOM.projectBg,
                projectImg: this.DOM.projectImg,
            });
        }
    };

    const DOM = {};
    DOM.grid = document.querySelector('.grid');
    DOM.content = DOM.grid.parentNode;
    DOM.hamburger = document.querySelector('.dummy-menu');
    DOM.gridItems = Array.from(DOM.grid.querySelectorAll('.grid__item'));
    let items = [];
    DOM.gridItems.forEach(item => items.push(new Item(item)));

    DOM.details = new Details();

    imagesLoaded(document.body, () => document.body.classList.remove('loading'));
};
