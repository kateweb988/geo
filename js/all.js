document.addEventListener("DOMContentLoaded", () => {
  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
      this._isDocuments = !!this._elTabs.closest('.documents'); // Только для .documents
      this._elButtons = this._elTabs.querySelectorAll('.tabs__btn');
      this._elPanes = this._elTabs.querySelectorAll('.tabs__pane');
      this._elSelectWrapper = this._isDocuments
        ? this._elTabs.querySelector('.tabs__select-wrapper')
        : null;
      this._elSelect = this._isDocuments
        ? this._elTabs.querySelector('.tabs__select')
        : null;
      this._eventShow = new Event('tab.itc.change');
      this._init();
      this._events();
      if (this._isDocuments) {
        this._responsive();
        window.addEventListener('resize', () => this._responsive());
      }
    }

    _init() {
      this._elTabs.setAttribute('role', 'tablist');
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute('role', 'tab');
        this._elPanes[index].setAttribute('role', 'tabpanel');
      });
      if (this._isDocuments) this._createSelect();
    }

    _createSelect() {
      this._elSelect.innerHTML = '';
      this._elButtons.forEach((btn, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = btn.textContent.trim();
        this._elSelect.appendChild(option);
      });
      this._elSelect.addEventListener('change', (e) => {
        this.showByIndex(e.target.value);
      });
    }

    _responsive() {
      if (window.innerWidth <= 768) {
        this._elTabs.querySelector('.tabs__nav').style.display = 'none';
        this._elSelectWrapper.style.display = '';
        this._elSelect.selectedIndex = this._elTabs.querySelector('.tabs__btn_active')?.dataset.index || 0;
      } else {
        this._elTabs.querySelector('.tabs__nav').style.display = '';
        this._elSelectWrapper.style.display = 'none';
      }
    }

    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector('.tabs__btn_active');
      const elPaneShow = this._elTabs.querySelector('.tabs__pane_show');
      if (elLinkTarget === elLinkActive) return;

      elLinkActive?.classList.remove('tabs__btn_active');
      elPaneShow?.classList.remove('tabs__pane_show');
      elLinkTarget.classList.add('tabs__btn_active');
      elPaneTarget.classList.add('tabs__pane_show');
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();

      // Обновить <select> только в .documents
      if (this._isDocuments) {
        this._elSelect.selectedIndex = elLinkTarget.dataset.index;
      }
    }

    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      if (elLinkTarget) this.show(elLinkTarget);
    }

    _events() {
      this._elTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.tabs__btn');
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  // Инициализировать все табы на странице
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    new ItcTabs(tabsEl);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    $('[data-submit]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }
    $('.js-form').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Scroll
  $('.go_to').click(function () { // ловим клик по ссылке с классом go_to
    var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .
    if ($(scroll_el).length != 0) { // проверим существование элемента чтобы избежать ошибки
      $('html, body').animate({ scrollTop: $(scroll_el).offset().top - 100 }, 800); // анимируем скроолинг к элементу scroll_el
    }
    return false; // выключаем стандартное действие
  });
});
window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons = document.getElementsByClassName("accordeon__button");

  for (var i = 0; i < accordeonButtons.length; i++) {
    var accordeonButton = accordeonButtons[i];

    // Проверка: если в header
    if (accordeonButton.closest('.header-accordeon')) {
      const item = accordeonButton.closest('.accordeon__item');

      item.addEventListener("mouseover", () => toggleItemsHover(item));
      item.addEventListener("mouseleave", closeAllItems);
    } else {
      // Клик для остальных
      accordeonButton.addEventListener("click", toggleItemsClick, false);
    }
  }

  function closeAllItems() {
    var accordeonButtons = document.getElementsByClassName("accordeon__button");
    for (var i = 0; i < accordeonButtons.length; i++) {
      accordeonButtons[i].className = "accordeon__button closed";
    }
    var panels = document.getElementsByClassName("accordeon__panel");
    for (var z = 0; z < panels.length; z++) {
      panels[z].style.maxHeight = 0;
    }
  }

  function toggleItemsClick() {
    var itemClass = this.className;

    closeAllItems();

    if (itemClass === "accordeon__button closed") {
      this.className = "accordeon__button active";
      var panel = this.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  function toggleItemsHover(item) {
    closeAllItems();

    var button = item.querySelector('.accordeon__button');
    var panel = item.querySelector('.accordeon__panel');

    if (button && panel) {
      button.className = "accordeon__button active";
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  $('.articmodal-close').click(function (e) {
    $.arcticmodal('close');

  });
  $('.call, .a1').click(function (e) {
    e.preventDefault();
    $('#popup-call').arcticmodal({
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.custom-select').forEach(select => {
    const display = select.querySelector('.select-display');
    const checkboxes = select.querySelectorAll('input[type="checkbox"]');

    display.addEventListener('click', (e) => {
      // Закрываем все другие селекты
      document.querySelectorAll('.custom-select').forEach(s => {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const checkedCount = select.querySelectorAll('input[type="checkbox"]:checked').length;
        display.textContent = checkedCount > 0 ? `Выбрано: ${checkedCount}` : 'Выбрать';
      });
    });
  });

  // Закрытие при клике вне любого селекта
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select').forEach(select => {
      if (!select.contains(e.target)) {
        select.classList.remove('open');
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('openFilters');
  const closeBtn = document.getElementById('closePopup');
  const toMaterialsBtn = document.getElementById('toMaterials');
  const popup = document.getElementById('filterPopup');
  const materialList = document.getElementById('materialList');
  const materialItems = document.querySelectorAll('.material');
  const checkboxLists = document.querySelectorAll('.checkbox-list');
  const selectedFiltersContainer = document.getElementById('selectedFilters');
  const allCheckboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
  const resetBtn = document.getElementById('resetFilters');  // Кнопка сброса фильтра

  // Показать главное меню фильтров
  function showMainMenu() {
    popup.style.display = 'flex';
    materialList.classList.add('active');
    checkboxLists.forEach(list => list.classList.remove('active'));
    closeBtn.style.display = 'inline-flex';
    toMaterialsBtn.style.display = 'none';
  }

  // Обновление видимости кнопки сброса
  function updateResetButtonVisibility() {
    const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked);
    resetBtn.style.display = anyChecked ? 'inline-flex' : 'none';
  }

  // Создание тега выбранного фильтра
  function createTag(labelText, checkbox) {
    const tag = document.createElement('div');
    tag.classList.add('filter-tag');
    tag.setAttribute('data-checkbox-id', checkbox.id);
    tag.innerHTML = `${labelText} <span style="cursor:pointer;"></span>`;

    // При клике на крестик снимаем чекбокс и удаляем тег
    tag.querySelector('span').addEventListener('click', () => {
      checkbox.checked = false;
      tag.remove();
      updateResetButtonVisibility();
    });

    selectedFiltersContainer.appendChild(tag);
  }

  // Обработчики кликов и событий

  openBtn.addEventListener('click', showMainMenu);

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  toMaterialsBtn.addEventListener('click', showMainMenu);

  materialItems.forEach(item => {
    item.addEventListener('click', () => {
      const material = item.dataset.material;
      materialList.classList.remove('active');
      checkboxLists.forEach(list => {
        list.classList.toggle('active', list.dataset.material === material);
      });
      closeBtn.style.display = 'none';
      toMaterialsBtn.style.display = 'inline-flex';
    });
  });

  allCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      const existingTag = selectedFiltersContainer.querySelector(`[data-checkbox-id="${checkbox.id}"]`);

      if (checkbox.checked) {
        if (!existingTag && label) {
          createTag(label.textContent.trim(), checkbox);
        }
      } else {
        if (existingTag) {
          existingTag.remove();
        }
      }
      updateResetButtonVisibility();
    });
  });

  resetBtn.addEventListener('click', () => {
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    selectedFiltersContainer.innerHTML = '';
    updateResetButtonVisibility();
  });

  // Изначально прячем кнопку сброса
  updateResetButtonVisibility();
});


document.addEventListener('DOMContentLoaded', function () {
  const swiper1 = new Swiper('.swiper1', {
    speed: 800, // Плавность прокрутки
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    pagination: {
      el: ".swiper-pagination1",
      type: "fraction",
      formatFractionCurrent: function (number) {
        return number < 10 ? '0' + number : number;
      },
      formatFractionTotal: function (number) {
        return number < 10 ? '0' + number : number;
      }
    },
    navigation: {
      nextEl: ".swiper-button-next1",
      prevEl: ".swiper-button-prev1",
    },
    on: {
      slideChangeTransitionStart: () => {
        document.querySelectorAll('.swiper-slide .header__box').forEach(box => {
          box.classList.remove('fade-up');
        });
      },
      slideChangeTransitionEnd: () => {
        const activeSlide = document.querySelector('.swiper-slide-active .header__box');
        if (activeSlide) {
          activeSlide.classList.add('fade-up');
        }
      }
    }
  });
  const swiper2 = new Swiper('.swiper2', {
    speed: 800, // скорость анимации свайпа в мс
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination2",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next2",
      prevEl: ".swiper-button-prev2",
    },
    on: {
      slideChangeTransitionStart: () => {
        document.querySelectorAll('.swiper-slide .industry__box').forEach(box => {
          box.classList.remove('fade-up');
        });
      },
      slideChangeTransitionEnd: () => {
        const activeSlide = document.querySelector('.swiper-slide-active .industry__box');
        if (activeSlide) {
          activeSlide.classList.add('fade-up');
        }
      }
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 2,
    spaceBetween: 24,
    navigation: {
      nextEl: ".swiper-button-next3",
      prevEl: ".swiper-button-prev3",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 15,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 15,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 24,
        slidesPerView: 2
      }
    }
  });
  const swiper4 = new Swiper('.swiper4', {
    slidesPerView: 3,
    spaceBetween: 24,
    navigation: {
      nextEl: ".swiper-button-next4",
      prevEl: ".swiper-button-prev4",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 16,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 24,
        slidesPerView: 3
      }
    }
  });
  const swiper5 = new Swiper('.swiper5', {
    slidesPerView: 4,
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination5",
      type: "fraction",
      formatFractionCurrent: function (number) {
        return number < 10 ? '0' + number : number;
      },
      formatFractionTotal: function (number) {
        return number < 10 ? '0' + number : number;
      }
    },
    navigation: {
      nextEl: ".swiper-button-next5",
      prevEl: ".swiper-button-prev5",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 16,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 16,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 24,
        slidesPerView: 4
      }
    }
  });
  const swiper6 = new Swiper('.swiper6', {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination6",
      type: "fraction",
      formatFractionCurrent: function (number) {
        return number < 10 ? '0' + number : number;
      },
      formatFractionTotal: function (number) {
        return number < 10 ? '0' + number : number;
      }
    },
    navigation: {
      nextEl: ".swiper-button-next6",
      prevEl: ".swiper-button-prev6",
    }
  });
  const swiper7 = new Swiper('.swiper7', {
    slidesPerView: 4,
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination7",
      type: "fraction",
      formatFractionCurrent: function (number) {
        return number < 10 ? '0' + number : number;
      },
      formatFractionTotal: function (number) {
        return number < 10 ? '0' + number : number;
      }
    },
    allowTouchMove: window.innerWidth <= 768, // разрешить свайп только на мобилках
    navigation: {
      nextEl: ".swiper-button-next7",
      prevEl: ".swiper-button-prev7",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 16,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 16,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 24,
        slidesPerView: 4
      }
    }
  });
});
// document.querySelectorAll('.nav__list li').forEach(item => {
//   const navItems = document.querySelectorAll('.nav__list > li');
//   const nav = document.querySelector('.nav');

//   navItems.forEach((item, index) => {
//     const mainLink = item.querySelector(':scope > a');
//     if (!mainLink) return;

//     item.addEventListener('mouseenter', () => {
//       // Добавляем класс 'active' только если это не последний элемент
//       if (index !== navItems.length - 1) {
//         nav.classList.add('active');
//       }

//       navItems.forEach(otherItem => {
//         const otherLink = otherItem.querySelector(':scope > a');
//         if (otherItem !== item && otherLink) {
//           otherLink.style.color = '#8A8E92';
//         }
//       });
//     });

//     item.addEventListener('mouseleave', () => {
//       nav.classList.remove('active');

//       navItems.forEach(otherItem => {
//         const otherLink = otherItem.querySelector(':scope > a');
//         if (otherLink) {
//           otherLink.style.color = '';
//         }
//       });
//     });
//   });
// });


document.querySelectorAll('.nav__list li').forEach(item => {
  const navItems = document.querySelectorAll('.nav__list > li');
  const nav = document.querySelector('.nav');

  navItems.forEach((item, index) => {
    const mainLink = item.querySelector(':scope > a');
    if (!mainLink) return;

    item.addEventListener('mouseenter', () => {
      // Удаляем все классы active_*
      nav.classList.forEach(cls => {
        if (cls.startsWith('active_')) {
          nav.classList.remove(cls);
        }
      });

      // Добавляем модификатор, только если не последний пункт
      if (index !== navItems.length - 1) {
        nav.classList.add('active', `active_${index + 1}`);
      }

      // Обесцвечиваем остальные пункты
      navItems.forEach(otherItem => {
        const otherLink = otherItem.querySelector(':scope > a');
        if (otherItem !== item && otherLink) {
          otherLink.style.color = '#8A8E92';
        }
      });
    });

    item.addEventListener('mouseleave', () => {
      // Удаляем все классы active и active_*
      nav.classList.remove('active');
      nav.classList.forEach(cls => {
        if (cls.startsWith('active_')) {
          nav.classList.remove(cls);
        }
      });

      // Возвращаем цвета ссылкам
      navItems.forEach(otherItem => {
        const otherLink = otherItem.querySelector(':scope > a');
        if (otherLink) {
          otherLink.style.color = '';
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.menu');
  const body = document.body;

  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');

    // Добавление/удаление overflow: hidden у body
    if (menu.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });
});
document.querySelectorAll('.submenu-toggle').forEach(function (item) {
  item.addEventListener('click', function () {
    const submenu = this.nextElementSibling; // Находим ul
    const submenuWrapper = this.closest('.submenu-wrapper');

    if (submenu.style.display === "block") {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
      submenuWrapper.classList.add('show-back-button');
    }
  });
});

document.querySelector('.back-button').addEventListener('click', function () {
  const submenuWrapper = this.closest('.submenu-wrapper');
  submenuWrapper.querySelectorAll('.submenu').forEach(function (submenu) {
    submenu.style.display = "none";
  });
  submenuWrapper.classList.remove('show-back-button');
});
document.addEventListener("DOMContentLoaded", () => {
  let menuBtn2 = document.querySelector('.menu-btn2');
  let menu2 = document.querySelector('.search');
  menuBtn2.addEventListener('click', function () {
    menuBtn2.classList.toggle('active');
    menu2.classList.toggle('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // svg
  $(function () {
    jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });
  });
});










