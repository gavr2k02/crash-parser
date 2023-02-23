import { Signal } from '../signal/Signal';

class API {
  public readonly gameStage: Signal<any> = new Signal();

  public readonly totalBet: Signal<any> = new Signal();
  public readonly totalWon: Signal<any> = new Signal();
  public readonly gamesCount: Signal<any> = new Signal();

  public readonly sessionBet: Signal<any> = new Signal();
  public readonly sessionWon: Signal<any> = new Signal();
  public readonly usersSessionCount: Signal<any> = new Signal();

  public readonly prevSession: Signal<any> = new Signal();

  private bet: number = 0;
  private won: number = 0;

  private sBet: number = 0;
  private sWon: number = 0;
  private usersCount: number = 0;
  private gCount: number = 0;

  constructor() {
    setInterval(() => {
      this.totalBet.emit(Math.round(this.bet));
      this.totalWon.emit(Math.round(this.won));
      this.sessionBet.emit(Math.round(this.sBet));
      this.sessionWon.emit(Math.round(this.sWon));
      this.usersSessionCount.emit(this.usersCount);
    }, 100);
  }

  private socket: WebSocket;

  public init = async (url: string) => {
    console.log('init');
    this.socket = new WebSocket(url);

    console.log('created');
    this.socket.onmessage = this.handleSocketMessage;

    await delay(500);
    this.sendConnectMessages();
  };

  private sendConnectMessages = async () => {
    this.socket.send('40');
    await delay(500);

    setInterval(() => this.socket.send('42["crash.join"]'), 1500);
  };

  private handleSocketMessage = (event) => {
    if (!event.data.length) {
      return;
    }

    const message = JSON.parse(event.data.substring(2, event.data.length));

    if (message[0] === 'crash.completeBids') {
      const sum = message[1].reduce((acc, item) => acc + item.win, 0);
      this.won += sum;
      this.sWon += sum;
      return;
    }

    if (message[0] === 'crash.newBids') {
      const length = message[1].length;

      const sum = message[1].reduce((acc, item) => acc + item.game.bet, 0);
      this.bet += sum;
      this.sBet += sum;
      this.usersCount += length;
      return;
    }

    if (message[0] === 'crash.state') {
      this.gameStage.emit(message[1].toUpperCase());
      if (message[1] === 'complete') {
        return this.clearSessionBitsAndEmitPrevSession();
      }
    }
  };

  private clearSessionBitsAndEmitPrevSession = () => {
    this.prevSession.emit({ won: Math.round(this.sWon), bet: Math.round(this.sBet), count: this.usersCount });
    this.gamesCount.emit(++this.gCount);

    this.sBet = 0;
    this.sWon = 0;
    this.usersCount = 0;
  };
}

const delay = (value: number) => {
  return new Promise((resolve) => setTimeout(resolve, value));
};

export const api = new API();
