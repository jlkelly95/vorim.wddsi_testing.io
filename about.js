aboutJS = {
    changeColor: function () {
        var col = document.getElementById("body");
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        col.style.backgroundColor = color;
        return color;
    },
    resetColor: function () {
        var col = document.getElementById("body");
        color='#FFFFFF';
        col.style.backgroundColor = color;
        return color;
    }
}