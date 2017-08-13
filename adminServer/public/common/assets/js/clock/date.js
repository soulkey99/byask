var monthNames = ["1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
];
var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
var newDate = new Date();
newDate.setDate(newDate.getDate());
$('#Date').html( newDate.getFullYear() + '年' + monthNames[newDate.getMonth()] + newDate.getDate() + '日 ' + dayNames[newDate.getDay()]);