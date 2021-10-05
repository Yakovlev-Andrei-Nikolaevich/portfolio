import AOS from 'aos';

AOS.init();

const preloader = () => {
    const preloader_block = document.querySelector('.preloader');

    window.addEventListener('load', () => {
        document.documentElement.classList.remove('no-scroll');
        preloader_block.classList.add('hide');
    });
    window.addEventListener('DOMContentLoaded', () => {
        document.documentElement.classList.add('no-scroll');
        preloader_block.classList.remove('hide');
    });
}

preloader();

const scrollDown = () => {
    const btn = document.querySelector('.title__btn-down');
    const block = document.querySelector('.skills');

    if (btn) {
        btn.addEventListener('click', () => {
            block.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }
}

scrollDown();

function zoomer() {
    const btns = document.querySelectorAll('.zoomer__btn');
    const projects_images = document.querySelectorAll('img[data-img="view-img"]');
    const images = [];
    const list_slides = document.querySelector('.zoomer__list');
    const window_zoom = document.querySelector('.zoomer');
    const btn = document.querySelector('.zoomer__close');
    const header = document.querySelector('.header');

    let count = 0;

    projects_images.forEach(img => {
      const obj = {
        el: img
      };

      if (img.dataset.slideText) {
          obj.text = img.dataset.slideText;
      }

      images.push(obj);
  });

  const createSlides = () => {
      images.map(item => {
          const slide = `
              <li class="zoomer__list-slide">
                  <div class="zoomer__list-slide-block zoomer__list-slide-block-img">
                      <img src="${item.el.src}" alt="">
                  </div>
                  <div class="zoomer__list-slide-block zoomer__list-slide-block-text" style="display: ${item.text ? 'block' : 'none'};">
                      <span>${item.text ? item.text : ''}</span>
                  </div>
              </li>
          `;

          list_slides.innerHTML += slide;
      });
  }

  createSlides();

  const addActiveClass = (array, index, classAdd, classRemove) => {
      array[index].classList.add(classAdd);
      array[index].classList.remove(classRemove);
  };

  const removeActiveClass = (array, classAdd, classRemove) => {
      array.forEach(item => item.classList.remove(classRemove));
      array.forEach(item => item.classList.add(classAdd));
  }

  const slides = document.querySelectorAll('.zoomer__list-slide');

  projects_images.forEach((img, index) => {
      img.addEventListener('click', () => {
          count = index;

          removeActiveClass(slides, 'hide', 'active-slide');
          addActiveClass(slides, index, 'active-slide', 'hide');

          document.documentElement.classList.add('no-scroll');
          window_zoom.classList.remove('hide-animation');

          header.style.display = 'none';
      });
  });

  window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
          window_zoom.classList.add('hide-animation');
          document.documentElement.classList.remove('no-scroll');

          removeActiveClass(slides, 'hide', 'active-slide');

          header.style.display = 'block';
      }
  });

  btn.addEventListener('click', e => {
      e.stopPropagation();

      window_zoom.classList.add('hide-animation');
      document.documentElement.classList.remove('no-scroll');

      header.style.display = 'block';
  });

  const checkCount = () => {
    if (count > slides.length - 1) {
      count = 0;
    } else if (count < 0) {
      count = slides.length - 1;
    }
  }

  btns.forEach(btn => {
      btn.addEventListener('click', () => {
          const data = btn.dataset.btn;

          if (data === 'prev') {
              count--;
              checkCount();
              removeActiveClass(slides, 'hide', 'active-slide');
              addActiveClass(slides, count, 'active-slide', 'hide');
          }

          if (data === 'next') {
              count++;
              checkCount();
              removeActiveClass(slides, 'hide', 'active-slide');
              addActiveClass(slides, count, 'active-slide', 'hide');
          }
      });
  });
}

zoomer();

const scrollUp = () => {
  const btn = document.querySelector('.btn-arrow-up');
  
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

scrollUp();

const showArrowUp = () => {
    const arrow = document.querySelector('.btn-arrow-up');

    window.addEventListener('scroll', () => {
        if (pageYOffset >= 650) {
            arrow.classList.add('show-btn');
        } else {
            arrow.classList.remove('show-btn');
        }
    });
}

showArrowUp();

const showMenu = () => {
  const btn = document.querySelector('.header__btn');
  const menu = document.querySelector('.header__nav');
  const lines = document.querySelectorAll('.header__btn span');
  const header = document.querySelector('.header');

  let open = false;

  btn.addEventListener('click', () => {
    menu.classList.toggle('show-right');
    document.documentElement.classList.toggle('no-scroll');

    open = !open;

    rotateLines();
    checkHeightHeader();
  });

  header.addEventListener('click', e => {
    if (e.target.classList.contains('container')) {
      menu.classList.remove('show-right');
      document.documentElement.classList.remove('no-scroll');

      open = false;

      rotateLines();
      checkHeightHeader();
    }
  });

  function rotateLines() {
    if (open) {
        lines[1].classList.add('hide');

        lines[0].style.transform = 'rotateZ(45deg)';
        lines[0].style.bottom = '0';
        lines[0].style.top = '0';
        lines[2].style.transform = 'rotateZ(-45deg)';
        lines[2].style.bottom = '0';
        lines[2].style.top = '0';
    } else {
        lines[1].classList.remove('hide');

        lines[2].style.transform = 'rotateZ(0deg)';
        lines[2].style.bottom = '9px';
        lines[2].style.top = '';
        lines[0].style.transform = 'rotateZ(0deg)';
        lines[0].style.top = '9px';
        lines[0].style.bottom = '';
    }
  } 

  function checkHeightHeader() {
    header.style.height = open ? '100%' : '50px';
  }
}

showMenu();