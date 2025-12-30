# Структура проекта

При написании программ для роботов важно поддерживать порядок в коде. В Pybricks есть два основных подхода к организации проекта.

## Вариант 1: Один файл (Monolithic)

Самый простой способ — писать весь код в одном файле `main.py`. Это подходит для небольших задач и учебных примеров.

**Структура `main.py`:**
1. Импорты библиотек.
2. Инициализация устройств (хаб, моторы).
3. Объявление функций.
4. Основной цикл или логика программы.

```python
# main.py
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor
from pybricks.parameters import Port

# Инициализация
hub = PrimeHub()
motor = Motor(Port.A)

# Функции
def run():
    motor.run_angle(500, 360)

# Логика
print("Start")
run()
print("End")
```

## Вариант 2: Разделение на модули (Modular)

Для больших проектов (например, WRO или FLL) код в одном файле становится слишком длинным и запутанным. Удобнее разбить его на несколько файлов.

Рекомендуемая структура:
1. `init.py` — инициализация робота (порты, настройки).
2. `func.py` — функции движения и логики.
3. `main.py` — основной сценарий запуска.

### Как это работает

Мы используем `from ... import *`, чтобы все переменные и функции из одного файла были доступны в другом.

#### 1. Файл `init.py`
Здесь мы создаем объекты моторов и датчиков.

```python
# init.py
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

# Инициализация хаба и устройств
hub = PrimeHub()
left_motor = Motor(Port.A)
right_motor = Motor(Port.B)

# Создаем базу
drive_base = DriveBase(left_motor, right_motor, wheel_diameter=56, axle_track=112)
```

#### 2. Файл `func.py`
Здесь мы пишем функции. Чтобы они видели робота, мы импортируем всё из `init.py`.

```python
# func.py
from init import *

def square(size):
    for i in range(4):
        drive_base.straight(size)
        drive_base.turn(90)

def beep_and_wait():
    hub.speaker.beep()
    wait(1000)
```

#### 3. Файл `main.py`
Главный файл, который мы запускаем. Он импортирует функции (которые уже содержат в себе инициализацию).

```python
# main.py
from func import *

# Просто пишем логику, используя готовые функции и объекты
print("Program started")

beep_and_wait()
square(200)

print("Program finished")
```

!!! warning "Важно"
    При такой структуре запускать нужно именно `main.py`. Если запустить `func.py` или `init.py`, робот ничего не сделает, так как в них нет команд вызова функций.
