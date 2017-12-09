var myScroll,rankScroll

function loaded () {
    myScroll = new IScroll('#wrapper', {
        keyBindings: true
    });
    rankScroll = new IScroll('.Wrapper-rankingData', {
        keyBIndings: true
    })
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).ready(function () {

    FastClick.attach(document.body); // 消除 移动端300ms click 事件响应慢和点透问题
    $("#marquee").marquee();
    $("#marquee2").marquee();

});