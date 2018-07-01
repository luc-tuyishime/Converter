const laodCurrencies = () => {
    const from = document.getElementById("from")
    const to = document.getElementById("to")
    const xHttp = new XMLHttpRequest()
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == 4 && xHttp.status == 200) {
            const data = JSON.parse(this.responseText)
            let options = ""
            for (key in data.results) {
                options = `${options}<option>${key}</option>`
            }
            from.innerHTML = options
            to.innerHTML = options

            console.log(options)
        }
    }
    xHttp.open(
        "Get",
        "https://cors.io/?https://free.currencyconverterapi.com/api/v5/currencies",
        true
    )
    xHttp.send()
}

const ConvertCurrency = () => {
    const fromCurrency = document.getElementById("from").value
    const toCurrency = document.getElementById("to").value
    const amount = document.getElementById("amount").value
    let total = document.getElementById("result")
    const query = `${fromCurrency}_${toCurrency}`
    fetch(
            `https://cors.io/?https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`
        )
        .then(response => response.json())
        .then(res => {
            let rate = Object.values(res)[0]
            total.innerHTML = parseFloat(rate) * parseFloat(amount)
            console.log(total)
        })
}