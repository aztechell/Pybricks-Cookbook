# Инициализация

Любая программа на Pybricks начинается с импорта необходимых модулей и инициализации объектов (хаба, моторов, датчиков).

## 1. Импорт модулей

Стандартное начало программы выглядит так:

```python
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor, ColorSensor, UltrasonicSensor, ForceSensor
from pybricks.parameters import Button, Color, Direction, Port, Side, Stop
from pybricks.robotics import DriveBase
from pybricks.tools import wait, StopWatch
```

* `pybricks.hubs`: классы для работы с самим хабом (кнопки, экран, гироскоп).
* `pybricks.pupdevices`: классы для подключаемых устройств (моторы и датчики).
* `pybricks.parameters`: константы (порты, цвета, направления).
* `pybricks.robotics`: классы для управления роботом (drivebase).
* `pybricks.tools`: инструменты (таймеры, ожидание).

## 2. Инициализация Хаба

Создаем объект хаба, чтобы управлять его встроенными функциями.

```python
hub = PrimeHub()
```

Теперь можно использовать методы хаба:
```python
hub.light.on(Color.GREEN)  # Включить подсветку кнопки зеленым
hub.display.char("A")      # Показать букву A на матрице
print(hub.battery.voltage()) # Вывести напряжение батареи
```

## 3. Инициализация Моторов

Моторы подключаются к портам A, B, C, D, E, F.

### Одиночный мотор
```python
# Мотор на порту A
left_motor = Motor(Port.A)

# Мотор на порту B, вращение инвертировано (против часовой стрелки = вперед)
right_motor = Motor(Port.B, Direction.COUNTERCLOCKWISE)
```

### DriveBase (Колесная база)
Класс `DriveBase` позволяет управлять роботом как единым целым, используя миллиметры и градусы вместо оборотов моторов.

```python
# Инициализация моторов
left_motor = Motor(Port.A, Direction.COUNTERCLOCKWISE)
right_motor = Motor(Port.B)

# Создание базы
# wheel_diameter: диаметр колеса в мм
# axle_track: расстояние между центрами колес в мм
robot = DriveBase(left_motor, right_motor, wheel_diameter=56, axle_track=112)
```

## 4. Инициализация Датчиков

### Датчик цвета
```python
color_sensor = ColorSensor(Port.C)
```

### Ультразвуковой датчик (расстояния)
```python
dist_sensor = UltrasonicSensor(Port.D)
```

### Датчик силы (кнопка)
```python
force_sensor = ForceSensor(Port.E)
```

## Пример полной программы

```python
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor, ColorSensor
from pybricks.parameters import Port, Direction, Color
from pybricks.robotics import DriveBase
from pybricks.tools import wait

# 1. Хаб
hub = PrimeHub()
hub.light.on(Color.BLUE)

# 2. Моторы и база
left = Motor(Port.A, Direction.COUNTERCLOCKWISE)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=112)

# 3. Датчики
sensor = ColorSensor(Port.C)

# Логика
print("Start!")
robot.straight(500) # Проехать 500 мм вперед
wait(1000)
```
