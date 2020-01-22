
class WebSocketService {
    private readonly ws: WebSocket | undefined = undefined;
    private readonly onConnect: (_: WebSocket) =>void = ()=>{};
    private readonly onMessage: (message: string)=>void = ()=>{};

    constructor(onConnect: (_: WebSocket)=>void, onMessage: (_: string)=>void, address?: string) {
        this.setUp();
        this.onMessage = onMessage;
        this.onConnect = onConnect;
        if (address === undefined) address = 'ws://localhost:3000/ws';

        // unable to set authorization header, it is not supported in WebSocket library in browser

        this.ws = new WebSocket(address,undefined, );
    }

    setUp = () => {
        if(this.ws === undefined) return;

        this.ws.onopen = () => {
            this.onConnect(this.ws as WebSocket);
        };

        this.ws.onmessage = evt => {
            this.onMessage(evt.data);
        };

        this.ws.onclose = () => {
            console.log('disconnected');

            setTimeout(()=>{})
        }
    }


}

export default WebSocketService;