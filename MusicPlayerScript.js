var app = new Vue({
	el:".app",
	data:{
		keywords:"",
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
			})
		},
		play:function(){
			this.playAnimation=true;
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
		touchStylus:function(){
			this.playAnimation = !this.playAnimation;
			var musicPlayer = document.getElementById("musicPlayer");
			if(this.playAnimation){
				musicPlayer.play();
			}
			else{
				musicPlayer.pause();
			}
		}
	},
})
// 地址？key=value&key2=value2...