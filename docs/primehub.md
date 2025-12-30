# Установка Pybricks на Spike PRIME Hub

Установка Pybricks выполняется полностью через браузер. Вам понадобится компьютер с браузером Google Chrome или Microsoft Edge (поддержка Web Bluetooth).

??? note "Видеоинструкция"
    <iframe width="560" height="315" src="https://www.youtube.com/embed/lazylZDcnfg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Инструкция по установке

### 1. Откройте редактор
Перейдите на сайт [code.pybricks.com](https://code.pybricks.com/).

### 2. Переведите хаб в режим обновления (DFU)
Этот шаг необходим для записи новой прошивки в память хаба.

1. Убедитесь, что хаб выключен и USB-кабель **отключен**.
2. Нажмите и удерживайте кнопку **Bluetooth** (кнопка со значком Bluetooth на передней панели).
3. Продолжая удерживать кнопку, вставьте USB-кабель, подключенный к компьютеру.
4. Дождитесь, пока индикатор кнопки Bluetooth начнет мигать розово-фиолетовым цветом (5-10 секунд). 
5. Отпустите кнопку.

<iframe width="315" height="560" src="https://www.youtube.com/embed/K07jYDmTC7Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### 4. Смена драйвера
1. Нажать правой кнопкой мыши на Пуск и выбрать "Диспетчер устройств".
2. Найти устройство с названием "LEGO Technic Large hub in DFU Mode"
3. Дважды кликнуть на устройство
4. 

### 5. Запустите установку
1. В левом меню редактора Pybricks нажмите кнопку **"Install Pybricks Firmware"** (значок микросхемы/загрузки).
2. В списке устройств выберите **"SPIKE Prime Hub"**.
3. Поставьте галочку под лицензией и нажмите **Next**.
4. Задайте имя для хаба. 
5. Нажмите синюю кнопку **"Install"**.
6. В системном окне выбора устройства выберите ваш хаб и нажмите "Подключение".
7. Дождитесь завершения загрузки. После установки хаб перезагрузится. \

??? note "Скриншоты"
        7 ![]../docs/img/img.png){width = 200}


## Как вернуть заводскую прошивку?
Pybricks не заменяет загрузчик хаба, поэтому вы всегда можете вернуться назад.
1. Откройте официальное приложение **LEGO® Education SPIKE™**.
2. Подключите хаб по USB.
3. Приложение обнаружит, что прошивка не соответствует официальной, и предложит обновить её. Нажмите "Обновить" (Update), и заводская прошивка будет восстановлена.
