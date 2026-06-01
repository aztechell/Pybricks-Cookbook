# Сборка прошивки Pybricks

Иногда стандартной прошивки с [code.pybricks.com](https://code.pybricks.com/) недостаточно: нужно проверить свежий `master`, изменить код Pybricks или собрать прошивку с локальными правками. В этом случае собирают файл `firmware.zip` из исходников `pybricks-micropython`.

??? warning "Важно"
    Самостоятельная сборка нужна только если вы понимаете, зачем меняете прошивку. Для обычной установки Pybricks используйте готовую прошивку через браузер.

## Что получится в конце

После успешной сборки для SPIKE Prime Hub появится файл:

```text
bricks/primehub/build/firmware.zip
```

Внутри архива должны быть три файла:

```text
firmware-base.bin
firmware.metadata.json
ReadMe_OSS.txt
```

Именно такой состав ожидают инструменты Pybricks для прошивки хаба.

## Проверенная среда

Эти шаги были проверены на Windows с Cygwin.

| Инструмент | Проверенная версия |
| :--- | :--- |
| Python | 3.12.10 |
| Poetry | 1.8.5 |
| Cygwin make | GNU Make 4.4.1 |
| Cygwin zip | Zip 3.0 |
| Cygwin MinGW GCC | 13.4.0 |
| Arm GNU Toolchain | 13.3.rel1, `arm-none-eabi-gcc` 13.3.1 |

??? note "Почему не 10-2020-q4-major?"
    Старый GNU Arm Embedded Toolchain 10.2.1 доходит до линковки, но на текущем `master` Pybricks падает с ошибкой `lto-wrapper.exe: fatal error: make returned 2 exit status`. Рабочая сборка получилась с Arm GNU Toolchain 13.3.rel1, который соответствует текущим рекомендациям Pybricks.

## 1. Установите инструменты

### Cygwin

Установите [Cygwin](https://www.cygwin.com/) и выберите пакеты:

```text
coreutils
doxygen
graphviz
make
mingw64-x86_64-gcc-core
python3
zip
```

`coreutils` нужен для базовых команд вроде `cat`, `cp`, `ln`, которые используют скрипты установки и сборки.

### Arm GNU Toolchain

Скачайте Windows-архив [Arm GNU Toolchain 13.3.rel1](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads):

```text
arm-gnu-toolchain-13.3.rel1-mingw-w64-i686-arm-none-eabi.zip
```

Распакуйте его, например в:

```text
C:\Tools\arm-gnu-toolchain-13.3.rel1-mingw-w64-i686-arm-none-eabi
```

### Python и Poetry

Установите Python 3.12 и Poetry. Если Python уже установлен, Poetry можно поставить так:

```powershell
py -3.12 -m pip install pipx
pipx install poetry
```

## 2. Получите исходники

Клонируйте `pybricks-micropython` без `--recursive`:

```powershell
git clone https://github.com/pybricks/pybricks-micropython
cd pybricks-micropython
```

Submodules подтянутся сами во время `make`. Так быстрее, потому что MicroPython содержит много submodules, которые Pybricks не использует.

## 3. Подготовьте Python-окружение

В папке `pybricks-micropython` создайте Poetry-окружение:

```powershell
poetry env use C:\Users\<user>\AppData\Local\Programs\Python\Python312\python.exe
poetry install
```

Если Python установлен в другом месте, замените путь на свой. Проверить путь к Python внутри окружения можно так:

```powershell
poetry env info --executable
```

Для следующих команд нужен именно этот Python из Poetry-окружения. В примерах ниже предполагается, что он находится здесь:

```text
C:\Projects\pybricks-micropython\.venv\Scripts\python.exe
```

## 4. Соберите `mpy-cross`

Откройте Cygwin terminal или запустите `bash.exe` из Cygwin. Перейдите в папку исходников и добавьте Arm toolchain в `PATH`:

```bash
cd /cygdrive/c/Projects/pybricks-micropython
export PATH="/cygdrive/c/Tools/arm-gnu-toolchain-13.3.rel1-mingw-w64-i686-arm-none-eabi/bin:$PATH"
export PYTHON=/cygdrive/c/Projects/pybricks-micropython/.venv/Scripts/python.exe
```

Соберите `mpy-cross`:

```bash
make mpy-cross -j8 PYTHON=$PYTHON
```

`mpy-cross` компилирует Python-модули в формат MicroPython. Без него сборка прошивки не дойдет до конца.

## 5. Соберите прошивку для SPIKE Prime

Для SPIKE Prime Hub используется target `primehub`:

```bash
make -C bricks/primehub -j8 PYTHON=$PYTHON
```

Успешная сборка заканчивается строками примерно такого вида:

```text
BIN creating firmware base file
META creating firmware metadata
ZIP creating firmware package
  adding: firmware-base.bin
  adding: firmware.metadata.json
  adding: ReadMe_OSS.txt
```

Проверьте архив:

```bash
$PYTHON -m zipfile -l bricks/primehub/build/firmware.zip
```

## 6. Установка своего `firmware.zip`

Физическую прошивку хаба выполняйте только если уверены, что собрали нужную версию.

1. Откройте [code.pybricks.com](https://code.pybricks.com/) в Chrome или Edge.
2. Откройте установку прошивки Pybricks.
3. Перейдите в расширенный режим выбора прошивки.
4. Выберите файл `bricks/primehub/build/firmware.zip`.
5. Переведите SPIKE Prime Hub в DFU-режим и выполните установку так же, как при обычной установке Pybricks.

Если нужно вернуть заводскую прошивку, используйте официальный LEGO SPIKE app или пункт восстановления официальной прошивки в Pybricks.

## Частые ошибки

### `make: command not found`

Cygwin не добавлен в `PATH`, или пакет `make` не установлен. Проверьте:

```bash
which make
make --version
```

### `arm-none-eabi-gcc: command not found`

Arm toolchain не добавлен в `PATH`. Проверьте:

```bash
which arm-none-eabi-gcc
arm-none-eabi-gcc --version
```

### `ModuleNotFoundError` во время сборки

Сборка запущена не тем Python. Укажите Python из Poetry-окружения явно:

```bash
make -C bricks/primehub -j8 PYTHON=/cygdrive/c/Projects/pybricks-micropython/.venv/Scripts/python.exe
```

### Ошибка submodules

Не клонируйте репозиторий с `--recursive`. Если сеть оборвалась во время первого `make`, просто повторите команду сборки. Make сам продолжит подтягивать нужные submodules.

### `lto-wrapper.exe: fatal error: make returned 2 exit status`

Если это случилось на Arm GCC 10.2.1 из `10-2020-q4-major`, поставьте Arm GNU Toolchain 13.3.rel1, очистите старые объектные файлы и пересоберите:

```bash
make -C bricks/primehub clean
make -C bricks/primehub -j8 PYTHON=$PYTHON
```

## Полезные ссылки

* [pybricks-micropython на GitHub](https://github.com/pybricks/pybricks-micropython)
* [CONTRIBUTING.md Pybricks](https://github.com/pybricks/pybricks-micropython/blob/master/CONTRIBUTING.md)
* [Arm GNU Toolchain downloads](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads)
* [Описание формата `firmware.zip`](https://docs.pybricks.com/projects/pybricksdev/en/latest/api/firmware.html)
