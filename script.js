'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const nav = document.querySelector(`.nav`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll (X/Y)`, window.pageXOffset, window.pageYOffset);

  console.log(
    `height/width viewpoint`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  //window.scrollTo(
  //s1coords.left + window.pageXOffset,
  //s1coords.top + window.pageYOffset
  //);
  // window.scrollTo({
  // left: s1coords.left + window.pageXOffset,
  //top: s1coords.top + window.pageYOffset,
  //behavior: 'smooth',
  //});

  // This only works in modern browsers
  section1.scrollIntoView({ behavior: `smooth` });
});

// Page navigation

//document.querySelectorAll(`.nav__link`).forEach(function (el) {
//el.addEventListener(`click`, function (e) {
//e.preventDefault();
//const id = this.getAttribute(`href`);
//console.log(id);
//document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//});
//});

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

// Tabbed component

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));

  // Activate tab
  clicked.classList.add(`operations__tab--active`);

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// Menu fade animation,  event handler like this, can only have one argument like this (e)
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//nav.addEventListener(`mouseout`, function (e) {
//handleHover(e, 1);
//});

// Passing "argument" into handler
nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

// Sticky navigation
//const initialCords = section1.getBoundingClientRect();
//console.log(initialCords);

//window.addEventListener(`scroll`, function () {
//console.log(window.scrollY);
//if (window.scrollY > initialCords.top) nav.classList.add(`sticky`);
//else nav.classList.remove(`sticky`);
//});

// Sticky navigation: Intersaction Observer API

//const obsCallback = function (entries, observer) {
//entries.forEach(entry => {
//console.log(entry);
//});
//};

//const obsOptions = {
//root: null,
//threshhold: [0, 0.2],
//};

//const observer = new IntersectionObserver(obsCallback, obsOptions);
//observer.observe(section1);

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

// Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slides
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  // Previus slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  // initial starter
  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener(`click`, nextSlide);
  // -100%, 0%, 100%, 200%
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = e.target.dataset.slide;
      gotoSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();
////////////////////////////////
///////////////////////////////
//////////////////////////////
/*

// Selecting, Creating, and Deleting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

let header = document.querySelector(`.header`);
let allSections = document.querySelectorAll(`.section`);
console.log(allSections);

document.getElementById(`section--1`);
const allButtons = document.getElementsByTagName(`button`);
console.log(allButtons);

console.log(document.getElementsByClassName(`btn`));

//.insertAdjacentHTML <= wtf is this ???
// Creating and inserting elements
const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
//message.textContent = `We use cookies for improved functionality and analytics`
message.innerHTML = `We use cookies for improved functionality and analytics. <button class= "btn btn--close-cookie">Got it!</button>`;
//header.prepend(message);
header.append(message); // the best looking option to show cookies
//header.append(message.cloneNode(true));

//header.before(message);
//header.after(message);

// Delete the elements
document
  .querySelector(`.btn--close-cookie`)
  .addEventListener(`click`, function () {
    message.remove();
    //message.parentElement.removeChild(message); the old way of removing
  });

// Style, Attributes, Classes
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

//console.log(message.style.height);
//console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;

// this is very cool feature, will remember and repeat
document.documentElement.style.setProperty(`--color-primary`, `orangered`);

const logo = document.querySelector(`.nav__logo`);
console.log(logo.alt);
console.log(logo.className);
//logo.className = `aza__aa`;

logo.alt = `Beautiful minimalistic logo`;

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute(`designer`));
logo.setAttribute(`company`, `Bankist`);

console.log(logo.src);
console.log(logo.getAttribute(`src`));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add(`c`, `j`);
logo.classList.remove(`c`, `j`);
logo.classList.toggle(`c`);
logo.classList.contains(`c`); // not includes

// Dont use this
logo.className = `Azizbek`;


      
      const h1 = document.querySelector(`h1`);
      
      const alertH1 = function (e) {
        alert(`addEventListener: Great! You are reading the heading)`);
      };
      
      h1.addEventListener(`mouseenter`, alertH1);
      
      // remove event listener
      setTimeout(() => h1.removeEventListener(`mouseenter`, alertH1), 3000);
      
      // this is the old way of listening to the enevent
      //h1.onmouseenter = function (e) {
        //alert(`onmouseenter: Great! You are reading the heading)`);
        //};
        
        // Bubbling rgb(255,255,255) random color picker
        const randomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
        //console.log(randomInt(1, 100));
        const randomColor = () =>
        `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
        console.log(randomColor(0, 255));
        
        document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
          this.style.backgroundColor = randomColor();
          console.log(`Link`, e.target, e.currentTarget);
          console.log(e.currentTarget === this);
          
          // Stop propagation // this is a good idea working with complex nested elements
          //e.stopPropagation();
        });
        document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
          this.style.backgroundColor = randomColor();
          console.log(`Container`, e.target, e.currentTarget);
        });
        document.querySelector(`.nav`).addEventListener(`click`, function (e) {
          this.style.backgroundColor = randomColor();
          console.log(`Nav`, e.target, e.currentTarget);
        });
        
        const h1 = document.querySelector(`h1`);
        
        // Going downwards: child
        console.log(h1.querySelectorAll(`.highlight`));
        console.log(h1.childNodes);
        console.log(h1.children);
        h1.firstElementChild.style.color = `white`;
        h1.lastElementChild.style.color = `white`;
        
        // Going upwards: parents
        console.log(h1.parentNode);
        console.log(h1.parentElement);
        
        h1.closest(`.header`).style.background = `var(--gradient-secondary)`;
        //h1.closest(`h1`).style.background = `var(--color-tertiary-darker)`;
        
        // Going sideways: siblings
        console.log(h1.previousElementSibling);
        console.log(h1.nextElementSibling);
        
        console.log(h1.previousSibling);
        console.log(h1.nextSibling);
        
        console.log(h1.parentElement.children);
        [...h1.parentElement.children].forEach(function (el) {
          if (el !== h1) el.style.transform = `scale(0.5)`;
        });
        */
document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML parsed and DOM tree built!`, e);
});

window.addEventListener(`load`, function (e) {
  console.log(`Page fully loaded`, e);
});

//window.addEventListener(`beforeunload`, function (e) {
//e.preventDefault();
//console.log(e);
//e.returnValue = '';
//});
