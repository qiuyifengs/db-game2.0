var myScroll,rankScroll_1, rankScroll_2

function loaded () {
    myScroll = new IScroll('#wrapper', {
        keyBindings: true
    });
    rankScroll_1 = new IScroll('#Wrapper-rankingData-1', {
        keyBIndings: true
    })
    rankScroll_2 = new IScroll('#Wrapper-rankingData-2', {
        keyBIndings: true
    })
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).ready(function () {

    FastClick.attach(document.body); // 消除 移动端300ms click 事件响应慢和点透问题
    $("#marquee").marquee();
    $("#marquee2").marquee();

});