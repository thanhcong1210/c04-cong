const $ = document.querySelector.bind(document);
const trackName = $('#track-name');                 //hiển thị tên nhạc đang phát
const cdThumb = $('#cd-image');                     //bìa album hoặc hình ảnh
const audio = $('#audio');
const singer = $('#singer-name');                   //tên ca sĩ
const playing = $('#playing');                      //trạng thái phát / dừng
const progress = $('#progress');                    //phát lại
const skipBtn = $('#skip');                         //chuyển bài
const backwardBtn = $('#backward');                 //quay lại
const randomBtn = $('#shuffle');                    //phát ngẫu nhiên
const repeatBtn = $('#repeat');                     //phát lại lặp lại
const playlist = $('#list-song');                   // danh sách bài hát
const timeUpdate = $('#time-update');               //time phát của nhạc
const timeCurrentSong = $('#time-currentSong');
let isPause = false;                                //để xem nhạc hiện tại có bị tạm dừng hay k
let isRandom = false;                               //xem chế độ phát ngẫu nhiên có bật hay k
let isRepeat = false;                               //xem chế độ lặp lại có bật hay k

const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Còn Thương Thì Không Để Cho Em Khóc',
            singer: 'Miu Lê, KaRik, Đạt G',
            path: 'song/song1.mp3',
            image: 'image/anh1.jpg',
        },
        {
            name: 'Hoàng Hôn Nhớ',
            singer: 'Anh Tú',
            path: 'song/song2.mp3',
            image: 'image/anh2.jpg',
        },
        {
            name: 'Đoạn Kết Mới',
            singer: 'Hoàng Dũng',
            path: 'song/song3.mp3',
            image: 'image/anh3.jpg',
        },
        {
            name: 'Những Lời Hứa Bỏ Quên',
            singer: 'Vũ',
            path: 'song/song4.mp3',
            image: 'image/anh4.jpg',
        },
        {
            name: 'Không Thể Say',
            singer: 'Hiếu Thứ Hai',
            path: 'song/song5.mp3',
            image: 'image/anh5.jpg',
        },
        {
            name: 'Xoay Hè Khác Lạ',
            singer: 'Trúc Nhân, Osad, Linh Cáo',
            path: 'song/song6.mp3',
            image: 'image/anh6.jpg',
        }
    ],

    filteredSongs: [],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
             <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    <button class="delete-btn" data-index = "${index}">Xóa</button>
                </div>
             </div>
          `;
        });
        playlist.innerHTML = htmls.join("");
    },

    getCurrentSong: function () {
        return this.songs[this.currentIndex];
    },

    loadCurrentSong: function () {
        const currentSong = this.getCurrentSong();
        trackName.textContent = this.getCurrentSong().name;
        singer.textContent = this.getCurrentSong().singer;
        cdThumb.src = this.getCurrentSong().image;
        audio.src = this.getCurrentSong().path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
    },

    backSong: function () {
        if (audio.currentTime > 30) {
            this.loadCurrentSong();
        }
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.render();
    },

    playRandomSong: function () {
        let newCurrentIndex;
        do {
            newCurrentIndex = Math.floor(Math.random() * this.songs.length)
        } while (newCurrentIndex === this.currentIndex);
        this.currentIndex = newCurrentIndex;
        this.loadCurrentSong();
        this.render();
    },

    secondToMinute: function (seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = Math.floor(seconds % 60);
        return (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    },

    getTimeCurrentSong: function () {
        if (!isNaN(audio.duration)) {
            timeCurrentSong.innerHTML = this.secondToMinute(audio.duration);
        } else {
            timeCurrentSong.innerHTML = "00:00";
        }
    },

    deleteSong: function (index) {
        this.songs.splice(index, 1);
        if (index === this.currentIndex) {
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        }
        this.render();
    },

    cdThumbAnimate: cdThumb.animate([
        {transform: 'rotate(360deg)'}
    ], {
        duration: 10000,
        iterations: Infinity
    }),

    handleEvent: function () {
        const _this = this;

        playing.onclick = function () {
            if (isPause) {
                playing.innerHTML = '<i class="fa-solid fa-play"></i>';
                audio.pause();
                _this.cdThumbAnimate.pause();
            } else {
                playing.innerHTML = '<i class="fa-solid fa-pause"></i>';
                audio.play();
                _this.cdThumbAnimate.play();
            }
            isPause = !isPause;
        };

        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);
            }
            timeUpdate.innerHTML = _this.secondToMinute(audio.currentTime);
            _this.getTimeCurrentSong();
        };

        progress.onchange = function (e) {
            audio.currentTime = audio.duration / 100 * e.target.value;
        };

        this.cdThumbAnimate.pause();

        skipBtn.onclick = function () {
            if (isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            if (isPause) {
                audio.play();
            }
        };

        backwardBtn.onclick = function () {
            if (isRandom) {
                _this.playRandomSong();
            } else {
                _this.backSong();
            }
            if (isPause) {
                audio.play();
            }
        }

        randomBtn.onclick = function () {
            isRandom = !isRandom;
            randomBtn.style.color = isRandom ? "#ff253a" : "#000000ff";
        }

        repeatBtn.onclick = function () {
            isRepeat = !isRepeat;
            repeatBtn.style.color = isRepeat ? "#ff253a" : "#000000ff";
        }

        audio.onended = function () {
            if (isRepeat) {
                audio.play();
            } else {
                nextSong();
            }
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                const deleteBtn = e.target.closest('.delete-btn');
                if (songNode) {
                    _this.currentIndex = +songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.render();
                    _this.cdThumbAnimate.play();
                    playing.innerHTML = '<i class="fa-solid fa-pause"></i>'
                    audio.play();
                }
                if (deleteBtn) {
                    e.stopPropagation();
                    _this.deleteSong(+deleteBtn.dataset.index);

                }
            }
        }
    },

    start: function () {
        this.render();
        this.loadCurrentSong();
        this.handleEvent();
        this.getTimeCurrentSong();
    }
}
app.start();

document.getElementById('add-song-btn').addEventListener('click', function () {
    var songName = document.getElementById('new-song-name').value;
    var singerName = document.getElementById('new-singer-name').value;
    var songPath = document.getElementById('new-song-path').value;
    var imagePath = document.getElementById('new-image-path').value;

    if (songName && singerName && songPath && imagePath) {
        let song = {
            name: songName,
            singer: singerName,
            path: songPath,
            image: imagePath,
        }
        console.log(app.songs)
        app.songs.push(song)

        // Reset form
        document.getElementById('new-song-name').value = '';
        document.getElementById('new-singer-name').value = '';
        document.getElementById('new-song-path').value = '';
        document.getElementById('new-image-path').value = '';
        app.render();
        alert('Bài hát đã thêm thành công!');
    } else {
        alert('Vui lòng nhập đủ thông tin!');
    }
});




