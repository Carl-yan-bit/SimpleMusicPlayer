


var app = new Vue({
	el:".app",
	data:{
		keywords:"butterfly 钢琴",
		musics:[],
		music_src:"",
		picture_src:"resource/气泡.png",
		playAnimation:false,
		hotComments:[],
		mv_src:"",
		isShow:false,
		
		
	},
	methods:{
		search:function(){
			var that = this;
			axios.get("https://autumnfish.cn/search?keywords="+that.keywords).then(function(response){
				that.musics = response.data.result.songs;
				console.log(response);
			},function(err){
				console.log(err);
			})
		},
		playMusic:function(id){
			var that = this;
			//获得歌曲url
			axios.get("https://autumnfish.cn/song/url?id="+id).then(function(response){
				that.music_src = response.data.data[0].url;
				console.log("歌曲基本信息：");
				console.log(response);
			},function(err){
				console.log(err);
			})
			//获得歌曲专辑封面url
			axios.get("https://autumnfish.cn/song/detail?ids="+id).then(
			function(response){
				console.log("歌曲详细信息:");
				console.log(response);
				that.picture_src = response.data.songs[0].al.picUrl;
			},function(err){
				console.log(err);
			})
			//获得歌曲评论
			axios.get("https://autumnfish.cn/comment/hot?type=0&id="+id).then(function(response){
				console.log("歌曲评论请求：");
				console.log(response);
				that.hotComments = response.data.hotComments;
			},function(err){
				console.log(err);
			});
			//显示音乐频谱
			
			
		},
		play:function(){
			this.playAnimation=true;
			var musicPlayer = document.getElementById("musicPlayer");
			this.showAudioFrequencySpectrum(musicPlayer);
		},
		stop:function(){
			this.playAnimation=false;
		},
		playMV:function(mvId){
			var that = this;
			if(that.playAnimation){
				var musicPlayer = document.getElementById("musicPlayer");
				musicPlayer.pause();
				that.playAnimation = false;
			}
			axios.get("https://autumnfish.cn/mv/url?id="+mvId).then(function(response){
				console.log("歌曲MV请求：");
				console.log(response);
				that.mv_src = response.data.data.url;
				that.isShow = true;
			},function(err){
				console.log(err);
			})
			
		},
		stopMV:function(){
			this.isShow = false;
			this.mv_src = "";
		},
		showAudioFrequencySpectrum:function(audio){
			var wrap = document.getElementById("wrap");
			var cxt = wrap.getContext("2d");
			//获取API
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = new window.AudioContext;
			
			//创建节点
			var source = context.createMediaElementSource(audio);
			var analyser = context.createAnalyser();
			//连接：source → analyser → destination
			source.connect(analyser);
			analyser.connect(context.destination);
			//创建数据
			var output = new Uint8Array(180); 
			var du = 2;//角度
			var potInt = { x: 250, y: 250 };//起始坐标
			var R = 215;//半径
			var W = 6;//宽
			(function drawSpectrum() {
			    analyser.getByteFrequencyData(output);//获取频域数据
			    cxt.clearRect(0, 0, wrap.width, wrap.height);
			    //画线条
			    for (var i = 0; i < 180; i++) {
			        var value = output[i] * Math.sqrt(output[i]) / 125;//<===获取数据 
					
					cxt.beginPath();
			        cxt.lineWidth = W; 
					cxt.lineCap = 'round';
					var gnt1 = cxt.createLinearGradient(0,0,wrap.width,wrap.height);
					gnt1.addColorStop(0,'rgba(16,44,140,.9)');
					gnt1.addColorStop(0.25,'rgba(255,95,85,.9)');
					gnt1.addColorStop(0.5,'rgba(16,44,140,.9)');
					gnt1.addColorStop(0.75,'rgba(255,95,85,.9)');
					cxt.strokeStyle = gnt1;
			        Rv1 = (R -value);
			        Rv2 = (R +value);
			        cxt.moveTo(( Math.sin((i * du) / 180 * Math.PI) * Rv1 + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv1 + potInt.x);
			        cxt.lineTo( ( Math.sin((i * du) / 180 * Math.PI) * Rv2 + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv2 + potInt.x);
			        cxt.stroke();
			    } 
			    cxt.fill();
			    //画一个空心小圆，将线条覆盖
			    // cxt.beginPath();
			    // cxt.lineWidth = 1;
			    // cxt.arc(300, 300, 200, 0, 2 * Math.PI, false); 
			    // cxt.stroke(); 
			    // cxt.closePath();
			    //请求下一帧
			    requestAnimationFrame(drawSpectrum);
			})();
		},
		touchStylus:function(){
			this.playAnimation = !this.playAnimation;
			var musicPlayer = document.getElementById("musicPlayer");
			
			if(this.playAnimation){
				musicPlayer.play();
				this.showAudioFrequencySpectrum(musicPlayer);
			}
			else{
				musicPlayer.pause();
			}
		}
	},
})
// 地址？key=value&key2=value2...