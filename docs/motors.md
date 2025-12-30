# Управление моторами

## Моторы SPIKE Prime и Powered UP

<table style="width:100%; table-layout:fixed; border-collapse:collapse;">
  <thead>
    <tr>
      <th style="width:32%; text-align:left;">Мотор</th>
      <th style="width:14%; text-align:left;">Система</th>
      <th style="width:10%;">Фото</th>
      <th style="width:22%; text-align:left;">Скорость (RPM)</th>
      <th style="width:22%; text-align:left;">Крутящий момент (N·cm)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Technic Large Angular Motor<br>(45602)</b></td>
      <td>SPIKE Prime</td>
      <td>
        <img src="../img/large_angular_motor_45602.jpg" width="72">
      </td>
      <td>
        175 (без нагрузки)<br>
        135 (макс. эффективность)
      </td>
      <td>
        8 (эффективность)<br>
        25 (стопор)
      </td>
    </tr>
    <tr>
      <td><b>Technic Medium Angular Motor<br>(45603)</b></td>
      <td>SPIKE Prime</td>
      <td>
        <img src="../img/medium_angular_motor_45603.jpg" width="72">
      </td>
      <td>
        185 (без нагрузки)<br>
        135 (макс. эффективность)
      </td>
      <td>
        3.5 (эффективность)<br>
        18 (стопор)
      </td>
    </tr>
    <tr>
      <td><b>Technic Large Motor<br>(88013)</b></td>
      <td>Powered UP</td>
      <td>
        <img src="../img/large_motor_88013.jpg" width="72">
      </td>
      <td>≈198</td>
      <td>≈8.8</td>
    </tr>
    <tr>
      <td><b>Technic XL Motor<br>(88014)</b></td>
      <td>Powered UP</td>
      <td>
        <img src="../img/xl_motor_88014.jpg" width="72">
      </td>
      <td>≈198</td>
      <td>≈8.8</td>
    </tr>
    <tr>
      <td><b>Medium Angular Motor<br>(88018)</b></td>
      <td>Powered UP</td>
      <td>
        <img src="../img/medium_angular_motor_88018.jpg" width="72">
      </td>
      <td>≈198</td>
      <td>≈8.8</td>
    </tr>
    <tr>
      <td><b>Medium Linear Motor<br>(88008)</b></td>
      <td>Powered UP</td>
      <td>
        <img src="../img/medium_linear_motor_88008.jpg" width="72">
      </td>
      <td>≈270</td>
      <td>≈4.1</td>
    </tr>
  </tbody>
</table>

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
