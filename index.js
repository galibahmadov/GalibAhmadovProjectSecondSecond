class Application {
    //реализующий обработку нажатия на кнопку, получение введенных данных и отображение результатов
    constructor() {
        const get = this;
        document.getElementById('calculate').addEventListener('click', function () {
            get.getValue();
        });
    }
    getValue() {
        document.getElementById('mainResultTable').innerHTML = ``;
        let deposit = new Deposit();
        let first = document.getElementById("first"),
            second = document.getElementById("second"),
            third = document.getElementById("third"),
            fourth = document.getElementById("fourth");

        let beginBalanceController = false;
        let monthlyAddingController = false;
        let periodMonthController = false;

        if (deposit.beginbalance > 0) {
            beginBalanceController = true;
            first.className = "block";
        }
        else if (deposit.beginbalance <= 0) {
            first.className = "show"
        }
        if (deposit.monthlyAdding >= 0) {
            monthlyAddingController = true;
            second.className = "block";
        }
        else if(deposit.monthlyAdding < 0)  {
            second.className = "show";
        }
        if (deposit.periodMonth > 0 && Math.floor(deposit.periodMonth) == deposit.periodMonth) {
            periodMonthController = true;
            third.className = "block";
        }
        else {
            third.className = "show";
        }

        if (beginBalanceController === true && monthlyAddingController === true && periodMonthController == true) {
            console.log(deposit);
            let calculator = new Calculator;
            let finalSuggestions = calculator.searchSuggestions(deposit);
            if (finalSuggestions.length === 0) {
                return;
            }
            console.log(finalSuggestions);
            let highestAmmount = calculator.getMaxBank(finalSuggestions);
            console.log(highestAmmount);
            let finalCalculatedResult = calculator.calculateDeposit(deposit, highestAmmount);
            console.log(finalCalculatedResult);
            this.tableMaker(highestAmmount, finalCalculatedResult);
        }
    }

    tableMaker(highestAmmount, finalCalculatedResult) {
        
        let finalResultTable = document.getElementById('mainResultTable');
        let tableHead = '<tr><th>Название Банка</th><th>Вклад</th><th>Процент</th><th>Итоговая сумма</th></tr>';
        let tableMain = '';
        for (let i = 0; i < highestAmmount.length; i++) {
            let tableRow = `<tr><td>${highestAmmount[i].bankName}</td><td>${highestAmmount[i].investName}</td><td>${highestAmmount[i].incomeType}</td><td>${finalCalculatedResult}</td></tr>`;
            tableMain += tableRow;
        }
        finalResultTable.innerHTML = `<table>${tableHead}${tableMain}</table>`;
    }
}
class Deposit {
    //реализующий свойства и функциональность вклада, который хотел бы открыть клиент
    constructor() {
        this.beginbalance = +(document.getElementById('beginbalance').value);
        this.monthlyAdding = +(document.getElementById('monthlyAdding').value);
        this.periodMonth = +(document.getElementById('periodMonth').value);
        this.currency = document.getElementById('currency').value;

    }
}

class Calculator {
    //инициализирующийся массивом продуктов BankProduct и вычисляющий наиболее выгодный вариант.
    constructor() { }
    calculateDeposit(deposit, highestAmmount) {
        let realRate = highestAmmount[0].incomeType / 100 / 12;
        let finalResult = deposit.beginbalance + (deposit.beginbalance * realRate);
        let plusAmount = 0;
        for (let i = 0; i < (Math.trunc(deposit.periodMonth - 1)); i++) {
            plusAmount = (finalResult + deposit.monthlyAdding) * realRate + deposit.monthlyAdding;
            finalResult += plusAmount;
        }
        return Math.round(finalResult);
    }
    searchSuggestions(client) {
        let bank = new BankProduct();
        console.log(bank);
        const bankOffer = bank.res.filter(function (item) {
            if (client.monthlyAdding > 0) {
                return client.beginbalance >= item.sumMin && (client.beginbalance <= item.sumMax || item.sumMax == null) && client.periodMonth >= item.termMin && client.periodMonth <= item.termMax && item.canDeposit === true && client.currency == item.currency;
            } else if (client.monthlyAdding == 0) {
                return client.beginbalance >= item.sumMin && (client.beginbalance <= item.sumMax || item.sumMax == null) && client.periodMonth >= item.termMin && client.periodMonth <= item.termMax && item.canDeposit === false && client.currency == item.currency;
            }
        });
        if (bankOffer.length == 0) {
            alert('We Dont have any results');
        }
        return bankOffer;
    }
    getMaxBank(finalSuggestions) {
        let maxPercent = finalSuggestions.reduce(function (prev, cur) {
            if (prev.incomeType > cur.incomeType) {
                return prev;
            }
            return cur;
        });
        let highestPercent = finalSuggestions.filter(function (item) {
            return item.incomeType == maxPercent.incomeType;
        });
        return highestPercent;
    }
}
class BankProduct {
    //реализующий свойства и функциональность банковского предложения по вкладу
    constructor() {
        this.res = [
            {
                bankName: "Газпромбанк",
                investName: "Ваш успех",
                currency: "RUB",
                incomeType: 6.22,
                sumMin: 50000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: false,
            },
            {
                bankName: "Кредит Европа Банк",
                investName: "Оптимальный на 2 года",
                currency: "RUB",
                incomeType: 6.45,
                sumMin: 100000,
                sumMax: null,
                termMin: 24,
                termMax: 24,
                canDeposit: false,
            },
            {
                bankName: "Банк Зенит",
                investName: "Праздничный 500+",
                currency: "RUB",
                incomeType: 6,
                sumMin: 30000,
                sumMax: null,
                termMin: 17,
                termMax: 17,
                canDeposit: false,
            },
            {
                bankName: "Еврофинанс Моснарбанк",
                investName: "Классический",
                currency: "RUB",
                incomeType: 6.95,
                sumMin: 30000,
                sumMax: null,
                termMin: 12,
                termMax: 24,
                canDeposit: false,
            },
            {
                bankName: "Джей энд Ти Банк",
                investName: "Магнус-Онлайн",
                currency: "RUB",
                incomeType: 6.8,
                sumMin: 100000,
                sumMax: null,
                termMin: 6,
                termMax: 6,
                canDeposit: false,
            },
            {
                bankName: "МТС Банк",
                investName: "В вашу пользу",
                currency: "RUB",
                incomeType: 6.75,
                sumMin: 50000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Эс-Би-Ай Банк",
                investName: "Свои правила Онлайн",
                currency: "RUB",
                incomeType: 6.7,
                sumMin: 30000,
                sumMax: 30000000,
                termMin: 24,
                termMax: 24,
                canDeposit: false,
            },
            {
                bankName: "Банк Уралсиб",
                investName: "Прогноз отличный",
                currency: "RUB",
                incomeType: 6.7,
                sumMin: 100000,
                sumMax: null,
                termMin: 37,
                termMax: 37,
                canDeposit: false,
            },
            {
                bankName: "Инвестторгбанк",
                investName: "ИТБ-Постоянный доход",
                currency: "RUB",
                incomeType: 6.6,
                sumMin: 50000,
                sumMax: null,
                termMin: 37,
                termMax: 37,
                canDeposit: false,
            },
            {
                bankName: "Транскапиталбанк",
                investName: "ТКБ.Постоянный доход",
                currency: "RUB",
                incomeType: 6.6,
                sumMin: 50000,
                sumMax: null,
                termMin: 37,
                termMax: 37,
                canDeposit: false,
            },
            {
                bankName: "Совкомбанк",
                investName: "Зимний праздник с Халвой",
                currency: "RUB",
                incomeType: 5.6,
                sumMin: 50000,
                sumMax: null,
                termMin: 2,
                termMax: 2,
                canDeposit: true,
            },
            {
                bankName: "Агророс",
                investName: "Медовый месяц",
                currency: "RUB",
                incomeType: 5.51,
                sumMin: 20000,
                sumMax: null,
                termMin: 1,
                termMax: 1,
                canDeposit: true,
            },
            {
                bankName: "Росдорбанк",
                investName: "Онлайн-1",
                currency: "RUB",
                incomeType: 5.1,
                sumMin: 100000,
                sumMax: 150000000,
                termMin: 1,
                termMax: 1,
                canDeposit: true,
            },
            {
                bankName: "Национальный Стандарт",
                investName: "Сберегательный стандарт",
                currency: "RUB",
                incomeType: 5.1,
                sumMin: 100000,
                sumMax: null,
                termMin: 1,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Россия",
                investName: "Морозные узоры",
                currency: "RUB",
                incomeType: 5,
                sumMin: 100000,
                sumMax: null,
                termMin: 1,
                termMax: 1,
                canDeposit: true,
            },
            {
                bankName: "Кузнецкий Мост",
                investName: "Накопительный",
                currency: "RUB",
                incomeType: 4.85,
                sumMin: 50000,
                sumMax: null,
                termMin: 1,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Тексбанк",
                investName: "Универсальный",
                currency: "RUB",
                incomeType: 4.6,
                sumMin: 10000,
                sumMax: null,
                termMin: 1,
                termMax: 1,
                canDeposit: true,
            },
            {
                bankName: "Морской Банк",
                investName: "Правильным курсом +",
                currency: "RUB",
                incomeType: 4.55,
                sumMin: 100000,
                sumMax: null,
                termMin: 1,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Норвик Банк",
                investName: "Лаконичный",
                currency: "RUB",
                incomeType: 4.5,
                sumMin: 500,
                sumMax: 50000000,
                termMin: 1,
                termMax: 1,
                canDeposit: true,
            },
            {
                bankName: "Промсельхозбанк",
                investName: "Конструктор",
                currency: "RUB",
                incomeType: 4.5,
                sumMin: 10000,
                sumMax: null,
                termMin: 1,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Акибанк",
                investName: "Онлайн",
                currency: "RUB",
                incomeType: 6.5,
                sumMin: 1000,
                sumMax: null,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Банк БКФ",
                investName: "Ключевой стандарт",
                currency: "RUB",
                incomeType: 6.5,
                sumMin: 100000,
                sumMax: null,
                termMin: 6,
                termMax: 13,
                canDeposit: true,
            },
            {
                bankName: "Экспобанк",
                investName: "Специальный (в конце срока)",
                currency: "RUB",
                incomeType: 6.35,
                sumMin: 50000,
                sumMax: 10000000,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Инвестторгбанк",
                investName: "ИТБ-Пополняемый",
                currency: "RUB",
                incomeType: 6.15,
                sumMin: 50000,
                sumMax: 30000000,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Транскапиталбанк",
                investName: "ТКБ.Пополняемый",
                currency: "RUB",
                incomeType: 6.15,
                sumMin: 50000,
                sumMax: 30000000,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Евроазиатский Инвестиционный Банк",
                investName: "Классика",
                currency: "RUB",
                incomeType: 6.1,
                sumMin: 100000,
                sumMax: null,
                termMin: 6,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Тимер Банк",
                investName: "Надежный выбор",
                currency: "RUB",
                incomeType: 6,
                sumMin: 10000,
                sumMax: null,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Евразийский Банк",
                investName: "TURBO MAXIMUM",
                currency: "RUB",
                incomeType: 6,
                sumMin: 30000,
                sumMax: 299999,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Таврический Банк",
                investName: "Достижимый (онлайн)",
                currency: "RUB",
                incomeType: 6,
                sumMin: 50000,
                sumMax: null,
                termMin: 6,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Экспобанк",
                investName: "Юбилейный 25 (в конце срока)",
                currency: "RUB",
                incomeType: 6.5,
                sumMin: 100000,
                sumMax: 20000000,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Крокус-Банк",
                investName: "Ежемесячный доход",
                currency: "RUB",
                incomeType: 6.35,
                sumMin: 50000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Промсельхозбанк",
                investName: "Ваш выбор",
                currency: "RUB",
                incomeType: 6.3,
                sumMin: 10000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Нацинвестпромбанк",
                investName: "Прибыльный",
                currency: "RUB",
                incomeType: 6.3,
                sumMin: 50000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Ишбанк",
                investName: "Накопительный",
                currency: "RUB",
                incomeType: 6.25,
                sumMin: 100000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Примсоцбанк",
                investName: "Новогодний чулок (333 дня)",
                currency: "RUB",
                incomeType: 6.2,
                sumMin: 10000,
                sumMax: null,
                termMin: 11,
                termMax: 11,
                canDeposit: true,
            },
            {
                bankName: "Еврофинанс Моснарбанк",
                investName: "Пополняемый",
                currency: "RUB",
                incomeType: 6.75,
                sumMin: 1000000,
                sumMax: null,
                termMin: 12,
                termMax: 24,
                canDeposit: true,
            },
            {
                bankName: "Евроазиатский Инвестиционный Банк",
                investName: "VIP",
                currency: "RUB",
                incomeType: 6.35,
                sumMin: 1000000,
                sumMax: null,
                termMin: 9,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Российская Финансовая Корпорация",
                investName: "Универсальный",
                currency: "RUB",
                incomeType: 6,
                sumMin: 5000,
                sumMax: null,
                termMin: 3,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Московский Кредитный Банк",
                investName: "МЕГА Онлайн",
                currency: "RUB",
                incomeType: 5.8,
                sumMin: 1000,
                sumMax: null,
                termMin: 3,
                termMax: 5,
                canDeposit: true,
            },
            {
                bankName: "Александровский",
                investName: "Черника 19/20",
                currency: "RUB",
                incomeType: 5.6,
                sumMin: 20000,
                sumMax: null,
                termMin: 3,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Финанс Бизнес Банк",
                investName: "Мандариновый!",
                currency: "RUB",
                incomeType: 5.6,
                sumMin: 50000,
                sumMax: null,
                termMin: 3,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "ЦентроКредит",
                investName: "Доход Плюс",
                currency: "USD",
                incomeType: 1.15,
                sumMin: 5000,
                sumMax: null,
                termMin: 3,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Совкомбанк",
                investName: "Удобный (в долларах)",
                currency: "USD",
                incomeType: 1,
                sumMin: 500,
                sumMax: null,
                termMin: 3,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Веста",
                investName: "Веста - Копилка",
                currency: "USD",
                incomeType: 1,
                sumMin: 10000,
                sumMax: null,
                termMin: 3,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "Славия",
                investName: "Славный Капитал",
                currency: "USD",
                incomeType: 0.85,
                sumMin: 5000,
                sumMax: null,
                termMin: 3,
                termMax: 4,
                canDeposit: true,
            },
            {
                bankName: "Роскосмосбанк",
                investName: "Комфортный",
                currency: "USD",
                incomeType: 0.8,
                sumMin: 500,
                sumMax: null,
                termMin: 3,
                termMax: 6,
                canDeposit: true,
            },
            {
                bankName: "ФорБанк",
                investName: "Срочный накопительный",
                currency: "USD",
                incomeType: 0.8,
                sumMin: 10000,
                sumMax: 500000,
                termMin: 3,
                termMax: 3,
                canDeposit: true,
            },
            {
                bankName: "Московский Областной Банк",
                investName: "Гарантированный доллар",
                currency: "USD",
                incomeType: 0.75,
                sumMin: 50,
                sumMax: null,
                termMin: 4,
                termMax: 4,
                canDeposit: true,
            },
            {
                bankName: "Объединенный Резервный Банк",
                investName: "ОРБ-Накопительный (в конце срока)",
                currency: "USD",
                incomeType: 1.6,
                sumMin: 1000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Банк Агора",
                investName: "Срочный",
                currency: "USD",
                incomeType: 1.5,
                sumMin: 1000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Тинькофф Банк",
                investName: "СмартВклад (с повышенной ставкой)",
                currency: "USD",
                incomeType: 1.5,
                sumMin: 1000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Первый Инвестиционный Банк",
                investName: "Закон сохранения",
                currency: "USD",
                incomeType: 1.5,
                sumMin: 1000,
                sumMax: null,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
            {
                bankName: "Новый Век",
                investName: "Сберегательный",
                currency: "USD",
                incomeType: 1.5,
                sumMin: 5000,
                sumMax: 20000,
                termMin: 12,
                termMax: 12,
                canDeposit: true,
            },
        ];

    }

}

new Application();