//==== Menu =====//
function menuOpen() {
   const menuLinkActive = document.querySelector('.menu__dropdown');
   const menuDropdown = document.querySelector('.menu-dropdown');

   menuLinkActive.addEventListener('click', () => {
      if (menuLinkActive.classList.contains('active')) {
         menuLinkActive.classList.remove('active');
         menuDropdown.classList.remove('active');
         setTimeout(() => {
            menuDropdown.style.display = 'none'
         }, 500);

      } else if (!menuLinkActive.classList.contains('active')) {
         menuDropdown.style.display = 'block'
         menuLinkActive.classList.add('active');
         setTimeout(() => {
            menuDropdown.classList.add('active');
         }, 200);
      }
   })
}
menuOpen();

//==== End Menu =====//

//=== Select ======//
function select() {
   const selectHeader = document.querySelectorAll('.form__select-header');
   const selectItem = document.querySelectorAll('.form__select-item');

   selectHeader.forEach(el => {
      el.addEventListener('click', selectToggle)
   });

   selectItem.forEach(el => {
      el.addEventListener('click', selectChoose)
   });

   function selectToggle() {
      this.parentElement.classList.toggle('active');
   }

   function selectChoose() {
      let text = this.innerText,
         select = this.closest('.form__select'),
         currentText = this.closest('.form__select').querySelector('.form__select-current');
      currentText.innerText = text;
      select.classList.remove('active');
   }
}
select();
//=== End Select ======//

//=== Slider ======//
const swiper = new Swiper('.swiper', {
   slidesPerView: 2.8,
   loop: true,
   spaceBetween: 30,
   navigation: {
      nextEl: '.slider-arrow-prev',
      prevEl: '.slider-arrow-next',
   },
   pagination: {
      el: '.slider-pagination',
      type: 'bullets',
   },
})
//=== End Slider ======//

//=== Change =====//

function change() {

   let startProgress = 15;

   const button = document.querySelector('.change__progressbar-button');

   const buttonValue = document.querySelector('.change__progressbar-button').querySelector('.button__value').innerText;
   const progressBar = document.querySelector('.change__progressbar-progress');
   let progressValue = progressBar.querySelector('.progress__value');

   progressValue.innerText = startProgress;
   progressBar.style.width = `${startProgress}%`

   button.addEventListener('click', (e) => {
      e.preventDefault;
      startProgress = buttonValue;
      progressValue.innerText = startProgress;
      progressBar.style.width = `${startProgress}%`
   })

}
change();

//=== End Change =====//

//=== ShowText =====//

function showText() {
   const text = document.querySelector('.change__text-content');
   const textShowBtn = document.querySelector('.change__text-button');
   const changeButton = document.querySelector('.change__button');
   const num = 120;

   if (text) {
      let textShow = text.innerText;
      let textVisible = textShow.slice(0, num);

      if (textShow.length < num) {
         textShowBtn.style.display = "none";
      } else {
         textShowBtn.style.display = "flex";
         text.innerText = textVisible;
      }
      if (textShowBtn) {
         textShowBtn.addEventListener('click', () => {
            textShowBtn.classList.toggle('showText');
            changeButton.classList.toggle('showText');
            if (!textShowBtn.classList.contains('showText')) {
               textShowBtn.innerText = "Подробнее";
               text.innerText = textVisible;

            } else {
               textShowBtn.innerText = "Скрыть";
               text.innerText = textShow;
            }
         })
      }
   }
}
showText();
//===End ShowText =====//
//=== Yandex Map ====//
ymaps.ready(function () {
   // Пример реализации собственного элемента управления на основе наследования от collection.Item.
   // Элемент управления отображает название объекта, который находится в центре карты.
   var map = new ymaps.Map("map", {
      center: [59.943999, 30.349477],
      zoom: 14,
      controls: []
   }
   ),

      // <div class="customControl"><div class="customControl__content"><h5>Наш адрес</h5><p>Санкт-Петербург, Владимирский проспект, 23, лит. А, офис 701</p> <a href="#">Схема проезда</a></div></div>'

      // Создаем собственный класс.
      CustomControlClass = function (options) {
         CustomControlClass.superclass.constructor.call(this, options);
         this._$content = null;
         this._geocoderDeferred = null;
      };
   // И наследуем его от collection.Item.
   ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
      onAddToMap: function (map) {
         CustomControlClass.superclass.onAddToMap.call(this, map);
         this._lastCenter = null;
         this.getParent().getChildElement(this).then(this._onGetChildElement, this);
      },

      onRemoveFromMap: function (oldMap) {
         this._lastCenter = null;
         if (this._$content) {
            this._$content.remove();
            this._mapEventGroup.removeAll();
         }
         CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
      },

      _onGetChildElement: function (parentDomContainer) {
         // Создаем HTML-элемент с текстом.
         this._$content = $('<div class="customControl"><div class="customControl__content"><h5>Наш адрес</h5><p>Санкт-Петербург, Владимирский проспект, 23, лит. А, офис 701</p> <a href="https://yandex.ru/maps/-/CCUznOXisA" target="blanc">Схема проезда</a></div></div>').appendTo(parentDomContainer);
         this._mapEventGroup = his.getMap().events.group();
         // Запрашиваем данные после изменения положения карты.
         this._mapEventGroup.add('boundschange', this._createRequest, this);
         // Сразу же запрашиваем название места.
         this._createRequest();
      },

      _createRequest: function () {
         var lastCenter = this._lastCenter = this.getMap().getCenter().join(',');
         // Запрашиваем информацию о месте по координатам центра карты.
         ymaps.geocode(this._lastCenter, {
            // Указываем, что ответ должен быть в формате JSON.
            json: true,
            // Устанавливаем лимит на кол-во записей в ответе.
            results: 1
         }).then(function (result) {
            // Будем обрабатывать только ответ от последнего запроса.
            if (lastCenter == this._lastCenter) {
               this._onServerResponse(result);
            }
         }, this);
      },

      _onServerResponse: function (result) {
         // Данные от сервера были получены и теперь их необходимо отобразить.
         // Описание ответа в формате JSON.
         var members = result.GeoObjectCollection.featureMember,
            geoObjectData = (members && members.length) ? members[0].GeoObject : null;
         if (geoObjectData) {
            this._$content.text(geoObjectData.metaDataProperty.GeocoderMetaData.text);
         }
      }
   });

   map.behaviors.disable('scrollZoom');
   map.behaviors.disable('drag');

   var customControl = new CustomControlClass();
   map.controls.add(customControl, {
      float: 'none',
      position: {
         top: 160,
         left: 185
      }
   });
});

//===End Yandex Map ====//

//===Button Top ====//

window.scrollTo(0, 0);

//===End Button Top ====//



