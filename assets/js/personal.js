var myScroll,rankScroll_1, rankScroll_2, rankScroll_3, rankScroll_4

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
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); // 禁止屏幕滚动

$(document).ready(function () {


    // Tab
    var swiper3 = new Swiper('.swiper-container3', {
        pagination: '.rankingTab-ul',
        paginationClickable: true,
        paginationBulletRender: function (index, className) {
            switch (index) {
                case 0: name='赚金排行榜';break;
                case 1: name='佣金排行榜';break;
                default: name='';
            }
            return '<li class="' + className + '">' + name + '</li>';
        }
    });

    FastClick.attach(document.body); // 消除 移动端300ms click 事件响应慢和点透问题
    $("#marquee").marquee(); // 顶部消息栏
    $("#marquee2").marquee(); // 赚金排行榜消息栏
    $("#marquee3").marquee(); // 佣金排行榜消息栏
});