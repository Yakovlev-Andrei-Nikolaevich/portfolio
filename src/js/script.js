import AOS from 'aos';
import { Valval } from 'valval';

AOS.init();

const preolaider = () => {
    window.addEventListener('load', () => {
        document.documentElement.classList.remove('blur-bg');
    });
    window.addEventListener('DOMContentLoaded', () => {
        document.documentElement.classList.add('blur-bg');
    });
}

preolaider();

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

const getData = async() => {
    const url = '/get/projects';
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await res.json();

    try {
        return data;
    } catch (err) {
        throw err;
    }
}

const createProjects = data => {
    const list = document.querySelector('.projects__examples');

    if (list) {
        data
            .then(array => {
                array.map((item, index) => {
                    const project = `
                    <div class="projects__example" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                        <div class="projects__heading">
                            <h2 class="projects__heading-h2">${item.title}</h2>
                        </div>
                        <ul class="projects__images"></ul>
                    </div>
                `;

                    list.innerHTML += project;

                    const list_images_projects = document.querySelectorAll('.projects__images');

                    item.images.map(img => {
                        const item_img = `
                        <li class="projects__img" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                            <img src="${img.img}" alt="" data-img="view-img" data-slide-text="${img.title ? img.title : ''}">
                        </li>
                    `;

                        list_images_projects[index].innerHTML += item_img;
                    });
                });

                zoomer();
            })
            .catch(err => {
                throw err;
            });
    }
}

createProjects(getData());

function zoomer() {
    const btns = document.querySelectorAll('.zoomer__btn');
    const projects_images = document.querySelectorAll('img[data-img="view-img"]');
    const images = [];
    const list_slides = document.querySelector('.zoomer__list');
    const window_zoom = document.querySelector('.zoomer');
    const btn = document.querySelector('.zoomer__close');
    const header = document.querySelector('.header');

    let count = 0;

    if (list_slides) {
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

        btn.addEventListener('click', () => {
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
}

zoomer();

const addBlocksForFiles = () => {
    const btn = document.querySelector('.admin__form-file-add');
    const list = document.querySelector('.admin__files');

    if (list) {
        btn.addEventListener('click', () => {
            const block = `
                <li>
                    <label class="admin__form-label admin__form-label-file" for="img">Фото, видео</label>
                    <input class="admin__form-file hide" type="file" name="img" id="img" />
                </li>
            `;

            list.innerHTML += block;
        });
    }
}

addBlocksForFiles();

const validationForm = () => {
    const admin_form = document.querySelector('.admin__form-block');
    const admin_panel = document.querySelector('.admin__form-panel');
    const admin_delete_form = document.querySelector('.admin__form-delete');

    const admin_form_options = {
        firstNameAdmin: {
            name: true,
            required: true,
            classInvalid: 'invalid',
            classValid: 'valid'
        },
        passwordAdmin: {
            password: true,
            required: true,
            classInvalid: 'invalid',
            classValid: 'valid'
        }
    }

    admin_form && new Valval().start(admin_form_options);

    const admin_panel_form_options = {
        titleProject: {
            message: true,
            required: true,
            classInvalid: 'invalid',
            classValid: 'valid'
        },
        titleProjectNameImg: {
            message: true,
            required: true,
            classInvalid: 'invalid',
            classValid: 'valid'
        }
    }

    admin_panel && new Valval().start(admin_panel_form_options);

    const admin_delete_form_options = {
        titleProjectToRemove: {
            message: true,
            required: true,
            classInvalid: 'invalid',
            classValid: 'valid'
        }
    }

    admin_delete_form && new Valval().start(admin_delete_form_options);
}

validationForm();

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