
   
   // Helpers
   shuffle = function(o) {
    for (let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

String.prototype.hashCode = function() {
    // See http://www.cse.yorku.ca/~oz/hash.html        
    let hash = 5381;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

// WHEEL!
let wheel = {
    timerHandle: 0,
    timerDelay: 33,
    angleCurrent: 0,
    angleDelta: 0,
    size: 290,
    canvasContext: null,
    segments: [],
    seg_colors: [],
    maxSpeed: Math.PI / 16,
    upTime: 1000,
    downTime: 17000,
    spinStart: 0,
    frames: 0,
    centerX: 300,
    centerY: 300,
    winner: [],
    colors: ['#EEB211', '#ffc700', '#ff9100', '#ff6301', '#D50F25', '#c6037e',
             '#713697', '#444ea1', '#3769E8', '#0297ba', '#009925', '#8ac819'],

    spin: function() {
        // Start the wheel only if it's not already spinning
        if (wheel.timerHandle == 0 && wheel.segments.length>1) {
            wheel.spinStart = new Date().getTime();
            wheel.maxSpeed = Math.PI / (16 + Math.random()); // Randomly vary how hard the spin is
            wheel.frames = 0;
            wheel.sound.play()
            setTimeout(()=>{
                confetti({ particleCount: 1000, spread: 360 })
                setTimeout(()=>{ 
                    alert('The winner is: ' + wheel.winner[wheel.winner.length-1].toUpperCase())
                    wheel.winner = []
                 },2000)
                
            }, 17500)
            wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
        }
    },

    onTimerTick: function() {
        wheel.frames++;
        wheel.draw();
        let duration = (new Date().getTime() - wheel.spinStart);
        let progress = 0;
        let finished = false;
        if (duration < wheel.upTime) {
            progress = duration / wheel.upTime;
            wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2);
        } else {
            progress = duration / wheel.downTime;
            wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
            if (progress >= 1) finished = true;
        }

        wheel.angleCurrent += wheel.angleDelta;
        while (wheel.angleCurrent >= Math.PI * 2)
        // Keep the angle in a reasonable range
        wheel.angleCurrent -= Math.PI * 2;

        if (finished) {
            clearInterval(wheel.timerHandle);
            wheel.timerHandle = 0;
            wheel.angleDelta = 0;
            // $("#counter").html((wheel.frames / duration * 1000) + " FPS");
        }
        // $("#counter").html( Math.round((wheel.angleDelta * (1000 / wheel.timerDelay) * 60) / (Math.PI * 2)) + " RPM" );
         
    },

    init: function(optionList) {
        try {
            wheel.initWheel();
            wheel.initAudio();
            wheel.initCanvas();
            wheel.draw();
            $.extend(wheel, optionList);
        } catch (exceptionData) {
            alert('Wheel is not loaded ' + exceptionData);
        }
    },

    initAudio: function() {
        let sound = document.createElement('audio');
        sound.setAttribute('src', '/audio.mp3'); 
        wheel.sound = sound;
    },

    initCanvas: function() {
        let canvas = $('#wheel #canvas').get(0);
        if ($.browser.msie) {
            canvas = document.createElement('canvas');
            $(canvas).attr('width', 1000).attr('height', 600).attr('id', 'canvas').appendTo('.wheel');
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        canvas.addEventListener("click", wheel.spin, false);
        wheel.canvasContext = canvas.getContext("2d");
    },

    initWheel: function() {
        shuffle(wheel.colors);
    },

    // Called when segments have changed
    update: function() {
        let r = Math.floor(Math.random() * wheel.segments.length);
        wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * Math.PI * 2;
        
        // Generate a color cache (so we have consistant coloring)
        let seg_color = new Array();
        for (let i = 0; i < wheel.segments.length; i++)
        seg_color.push(wheel.colors[wheel.segments[i].hashCode().mod(wheel.colors.length)]);
        wheel.seg_color = seg_color;
        wheel.draw();
    },

    draw: function() {
        wheel.clear();
        wheel.drawWheel();
        wheel.drawNeedle();
    },

    clear: function() {
        wheel.canvasContext.clearRect(0, 0, 1000, 800);
    },

    drawNeedle: function() {
        let ctx = wheel.canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.fileStyle = '#D3D3D3';
        ctx.beginPath();
        ctx.moveTo(wheel.centerX + wheel.size - 40, wheel.centerY);
        ctx.lineTo(wheel.centerX + wheel.size + 20, wheel.centerY - 10);
        ctx.lineTo(wheel.centerX + wheel.size + 20, wheel.centerY + 10);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // Which segment is being pointed to?
        let i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length)-1;

        // Now draw the winning name
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#000000';
        ctx.font = "2em Arial";
        ctx.fillText(wheel.segments[i], wheel.centerX + wheel.size + 25, wheel.centerY);
    },
    drawNeedle: function() {
        var ctx = wheel.canvasContext;
        var centerX = wheel.centerX;
        var centerY = wheel.centerY;
        var size = wheel.size;
    
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.fileStyle = '#ffffff';
    
        ctx.beginPath();
    
        ctx.moveTo(centerX + size - 40, centerY);
        ctx.lineTo(centerX + size + 20, centerY - 10);
        ctx.lineTo(centerX + size + 20, centerY + 10);
        ctx.closePath();
    
        ctx.stroke();
        ctx.fill();
    
        // Which segment is being pointed to?
        var i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;
    
        // Now draw the winning name
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#000000';
        ctx.font = "2em Arial";
        wheel.winner.push(wheel.segments[i])
        // if (wheel.segments.length > 50){
        //     ctx.fillText(wheel.segments[i], centerX + size + 25, centerY);
        // }
        
      },

    drawSegment: function(key, lastAngle, angle) {
        let ctx = wheel.canvasContext;
        ctx.save();
        ctx.beginPath();

        // Start in the centre
        ctx.moveTo(wheel.centerX, wheel.centerY);
        ctx.arc(wheel.centerX, wheel.centerY, wheel.size, lastAngle, angle, false); // Draw a arc around the edge
        ctx.lineTo(wheel.centerX, wheel.centerY); // Now draw a line back to the centre
        // Clip anything that follows to this area
        //ctx.clip(); // It would be best to clip, but we can double performance without it
        ctx.closePath();

        ctx.fillStyle = wheel.seg_color[key];
        ctx.fill();
        ctx.stroke();

        // Now draw the text
        ctx.save(); // The save ensures this works on Android devices
        ctx.translate(wheel.centerX, wheel.centerY);
        ctx.rotate((lastAngle + angle) / 2);

        ctx.fillStyle = '#ffffff';
        if (wheel.segments.length < 500){
            ctx.fillText(wheel.segments[key].substr(0, 20), wheel.size / 2 + 135, 0);
        }
        ctx.restore();
        ctx.restore();
    },

    drawWheel: function() {
        let ctx = wheel.canvasContext;
        let angleCurrent = wheel.angleCurrent;
        let lastAngle = angleCurrent;
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#333';
        ctx.textBaseline = "end";
        ctx.textAlign = "right";
        if (wheel.segments.length > 400){ ctx.font = "0.1em Arial" } 
        else if (wheel.segments.length > 300){ ctx.font = "0.15em Arial" } 
        else if (wheel.segments.length > 250){ ctx.font = "0.3em Arial" } 
        else if (wheel.segments.length > 200){ ctx.font = "0.4em Arial" } 
        else if (wheel.segments.length > 100){ ctx.font = "0.6em Arial" }
        else if (wheel.segments.length > 50){ ctx.font = "0.8em Arial" } 
        else if (wheel.segments.length > 25){ ctx.font = "1em Arial" } 
        else if (wheel.segments.length > 10){ ctx.font = "1.2em Arial" } 
        else { ctx.font = "1.4em Arial" }
        
        for (let i = 1; i <= wheel.segments.length; i++) {
            let angle = (Math.PI * 2) * (i / wheel.segments.length) + angleCurrent;
            wheel.drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }
        ctx.beginPath();
        ctx.arc(wheel.centerX, wheel.centerY, 40, 0, (Math.PI * 2), false);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#333';
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(wheel.centerX, wheel.centerY, wheel.size, 0, (Math.PI * 2), false);
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#333';
        ctx.stroke();
    },
}

window.addEventListener("load",function(e) {
    wheel.init()
    if ( members.length>1 ){ wheel.segments = $('#members').val().split(/\,\s*|\s{2,}|[\n\r]/) }
    else {
        wheel.segments = ['Adam', 'Bob', 'Charlie', 'David', 'Frank', 'Gilbert', 'Henry', 'Irene', 'Jack', 'Kevin']
        $('#members').val(wheel.segments.join(', '))
    }
    $('#entries').text( wheel.segments.length )
    wheel.update()
},false);

$(document).ready(function () {
    let arr = []
    let regex = /\,\s*|\s{2,}|[\n\r]/
    let update = ()=>{
        wheel.segments = $('#members').val().split(regex)
        $('#entries').text( wheel.segments.length )
        wheel.update()
    }
    $("form").keypress(function(e) { 
        if (e.which == 13 && !$('#members').focus() ) { 
           return false
        }
    })
    $('.add-more').on('click', function(){
        if ($('.qty').val() > 0 && $('.name').val().length > 0){
            for(let i=0; i<$('.qty').val(); i++){ arr.push($('.name').val()) }
            $('#members').val().length==0 ?
            $("#members").val( arr.join(', ') ) :
            $("#members").val( $('#members').val().split(regex).join(', ') + ', ' + arr.join(', ')) 
            update()
            $('.name').val('')
            $('.qty').val(0)
            arr = []
        }
    })
    $('.qty').on('keypress', function(e){
        if ($(this).val() > 0 && $('.name').val().length > 0 && e.which==13){
            for(let i=0; i<$(this).val(); i++){ arr.push($('.name').val())}
            $('#members').val().length==0 ?
            $("#members").val( arr.join(', ') ) :
            $("#members").val( $('#members').val().split(regex).join(', ') + ', ' + arr.join(', '))
            update()
            $('.name').val('')
            $(this).val(0)
            arr = []
        }
    })
    $("#members").on('change input', function(){
        if ($(this).val().length===0){
            $('#entries').text(0)
            wheel.segments = ['']
            wheel.update() 
        } else { update() }
    })
    $('.shuffle').on('click', function(){
        $('#members').val( $('#members').val().split(regex).sort(()=>Math.random()-0.5).join(', ') )
        update()
    })
    $('.sorting').on('click', function(){
        $('#members').val( $('#members').val().split(regex).sort().join(', ') )
        update()
    })
})

