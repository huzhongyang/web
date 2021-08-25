'use strict'

// data
const url = 'https://api.openweathermap.org/data/2.5/weather'
const parms = {
    q: '',
    appid: 'ad5d2bf13f32c74d696d286b8016f050',
    lang: 'ja',
    units: 'metric'
}
const current_position = {
    lon: '',
    lat: ''
}


window.onload = function () {
    getLocation()
}

// 鼠标经过时 显示提示信息
$(function () {
    // city Tip
    showTip({
        elementId: '#refresh-time-span',
        tipId: 'time-tip-span',
        tipText: 'refresh time',
        tipTop: '105px',
        tipLeft: '78px'
    })

    // city Tip
    showTip({
        elementId: '#city-name-span',
        tipId: 'city-tip-span',
        tipText: 'city name',
        tipTop: '105px',
        tipLeft: '185px'
    })

    // temperature Tip
    showTip({
        elementId: '#temperature-span',
        tipId: 'temperature-tip-span',
        tipText: 'temperature',
        tipTop: '105px',
        tipLeft: '220px'
    })

    // img Tip
    showTip({
        elementId: '#weather-img',
        tipId: 'img-tip-span',
        tipText: 'weather image',
        tipTop: '190px',
        tipLeft: '155px'
    })
})

$('#btn').click(() => {
    let city = $('#search-input').val()
    parms.q = city
    $.ajax({
        type: 'get',
        url: url,
        data: parms,
        success: (data) => {
            console.log(data)
            $('#error').hide()
            let refreshTime = timestampToDate(data.dt)
            $('#refresh-time-span').text(refreshTime)
            $('#city-name-span').text(data.name)
            $('#temperature-span').text(data.main.temp + '°C')
            const imgUrl = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
            $('#weather-img').attr({
                src: imgUrl
            })
        },
        error: (xhr, state, errorThrown) => {
            console.log(xhr.responseJSON.message)
            $('#error').css('color', 'red')
            $('#error').text(xhr.responseJSON.message)
            $('#error').show()
        }
    })
})


// 鼠标经过时 显示提示信息
function showTip(info) {
    $(info.elementId).mouseover((e) => {
        $('body').append('<span id="' + info.tipId + '\">' + info.tipText + '</span>')
        $('#' + info.tipId).css({
            'position': 'absolute',
            'top': info.tipTop,
            'left': info.tipLeft,
            'z-index': '100',
            'color': 'salmon',
            'border-radius': '5px',
            'font-size': 'smaller'
        })
    }).mouseout((e) => {
        $('#' + info.tipId).remove()
    })
}

// 获取当前地理位置信息
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert('浏览器不支持地理位置定位')
    }
}

// 获取当前地理位置信息 并显示
function onSuccess(position) {
    // 经度
    current_position.lon = position.coords.longitude
    // 纬度
    current_position.lat = position.coords.latitude
    console.log('经度:' + current_position.lon + ' 纬度:' + current_position.lat)
    current_position.appid = parms.appid
    current_position.lang = parms.lang
    current_position.units = parms.units
    $.get(url, current_position, function (data) {
        let refreshTime = timestampToDate(data.dt)
        $('#refresh-time-span').text(refreshTime)
        $('#city-name-span').text(data.name)
        $('#temperature-span').text(data.main.temp + '°C')
        const imgUrl = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
        $('#weather-img').attr({
            src: imgUrl
        })
    })
}

// 获取当前地理位置信息 错误处理
function onError(error) {
    switch (error.code) {
        case 1:
            alert('位置服务被拒绝')
            break
        case 2:
            alert('暂时获取不到位置信息')
            break
        case 3:
            alert('获取信息超时')
            break
        case 4:
            alert('未知错误')
            break
    }
}

// 时间戳 格式化
function timestampToDate(timestamp) {
    let date = new Date(timestamp * 1000)
    const timestampToDate = {
        'year': date.getFullYear(),
        'month': (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        'day': (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()),
        'hour': ' ' + (date.getHours() + 1 < 10 ? '0' + date.getHours() : date.getHours()),
        'min': (date.getMinutes() + 1 < 10 ? '0' + date.getMinutes() : date.getMinutes()),
        'sec': (date.getSeconds() + 1 < 10 ? '0' + date.getSeconds() : date.getSeconds())
    }
    let refreshTime = ''
    for (const key in timestampToDate) {
        if (['year', 'month'].indexOf(key) >= 0) {
            refreshTime += timestampToDate[key] + '/'
        } else if (['hour', 'min'].indexOf(key) >= 0) {
            refreshTime += timestampToDate[key] + ':'
        } else {
            refreshTime += timestampToDate[key]
        }
    }
    return refreshTime
}

{
    test
}