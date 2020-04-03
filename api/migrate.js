const moment = require("moment");
const fetch = require("node-fetch");
const iconv = require("iconv-lite");
const convert = require("xml-js");
const util = require("util");
const { get } = require("lodash");
const db = require("./database");

//Many thanks to SynCap at https://ru.stackoverflow.com/questions/571689/%d0%98%d0%b7%d0%bc%d0%b5%d0%bd%d0%b8%d1%82%d1%8c-%d0%ba%d0%be%d0%b4%d0%b8%d1%80%d0%be%d0%b2%d0%ba%d1%83-%d0%b2-nodejs-cp1251-1252-%d0%b2-utf-8/867250#867250
function cnw8(buf) {
  return iconv.decode(Buffer.from(buf, "binary"), "cp1251").toString();
}

//Вспомогательная функция для преобразования XML в JSON
function getValueByName(element, name) {
  const dataNode = get(element, "elements", []).find(
    item => name === item.name
  );
  return get(dataNode, "elements[0].text");
}

//Получить дату
function getDate(date) {
  return moment(date, "DD/MM/YYYY", true).isValid()
    ? date
    : moment().format("DD/MM/YYYY");
}

//Получить дату месяц назад от date
function getDateSubMonth(date) {
  return moment(date, "DD/MM/YYYY", true).isValid()
    ? moment(date, "DD/MM/YYYY")
        .subtract(1, "month")
        .format("DD/MM/YYYY")
    : moment()
        .subtract(1, "month")
        .format("DD/MM/YYYY");
}

//Обработать полученные данные и преобразовать их в JSON
function dailyToJSON(obj) {
  const data = get(obj, "elements[0]", {});
  const pubDate = get(data, "attributes.Date");
  const json = {
    tableName: "currency",
    pubDate: pubDate,
    data: get(data, "elements").map(element => {
      return {
        valuteID: get(element, "attributes.ID"),
        date: moment(pubDate, "DD.MM.YYYY").format("DD/MM/YYYY"),
        numCode: getValueByName(element, "NumCode"),
        charCode: getValueByName(element, "CharCode"),
        nominal: getValueByName(element, "Nominal"),
        name: getValueByName(element, "Name"),
        value: getValueByName(element, "Value")
      };
    })
  };
  return json;
}

//Обработать полученные данные и преобразовать их в JSON
function dynamicToJSON(obj, titleValute) {
  const data = get(obj, "elements[0]", {});
  const startDate = get(data, "attributes.DateRange1");
  const endDate = get(data, "attributes.DateRange2");
  const json = {
    startDate,
    endDate,
    data: get(data, "elements").map(element => {
      return {
        valuteID: get(element, "attributes.Id"),
        date: moment(get(element, "attributes.Date"), "DD.MM.YYYY").unix(),
        numCode: get(titleValute, "numCode"),
        charCode: get(titleValute, "charCode"),
        nominal: getValueByName(element, "Nominal"),
        name: get(titleValute, "name"),
        value: getValueByName(element, "Value")
      };
    })
  };
  return json;
}

//Получить данные Daily
function callDaily(date) {
  return fetch(
    `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${getDate(date)}`
  )
    .then(res => res.buffer())
    .then(res => cnw8(res))
    .then(res => JSON.parse(convert.xml2json(res)))
    .then(res => dailyToJSON(res))
    .then(res => {
      async function processValutes(valutes) {
        let tmpArr = [];
        for (let valute of valutes) {
          const chunk = await callDynamic(
            getDateSubMonth(get(valute, "date")),
            getDate(get(valute, "date")),
            get(valute, "valuteID"),
            valute
          );
          tmpArr.push(chunk);
        }
        return tmpArr;
      }
      return processValutes(get(res, "data", []));
    })
    .then(res => {
      return res;
    })
    .catch(err =>
      console.error(`[Неудача] DAILY date=${getDate(date)}\n\n`, err)
    );
}

//Получить данные Dynamic
function callDynamic(startDate, endDate, valuteID, titleValute) {
  const params = [
    `date_req1=${getDate(startDate)}`,
    `date_req2=${getDate(endDate)}`,
    `VAL_NM_RQ=${valuteID}`
  ];
  return fetch(`http://www.cbr.ru/scripts/XML_dynamic.asp?${params.join("&")}`)
    .then(res => res.buffer())
    .then(res => cnw8(res))
    .then(res => JSON.parse(convert.xml2json(res)))
    .then(res => dynamicToJSON(res, titleValute))
    .then(res => {
      return res;
    })
    .catch(err =>
      console.error(`[Неудача] DYNAMIC valuteID=${valuteID}\n\n`, err)
    );
}

//START
callDaily().then(res => {
  const dropTableQuery = "DROP TABLE IF EXISTS currency";
  const createTableQuery = `CREATE TABLE IF NOT EXISTS currency (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date INTEGER,
      valuteID text,
      numCode text,
      charCode text,
      nominal text,
      name text,
      value text
    )`;
  const insertQuery =
    "INSERT INTO currency (valuteID, date, numCode, charCode, nominal, name, value) VALUES (?,?,?,?,?,?,?)";
  db.run(dropTableQuery, err => {
    if (err) {
      console.error(err);
    }
    db.run(createTableQuery, err => {
      if (err) {
        console.error(err);
      }
      res.forEach(valuteGroup => {
        get(valuteGroup, "data", []).forEach(item => {
          db.run(
            insertQuery,
            [
              get(item, "valuteID"),
              get(item, "date"),
              get(item, "numCode"),
              get(item, "charCode"),
              get(item, "nominal"),
              get(item, "name"),
              get(item, "value")
            ],
            err => {
              if (err) {
                console.error(err);
              }
            }
          );
        });
      });
    });
  });
});
