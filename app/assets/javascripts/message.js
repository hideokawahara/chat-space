$(function(){ 
  function buildHTML(message){
   if ( message.image ) {
     var html =
      `<div class="main_chat__message_list__messages__upper" data-message-id=${message.id}>
        <a class="main_chat__message_list__messages__upper__talker">
          ${message.user_name}
        </a>
        <a class="main_chat__message_list__messages__upper__date">
          ${message.created_at}
        </a>
      </div>
      <p class="main_chat__message_list__messages__text">
        <p class="lower-message__image">
        ${message.content}
        </p>
      </p>
        <img src=${message.image} >`
     return html;
   } else {
     var html =
      `<div class="main_chat__message_list__messages__upper" data-message-id=${message.id}>
        <a class="main_chat__message_list__messages__upper__talker">
          ${message.user_name}
        </a>
        <a class="main_chat__message_list__messages__upper__date">
          ${message.created_at}
        </a>
      </div>
      <p class="main_chat__message_list__messages__text">
        <p class="lower-message__image">
          ${message.content}
        </p>
      </p>`
     return html;
   };
 }
$('#new_message').on('submit', function(e){
 e.preventDefault();
 var formData = new FormData(this);
 var url = $(this).attr('action')
 $.ajax({
   url: url,
   type: "POST",
   data: formData,
   dataType: 'json',
   processData: false,
   contentType: false
 })
  .done(function(data){
    var html = buildHTML(data);
    $('.main_chat__message_list').append(html);
    $('.main_chat__message_list').animate({ scrollTop: $('.main_chat__message_list')[0].scrollHeight});
    $('form')[0].reset();
    $('.main_chat__form__submit-btn').prop('disabled', false);
  })
  .fail(function() {
    alert("メッセージ送信に失敗しました");
});
})
var reloadMessages = function() {
  //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
  var last_message_id = $('.main_chat__message_list__messages__upper:last').data("message-id");
  // console.log(last_message_id)
  $.ajax({
    //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
    url: "api/messages",
    //ルーティングで設定した通りhttpメソッドをgetに指定
    type: 'get',
    dataType: 'json',
    //dataオプションでリクエストに値を含める
    data: {id: last_message_id}
  })
  .done(function(messages) {
    console.log(messages)
    if (messages.length !== 0) {
     //追加するHTMLの入れ物を作る
     var insertHTML = '';
     //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
     $.each(messages, function(i, message) {
      console.log(message)
       insertHTML += buildHTML(message)
     });
     //メッセージが入ったHTMLに、入れ物ごと追加
     $('.main_chat__message_list').append(insertHTML);
     $('.main_chat__message_list').animate({ scrollTop: $('.main_chat__message_list')[0].scrollHeight});
    }
  })
  .fail(function() {
    alert('error');
    });
  };
  //$(function(){});の閉じタグの直上(処理の最後)に以下のように追記
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});