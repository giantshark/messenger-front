var socket = io.connect('http://localhost:3000');  

var app = new Vue({
    el: '#app',

    props: {
        apiUrl: {
            type: String,
            default() {
                return 'http://localhost:3000/api'
            }
        },
        chatName: {
            type: String,
            default() {
                return ''
            }
        }
    },       

    data() {
        return {
            messages: [],
            newMessage: ''
        }
    },

    created() {
        this.generateChatName()
    },

    mounted () {
        socket.on('web-messenger', (msg) => {
            this.messages.push({
                sender: msg.sender,
                message: msg.message 
            })
        });

        $('#chat-name-modal').modal({
            backdrop: 'static',
            keyboard: false
        })
    },

    methods: {
        generateChatName() {
            this.chatName = 'u' + Math.floor(Math.random() * 10000) + 1
        },

        fetchMessages() {
            axios.get(this.apiUrl+'/messages')
            .then((response) => {
                this.messages = response.data.response;
            })
            .catch(function(err) {
                
            })
        },

        confirmDisplayName() {
            if (this.chatName.trim() != '') {
                $('#chat-name-modal').modal('hide')
                this.fetchMessages();
            }
        },

        sendMessage() {
            if (this.chatName && this.newMessage ) {
                socket.emit('web-messenger', { 
                    sender: this.chatName,
                    message: this.newMessage 
                })
            }

            this.newMessage = ''

            var scrollTo_int = $('.chat-box').prop('scrollHeight') + 'px'
            $('.chat-box').animate({scrollTop: scrollTo_int})
        }
    }
})