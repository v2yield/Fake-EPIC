window.onload = function () {
    var colorArr = ['#1cf3ff', 'skyblue', 'orange'];
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    window.onload = function(){
        //����Ļ�ϻ��� 800 ������ĵ�
        for( var i = 0; i < 2000; i++ ){
            var span = document.createElement('span');
            var width = Math.random() * 3;  // ���� 0-3 ֮��Ŀ���ֵ
            var colorIndex = parseInt(Math.random() * 3);
            var x = parseInt(Math.random() * screenW);
            var y = parseInt(Math.random() * screenH);
            span.style.width = parseInt(width) + 'px';
            span.style.height = parseInt(width) + 'px';
            span.style.background = colorArr[colorIndex];
            span.style.left = x + 'px';
            span.style.top = y + 'px';
            document.body.appendChild(span);
        }
    }

    var POINT_NUM = 150;    //����������
    var LINE_LENGTH = 10000;    //�����֮������߳��ȵ�ƽ�������ڼ��㣩

    var csv = document.getElementById('canvas');
    csv.width = screenW;
    csv.height = screenH;
    document.body.appendChild(csv);

    var ctx = csv.getContext('2d');

    //�������
    function randomInt(min,max) {
        return Math.floor((max - min + 1) * Math.random() + min);
    }
    
    function randomFloat(min,max) {
        return (max - min) * Math.random() + min;
    }

    //�������
    function Point(){
        this.x = randomInt(0,csv.width);
        this.y = randomInt(0,csv.height);
        this.r = 2;   //�뾶

        var speed  = randomFloat(0.3,1.2);  //����ƶ��ٶ�
        var angle = randomFloat(0,2 * Math.PI);  //����ƶ�����Ƕ�

        //���ˮƽ����ֱ�ƶ��ٶ�
        this.dx = Math.sin(angle) * speed;
        this.dy = Math.cos(angle) * speed;

        var i = randomInt(0,2);
        this.color = colorArr[i];
    }

    //���ƶ����������㳬����Ļ�߽磬�����෴�����ƶ�
    Point.prototype.move = function () {
        this.x += this.dx;
        this.y += this.dy;
        if(this.x < 0){
            this.x = 0;
            this.dx = -this.dx;
        }else if(this.x > csv.width){
            this.x = csv.width;
            this.dx = - this.dx;
        }
        if(this.y < 0){
            this.y = 0;
            this.dy = -this.dy;
        }else if(this.y > csv.height){
            this.y = csv.height;
            this.dy = -this.dy;
        }
    }

    //���
    Point.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    var points = [];

    //��ʼ���㼯
    function initPoints(num) {
        for(var i = 0; i < num; i++){
            points.push(new Point());
        }
    }

    var p0 = new Point();   //������ڵ�
    p0.dx = p0.dy = 0;

    //��ȡ��굱ǰ����
    //������ƶ�ʱ
    document.onmousemove = function (ev) {
        p0.x = ev.clientX;
        p0.y = ev.clientY;
    }
    //������Ƴ�����ʱ
    window.onmouseout = function () {
        p0.x = null;
        p0.y = null;
    }

    //����֮������
    function drawLine(p1,p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dis = dx * dx + dy * dy;    //����֮��ľ��빫ʽ,�����ε�б��(ƽ��)
        if(dis < 2 * LINE_LENGTH){  //������֮��ľ���С�ڸ����ĳ��ȣ���������֮�������������͸���ȸ��ݾ�����仯
            if(dis > LINE_LENGTH){  //���� length ~ 2 * length ��Χ�ڵĵ�,����С�� length �ĵ㣬ʹ�������ƶ�
                if(p1 === p0){
                    p2.x += dx * 0.03;
                    p2.y += dy * 0.03;
                }
            }
            // �����߶ε�͸���� t�� t ȡֵΪ (0, 0.2)��͸����������֮��ľ���ı���ı�
            var t = (1.0 - dis / LINE_LENGTH) * 0.2;
            ctx.strokeStyle = 'rgba(255,255,255,' + t + ')';
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.moveTo(p1.x,p1.y);
            ctx.lineTo(p2.x,p2.y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    //����ÿһ֡
    function drawFrame() {
        csv.width = screenW;
        csv.height = screenH;

        var arr = (p0.x === null ? points : [p0].concat(points));
        for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
                drawLine(arr[i],arr[j]);
            }
            arr[i].draw();
            arr[i].move();
        }
        window.requestAnimationFrame(drawFrame);
    }
    initPoints(POINT_NUM);
    drawFrame();
}