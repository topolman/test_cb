# test_cb

## Введение

Данный проект разработан с использованием платформы Node.js, для запуска проекта требуется ее установка [https://nodejs.org/en/](https://nodejs.org/en/)

В качестве менеджера пакетов использован Yarn [https://classic.yarnpkg.com/en/docs/install#windows-stable](https://classic.yarnpkg.com/en/docs/install#windows-stable)

Так же, можно использовать менеджер пакетов npm, его отдельная установка не требуется, он часть платформы Node.js.

Команды запускаются из коммандной строки.

В качестве базы данных использована sqlite3, т.к. ее отдельная настройка не требуется и ее возможностей достаточно, для нужд этого проекта.

# Задачи

## Часть 1

Используя открытые методы (XML_daily и XML_dynamic) Центробанка РФ [http://www.cbr.ru/development/SXML/](http://www.cbr.ru/development/SXML/) создать и заполнить Базу Данных.
БД заполняем данными минимум за 30 дней начиная с текущего дня.

В БД должна быть таблица currency c обязательными колонками:
valuteID - идентификатор валюты, который возвращает метод (пример: R01010)
numCode - числовой код валюты (пример: 036)
сharCode - буквенный код валюты (пример: AUD)
name - имя валюты (пример: Австралийский доллар)
value - значение курса (пример: 43,9538)
date - дата публикации курса (может быть в UNIX-формате или ISO 8601)

## Решение части первой

В корневом каталоге проекта есть каталоги **client** и **api**. В каталоге **api** содержится файл **db.sqlite**. _Его содержимое можно посмотреть любым менеджером sqlite, например [https://sqlitebrowser.org/](https://sqlitebrowser.org/)._

Проверить решение можно таким образом. Необходимо перейти в каталог **api** и выполнить команды:

#### yarn install

#### yarn fetch

Дождаться ее выполнения. По окончании, будет выведена строка **Done in ...s.**

В каталоге **api** изменится содержание файла **db.sqlite**. _Его содержимое можно посмотреть любым менеджером sqlite, например [https://sqlitebrowser.org/](https://sqlitebrowser.org/)._

## Часть 2

2.1. Реализовать REST API метод, который вернет курс(ы) валюты для переданного valueID за указанный период date (from&to) используя данные из таблицы currency. Параметры передаем методом GET.

2.2. Реализовать 2 веб страницы:

1. Страница авторизации. Авторизация по логину и паролю. Учетные данные могут быть статичными.
2. Главная страница (доступна только после авторизации). На странице размещается таблица со списком валют и данными по этим валютам за указанную в поле/селекторе дату.

Оформление страниц не имеет значения, но любая попытка стилизации (в том числе с использованием фреймворков) будет плюсом

## Решение части второй

В корневом каталоге проекта есть каталоги **client** и **api**. Для демонстрации работы нам потребуются два терминала (cmd)

### api

Это серверная часть, т.е. API. Требует запуска, в первую очередь. Для этого, в каталоге **api** выполнить команды:

#### yarn install

**yarn fetch** _(если вы этого не сделали ранее, нам нужна база валют)_

#### yarn start

Это запустит сервер Express. Остановить его можно комбинацией клавиш _Ctrl+C_ либо просто закрыв терминал.
Переходим к клиентской части.

### client

Это клиентская часть (фронтенд). Запускается после **api**. Для этого, необходимо открыть новый терминал и в каталоге **client** выполнить команды:

#### yarn install

#### yarn start

Это запустит отладочный веб-сервер и автоматически откроет страницу в браузере по-умолчанию. Остановить его можно комбинацией клавиш _Ctrl+C_ либо просто закрыв терминал.

**Имя пользователя:** user

**Пароль:** secret
