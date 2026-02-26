# Управление моторами

## Моторы SPIKE Prime и Powered UP

!!! info "Важно про сравнение цифр"
    В этой таблице используются **разные источники и условия измерения**:

    - **SPIKE Prime 45602 / 45603**: официальные тех. характеристики LEGO Education (**7.2V**, значения с допуском `±15%`).
    - **Все значения с подписью `(Philo, 7.5V)`**: для сопоставления со SPIKE использована строка **`7.5V`** из Philo (это ближайшее к номиналу аккумулятора SPIKE Prime ~`7.4V`), раздел **Loaded characteristics** (не `No-load characteristics`).
    - **Powered UP 88018**: на странице LEGO есть описание и совместимость, но **числовых RPM/torque нет**.

| Мотор | Система | Скорость (RPM) | Крутящий момент (N·cm) | Источник / условия |
| :--- | :--- | :--- | :--- | :--- |
| [Technic Large Angular Motor (45602)](https://education.lego.com/en-us/products/lego-technic-large-angular-motor/45602/)<br><img src="../img/large_angular_motor_45602.jpg" width="64" alt="45602"> | SPIKE Prime | `175` (без нагрузки)<br>`135` (макс. эффективность)<br>`≈126` (Philo, `7.5V`) | `8` (макс. эффективность)<br>`25` (стопор)<br>`≈8.47` (Philo, `7.5V`) | [LEGO Education Tech Specs (PDF)](https://le-www-live-s.legocdn.com/sc/media/files/support/spike-prime/techspecs_techniclargeangularmotor-1b79e2f4fbb292aaf40c97fec0c31fff.pdf)<br>`7.2V`, `±15%`<br>[Philo motor comparison](https://philohome.com/motors/motorcomp.htm)<br>`Spike L`, `Loaded characteristics`, строка `7.5V` |
| [Technic Medium Angular Motor (45603)](https://education.lego.com/en-us/products/lego-technic-medium-angular-motor/45603/)<br><img src="../img/medium_angular_motor_45603.jpg" width="64" alt="45603"> | SPIKE Prime | `185` (без нагрузки)<br>`135` (макс. эффективность)<br>`≈105` (Philo, `7.5V`) | `3.5` (макс. эффективность)<br>`18` (стопор)<br>`≈4.48` (Philo, `7.5V`) | [LEGO Education Tech Specs (PDF)](https://le-www-live-s.legocdn.com/sc/media/files/support/spike-prime/techspecs_technicmediumangularmotor-19684ffc443792280359ef217512a1d1.pdf)<br>`7.2V`, `±15%`<br>[Philo motor comparison](https://philohome.com/motors/motorcomp.htm)<br>`Spike M`, `Loaded characteristics`, строка `7.5V` |
| [Technic Large Motor (88013)](https://www.lego.com/en-us/product/technic-large-motor-88013)<br><img src="../img/large_motor_88013.jpg" width="64" alt="88013"> | Powered UP | `≈141` (Philo, `7.5V`) | `≈8.81` (Philo, `7.5V`) | [Philo motor comparison](https://philohome.com/motors/motorcomp.htm)<br>`Control+ L`, `Loaded characteristics`, строка `7.5V` |
| [Technic XL Motor (88014)](https://www.lego.com/en-us/product/technic-xl-motor-88014)<br><img src="../img/xl_motor_88014.jpg" width="64" alt="88014"> | Powered UP | `≈147` (Philo, `7.5V`) | `≈8.81` (Philo, `7.5V`) | [Philo motor comparison](https://philohome.com/motors/motorcomp.htm)<br>`Control+ XL`, `Loaded characteristics`, строка `7.5V` |
| [Medium Angular Motor (88018)](https://www.lego.com/en-us/product/medium-angular-motor-88018)<br><img src="../img/medium_angular_motor_88018.jpg" width="64" alt="88018"> | Powered UP | — | — | [LEGO Shop 88018](https://www.lego.com/en-us/product/medium-angular-motor-88018)<br>на странице нет публичных RPM / torque |
| [Medium Linear Motor (88008)](https://www.lego.com/en-us/product/medium-linear-motor-88008)<br><img src="../img/medium_linear_motor_88008.jpg" width="64" alt="88008"> | Powered UP | `≈201` (Philo, `7.5V`) | `≈4.08` (Philo, `7.5V`) | [Philo motor comparison](https://philohome.com/motors/motorcomp.htm)<br>`PUP medium`, `Loaded characteristics`, строка `7.5V` |

> Для честного сравнения моторов нужно совпадение **напряжения** и **режима измерения**. Здесь для Powered UP выбраны данные Philo при `7.5V` (ближайшие к `7.4V` SPIKE Prime), а для SPIKE приведены официальные значения LEGO Education при `7.2V`.

## Методы управления

Класс `Motor` предоставляет множество методов для точного управления.

### Инициализация
```python
from pybricks.pupdevices import Motor
from pybricks.parameters import Port, Direction

# Простая инициализация
motor = Motor(Port.A)

# С инверсией направления и настройкой шестеренок
# gears=[12, 36] означает, что мотор (12 зубьев) крутит колесо (36 зубьев)
motor = Motor(Port.B, Direction.COUNTERCLOCKWISE, gears=[12, 36])
```

### Основные команды движения

| Метод | Пример | Описание |
| :--- | :--- | :--- |
| **run(speed)** | `motor.run(500)` | Вращает мотор с заданной скоростью (град/сек) бесконечно. |
| **run_time(speed, time)** | `motor.run_time(500, 2000)` | Вращает мотор заданное время (мс). |
| **run_angle(speed, angle)** | `motor.run_angle(500, 90)` | Поворачивает мотор на заданный угол (относительно текущего положения). |
| **run_target(speed, target_angle)** | `motor.run_target(500, 180)` | Поворачивает мотор к абсолютной позиции (например, к отметке 180°). |
| **stop()** | `motor.stop()` | Останавливает мотор (используя режим остановки по умолчанию). |
| **dc(duty)** | `motor.dc(50)` | Подает напряжение в % (от -100 до 100). Без контроля скорости (PID выключен). |

### Получение данных

| Метод | Описание |
| :--- | :--- |
| `motor.speed()` | Текущая скорость (град/сек). |
| `motor.angle()` | Текущий угол поворота (градусы). |
| `motor.load()` | Текущая нагрузка на мотор (в мА, приблизительно). |
| `motor.stalled()` | Возвращает `True`, если мотор застрял (не может двигаться). |

### Режимы остановки (Stop)

В методах `run_time`, `run_angle`, `run_target` можно передать аргумент `then=Stop...`, чтобы указать поведение после завершения движения.

* **Stop.COAST**: Отключить питание, мотор вращается по инерции.
* **Stop.COAST_SMART**: Аналогично `COAST`, но также сбрасывает накопленную ошибку PID-регулятора. Полезно для сброса интегральной ошибки перед новым движением.
* **Stop.BRAKE**: Замкнуть обмотки, пассивное торможение.
* **Stop.HOLD**: Активное удержание позиции (мотор сопротивляется повороту).
* **Stop.NONE**: Не останавливать мотор. Используется для плавного перехода к следующей команде (например, чтобы слить два движения в одно).

```python
from pybricks.parameters import Stop

# Проехать 90 градусов и жестко зафиксироваться
motor.run_angle(500, 90, then=Stop.HOLD)

# Разогнаться и отключить питание (катиться по инерции)
motor.run_time(1000, 2000, then=Stop.COAST)

# Проехать часть пути и сразу начать следующее движение без остановки
motor.run_angle(500, 180, then=Stop.NONE)
motor.run_angle(500, 90, then=Stop.BRAKE)
```
