var myScroll;

function loaded () {
    myScroll = new IScroll('#wrapper', {
        keyBindings: true
    });
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).ready(function () {

    FastClick.attach(document.body); // 消除 移动端300ms click 事件响应慢和点透问题
    $("#marquee").marquee();
    var $range = $("#range_55");
    var slider;
    var num = 0;

    $('#addNum').on('click', function () {
        if(num != 50){
            num++
        }else{
            num = 50
        }
        // Call sliders update method with any params
        slider.update({
            min: 0,
            max: 50,
            from: num,
        });
        $('#showNum').text(num);
    })
    $('#reduNum').on('click', function () {
        if(num != 0){
            num--
            console.log(num)
        }else{
            num = 0
        }
        // Call sliders update method with any params
        slider.update({
            min: 0,
            max: 50,
            from: num,
        });
        $('#showNum').text(num)
    })
    var create = function () {
        $range.ionRangeSlider({
            type: "single",
            min: 0,
            max: 50,
            from: num,
            grid: true,
            onChange: function (data) {
                $('#showNum').text(data.from);
                num = data.from;
            },
        });
        // Save slider instance to var
        slider = $("#range_55").data("ionRangeSlider");
    }
    create();

});