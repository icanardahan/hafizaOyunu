// All usefull objects and shortcuts to simplify coding
let objects = ['gift', 'gift', 'lock', 'lock', 'motorcycle', 'motorcycle', 'tree', 'tree', 'wifi', 'wifi', 'subway', 'subway', 'cloud', 'cloud', 'heart', 'heart'],

    
    $container = $('.container'),
    $scorePanel = $('.score-panel'),
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck'),

    
    nowTime,
    allOpen = [],
    match = 0,
    second = 0,
    moves = 0,
    wait = 420,
    totalCard = objects.length / 2,

    // Skor sistemi
    stars3 = 14,
    stars2 = 16,
    star1 = 20;

// Kart düzeninin her oyun değişmesini sağlar 
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// init fonk. oyunun başlamasını sağlar
function init() {

    // kartların yerini karıştırır
    let allCards = shuffle(objects);
    $deck.empty();

    // Oyunun başlangıç hal,
    match = 0;
    moves = 0;
    $moves.text('0');

   
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }
    addCardListener();

    // Oyun yeniden başlatıldığında zamanlayıcının sıfırdan başlamasını sağlar
    resetTimer(nowTime);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

// Yapılan hamle miktarına bağlı olarak yıldız verir
function rating(moves) {
    let rating = 3;
    if (moves > stars3 && moves < stars2) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return { score: rating };
}

// hamle,zaman ve oyunu bitirme puanını gösteren boostrap model
function gameOver(moves, score) {
    $('#winnerText').text(`In ${second} saniye , toplam ${moves} hamle yaptın.Skorun ${score}. Tebrikler!`);
    $('#winnerModal').modal('toggle');
}

// reset atınca kartları da sıfırlar
$restart.bind('click', function (confirmed) {
    if (confirmed) {
        $rating.removeClass('fa-star-o').addClass('fa-star');
        init();
    }
});

// Diğer kart tıklanana kadar kartın açık kalmasını sağlar
// Eğer kart eşlezmese geri döner
let addCardListener = function () {

    // With the following, the card that is clicked on is flipped
    $deck.find('.card').bind('click', function () {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        let card = $this.context.innerHTML;
        $this.addClass('open show');
        allOpen.push(card);

        // Kartları Karşılaştırır
        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show');
                }, wait);
                match++;

                // Eğer kartlar eşleşmezse kartın geri dönüş süresi ayarlaması.
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show');
                }, wait / 1.5);
            }

            
            allOpen = [];

            moves++;

            // rating sayısını belirleyecek olan rating() fonksiyonuna çift tıklama eklendi
            rating(moves);

            
            $moves.html(moves);
        }

        // Tüm kartlar eşleştiğinde oyun kısa bir gecikmeyle biter
        if (totalCard === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// Oyun açılır açılmaz zamanlayıcı başlatılır
function initTime() {
    nowTime = setInterval(function () {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// Oyun bittiğinde yada reset atıldığında zamanlayıcı sıfırlama
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

init();