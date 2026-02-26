# Drive Base

`DriveBase` в Pybricks позволяет управлять двухколесным роботом в миллиметрах и градусах, а не в оборотах моторов.

## Инициализация

```python
from pybricks.pupdevices import Motor
from pybricks.parameters import Port, Direction
from pybricks.robotics import DriveBase

# Подберите направления так, чтобы при положительной скорости робот ехал вперед.
left_motor = Motor(Port.A, Direction.COUNTERCLOCKWISE)
right_motor = Motor(Port.B)

# wheel_diameter и axle_track указываются в мм.
drive_base = DriveBase(left_motor, right_motor, wheel_diameter=56, axle_track=112)
```

## Единицы измерения и знаки

* Расстояние: миллиметры (`mm`).
* Угол поворота: градусы (`deg`).
* Линейная скорость: `mm/s`.
* Угловая скорость: `deg/s`.
* Положительная скорость/дистанция: движение вперед.
* Положительный угол/turn_rate: поворот вправо (по часовой стрелке, если смотреть сверху).

## Основные методы движения

| Метод | Пример | Что делает |
| :--- | :--- | :--- |
| `straight(distance)` | `drive_base.straight(300)` | Едет прямо на заданную дистанцию. |
| `turn(angle)` | `drive_base.turn(90)` | Поворот на месте на заданный угол. |
| `arc(radius, angle=...)` | `drive_base.arc(120, angle=180)` | Едет по дуге окружности. |
| `arc(radius, distance=...)` | `drive_base.arc(250, distance=400)` | Едет по дуге на заданную длину. |
| `curve(radius, angle)` | `drive_base.curve(120, 90)` | Устаревший метод дуги (для старого кода до 3.6). |
| `drive(speed, turn_rate)` | `drive_base.drive(200, 30)` | Непрерывное движение до `stop()`/`brake()`. |
| `stop()` | `drive_base.stop()` | Остановка накатом (coast). |
| `brake()` | `drive_base.brake()` | Пассивное торможение. |

Пример:

```python
drive_base.straight(500)
drive_base.turn(90)
drive_base.arc(120, angle=180)
```

## Режим остановки после маневра (`then=Stop...`)

Методы `straight`, `turn`, `arc` принимают `then=Stop...`:

* `Stop.HOLD` (по умолчанию): удерживает позицию.
* `Stop.BRAKE`: тормозит и не удерживает активно.
* `Stop.COAST`: свободный накат.

```python
from pybricks.parameters import Stop

drive_base.straight(300, then=Stop.HOLD)
drive_base.turn(90, then=Stop.BRAKE)
drive_base.arc(150, angle=90, then=Stop.COAST)
```

## Блокирующий и неблокирующий режим

По умолчанию команды ждут завершения (`wait=True`).  
Если нужно выполнять код параллельно с движением, используйте `wait=False`.

```python
from pybricks.tools import wait

drive_base.straight(800, wait=False)
while not drive_base.done():
    wait(10)
```

## Настройка динамики: `settings()`

`settings()` задает параметры только для маневров (`straight/turn/arc`), но не для `drive()`.

```python
drive_base.settings(
    straight_speed=300,         # mm/s
    straight_acceleration=700,  # mm/s²
    turn_rate=180,              # deg/s
    turn_acceleration=360       # deg/s²
)

print(drive_base.settings())  # кортеж текущих значений
```

### Ограничения `settings()`

Если задать значения выше физического предела, Pybricks выдаст ошибку.

```text
max_straight_mm_s  = 2000  * π * D / 360
max_straight_mm_s2 = 20000 * π * D / 360
max_turn_deg_s     = 2000  * D / T
max_turn_deg_s2    = 20000 * D / T
```

Где:
* `D` - диаметр колеса (мм).
* `T` - `axle_track`, расстояние между колесами (мм).

### Расчет для колес 88, 44, 62.4 мм

| D (мм) | max_straight_mm_s | max_straight_mm_s2 | max_turn_deg_s | max_turn_deg_s2 |
| :--- | :--- | :--- | :--- | :--- |
| 88 | 1535.89 | 15358.90 | 176000 / T | 1760000 / T |
| 44 | 767.94 | 7679.45 | 88000 / T | 880000 / T |
| 62.4 | 1089.09 | 10890.85 | 124800 / T | 1248000 / T |

Пример для `T = 112 мм`:

| D (мм) | max_turn_deg_s | max_turn_deg_s2 |
| :--- | :--- | :--- |
| 88 | 1571.43 | 15714.29 |
| 44 | 785.71 | 7857.14 |
| 62.4 | 1114.29 | 11142.86 |

## Телеметрия и состояние

| Метод | Что возвращает |
| :--- | :--- |
| `distance()` | Пройденную дистанцию с последнего `reset()` (мм). |
| `angle()` | Накопленный угол с последнего `reset()` (градусы). |
| `state()` | `(distance, drive_speed, angle, turn_rate)`. |
| `done()` | `True`, если текущая команда завершена. |
| `stalled()` | `True`, если база уперлась/не может выполнить команду. |

```python
d, v, a, w = drive_base.state()
print("d:", d, "v:", v, "a:", a, "w:", w)
```

## Сброс одометрии: `reset()`

```python
drive_base.reset()             # distance=0, angle=0
drive_base.reset(100, -45)     # задать свои стартовые значения
```

`reset()` также останавливает текущее движение.

## Использование гироскопа: `use_gyro()`

```python
drive_base.use_gyro(True)   # включить гироскоп для прямолинейности и поворотов
drive_base.turn(360)

drive_base.use_gyro(False)  # только энкодеры моторов
```

Если хаб установлен нестандартно, задайте `top_side` и `front_side` при создании `PrimeHub()`, иначе углы поворота могут считаться неверно.

## Практическая калибровка размеров

Точность `DriveBase` сильно зависит от `wheel_diameter` и `axle_track`.

1. Измерьте начальные значения линейкой.
2. Проверьте прямую: `drive_base.straight(1000)` и измерьте реальную дистанцию.
3. Если робот недоезжает, немного уменьшите `wheel_diameter`.
4. Если переезжает, немного увеличьте `wheel_diameter`.
5. Проверьте поворот: `drive_base.turn(360)`.
6. Если недоворачивает, увеличьте `axle_track`.
7. Если переворачивает, уменьшите `axle_track`.

Сначала калибруйте `wheel_diameter`, потом `axle_track`.

## `curve()` и `arc()`: в чем разница

В Pybricks 3.6+ для нового кода рекомендуется `arc()`.  
`curve()` сохранен для совместимости со старыми проектами.

### Сигнатуры

```python
# Старый стиль
drive_base.curve(radius, angle)

# Новый стиль (нужно указать либо angle, либо distance)
drive_base.arc(radius, angle=90)
drive_base.arc(radius, distance=300)
```

### Логика знаков

| Метод | Что задает `radius` | Что задает `angle` / `distance` |
| :--- | :--- | :--- |
| `curve()` (legacy) | Направление движения: `+` вперед, `-` назад | Направление поворота: `+` вправо, `-` влево |
| `arc()` (актуальный) | Сторону дуги: `+` центр окружности справа, `-` слева | Направление движения: `+` вперед, `-` назад |

Именно из-за этой разницы старые вызовы с отрицательными значениями при переходе на `arc()` нужно перепроверять на роботе.

### Мини-примеры миграции

```python
# Было (curve): вперед и вправо
drive_base.curve(120, 90)

# Стало (arc): вперед и вправо
drive_base.arc(120, angle=90)
```

```python
# Было (curve): вперед и влево
drive_base.curve(120, -90)

# Стало (arc): вперед и влево
drive_base.arc(-120, angle=90)
```

### Наглядно: `drive_base.arc(radius, angle=...)`

Для `arc()` знак `radius` выбирает сторону, где находится центр окружности, а знак `angle`/`distance` - направление движения по дуге.

<div class="arc-demo" data-arc-demo style="max-width: 560px;">
  <div class="arc-demo__controls">
    <fieldset class="arc-demo__fieldset">
      <legend>Сторона центра (<code>radius</code>)</legend>
      <label><input type="radio" name="arc-demo-radius" value="right" checked> <code>radius &gt; 0</code> (центр справа)</label>
      <label><input type="radio" name="arc-demo-radius" value="left"> <code>radius &lt; 0</code> (центр слева)</label>
    </fieldset>

    <fieldset class="arc-demo__fieldset">
      <legend>Направление движения (<code>angle</code>/<code>distance</code>)</legend>
      <label><input type="radio" name="arc-demo-motion" value="forward" checked> <span class="arc-demo__swatch arc-demo__swatch--fwd"></span> <code>&gt; 0</code> (вперед)</label>
      <label><input type="radio" name="arc-demo-motion" value="backward"> <span class="arc-demo__swatch arc-demo__swatch--back"></span> <code>&lt; 0</code> (назад)</label>
    </fieldset>
  </div>

  <div class="arc-demo__viewport" style="max-width: 520px; margin: 0 auto; border: 1px solid #d7dee7; border-radius: 8px; overflow: hidden;">
    <svg
      class="arc-demo__svg"
      style="display: block; width: 100%; height: auto;"
      viewBox="0 0 360 240"
      width="520"
      height="346"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Интерактивная схема arc для DriveBase"
    >
      <defs>
        <marker id="arc-demo-arrow-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#198754"/>
        </marker>
        <marker id="arc-demo-arrow-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b26a00"/>
        </marker>
      </defs>

      <rect x="0" y="0" width="360" height="240" rx="12" fill="#fbfdff"/>

      <circle data-arc-demo-circle cx="270" cy="130" r="90" fill="none" stroke="#d7dee7" stroke-width="1.5"/>
      <line data-arc-demo-radius-line x1="180" y1="130" x2="270" y2="130" stroke="#8d99a6" stroke-width="1.5" stroke-dasharray="5 5"/>
      <circle data-arc-demo-center-dot cx="270" cy="130" r="5" fill="#e55353"/>
      <text data-arc-demo-center-label x="286" y="126" font-size="12" fill="#334155">центр</text>

      <path data-arc-demo-path d="M180 130 A90 90 0 0 1 270 40" fill="none" stroke="#198754" stroke-width="6" marker-end="url(#arc-demo-arrow-fwd)"/>

      <g transform="translate(180 130)">
        <rect x="-16" y="-22" width="32" height="44" rx="7" fill="#1f2937"/>
        <circle cx="0" cy="0" r="3.2" fill="#ffffff"/>
        <line x1="0" y1="-22" x2="0" y2="-48" stroke="#2563eb" stroke-width="4"/>
        <path d="M-7 -40 L0 -50 L7 -40" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  </div>

  <div class="arc-demo__meta">
    <div class="arc-demo__legend">
      <span class="arc-demo__chip"><span class="arc-demo__swatch arc-demo__swatch--fwd"></span> сплошная: <code>&gt; 0</code> (вперед)</span>
      <span class="arc-demo__chip"><span class="arc-demo__swatch arc-demo__swatch--back"></span> пунктир: <code>&lt; 0</code> (назад)</span>
    </div>
    <div class="arc-demo__current">
      <code data-arc-demo-call>drive_base.arc(120, angle=90)</code>
      <span data-arc-demo-text>центр справа, едет вперед по дуге</span>
    </div>
  </div>
</div>
