import { mean } from 'lodash';
import { ReplaySignal } from '../signal/ReplaySignal';

class API {
  public readonly gameStage: ReplaySignal<any> = new ReplaySignal();

  public readonly totalBet: ReplaySignal<any> = new ReplaySignal();
  public readonly totalWon: ReplaySignal<any> = new ReplaySignal();
  public readonly gamesCount: ReplaySignal<any> = new ReplaySignal();

  public readonly sessionBet: ReplaySignal<any> = new ReplaySignal();
  public readonly sessionWon: ReplaySignal<any> = new ReplaySignal();
  public readonly sessionRatio: ReplaySignal<any> = new ReplaySignal();
  public readonly usersSessionCount: ReplaySignal<any> = new ReplaySignal();

  public readonly prevSessions: ReplaySignal<any> = new ReplaySignal();

  public readonly maxCount: ReplaySignal<any> = new ReplaySignal();
  public readonly minCount: ReplaySignal<any> = new ReplaySignal();
  public readonly averageCount: ReplaySignal<any> = new ReplaySignal();

  public gameUsers: ReplaySignal<any> = new ReplaySignal();

  private bet: number = 0;
  private won: number = 0;

  private sBet: number = 0;
  private sWon: number = 0;
  private usersCount: number = 0;
  private gCount: number = 0;

  private maCount = 0;
  private miCount = 0;
  private historyCount = [];

  private users: any = {};
  private prevSessionsValues = [];
  private ratio = 0;
  private ratioTimer;

  private ready = false;
  private startTime;

  constructor() {
    setInterval(() => {
      this.totalBet.emit(Math.round(this.bet));
      this.totalWon.emit(Math.round(this.won));
      this.sessionBet.emit(Math.round(this.sBet));
      this.sessionWon.emit(Math.round(this.sWon));
      this.usersSessionCount.emit(this.usersCount);
      this.sessionRatio.emit(this.ratio);
    }, 100);
  }

  private socket: WebSocket;

  public init = async (url: string) => {
    this.socket = new WebSocket(url);
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

    if (message[0] === 'crash.state') {
      if (message[1] === 'wait') {
        this.ready = true;
      }
    }

    if (!this.ready) {
      return;
    }

    if (message[0] === 'crash.newBids') {
      message[1].forEach((item) => {
        const userId = item.user.id;
        const game = item.game;

        if (!this.users[userId]) {
          this.users[userId] = {
            userId: item.user.id,
            name: item.user.name,
            count: 0,
            returnCount: 0,
            maxBet: 0,
            minBet: 0,
            aBet: 0,
            totalBet: 0,
            maxReturn: 0,
            minReturn: 0,
            aReturn: 0,
            totalReturn: 0,
            maxRatio: 0,
            minRatio: 0,
            aRatio: 0,
            totalRatio: 0,
          };
        }

        this.users[userId].count = this.users[userId].count + 1;

        if (this.users[userId].maxBet < game.bet) {
          this.users[userId].maxBet = game.bet;
        }
        if (this.users[userId].minBet > game.bet || !this.users[userId].minBet) {
          this.users[userId].minBet = game.bet;
        }
        this.users[userId].totalBet += game.bet;
        this.users[userId].aBet = this.users[userId].totalBet / this.users[userId].count;
      });

      const length = message[1].length;

      const sum = message[1].reduce((acc, item) => acc + item.game.bet, 0);
      this.bet += sum;
      this.sBet += sum;
      this.usersCount += length;
      return;
    }

    if (message[0] === 'crash.completeBids') {
      message[1].forEach((item) => {
        const userId = item.userId;

        this.users[userId].returnCount = this.users[userId].returnCount + 1;
        if (this.users[userId].maxReturn < item.win) {
          this.users[userId].maxReturn = item.win;
        }
        if (this.users[userId].minReturn > item.win || !this.users[userId].minReturn) {
          this.users[userId].minReturn = item.win;
        }
        this.users[userId].totalReturn += item.win;
        this.users[userId].aReturn = this.users[userId].totalReturn / this.users[userId].returnCount;
        if (this.users[userId].maxRatio < item.ratio) {
          this.users[userId].maxRatio = item.ratio;
        }
        if (this.users[userId].minRatio > item.ratio || !this.users[userId].minRatio) {
          this.users[userId].minRatio = item.ratio;
        }
        this.users[userId].totalRatio += item.ratio;
        this.users[userId].aRatio = this.users[userId].totalRatio / this.users[userId].returnCount;
      });

      const sum = message[1].reduce((acc, item) => acc + item.win, 0);
      this.won += sum;
      this.sWon += sum;
      return;
    }

    if (message[0] === 'crash.state') {
      this.gameStage.emit(message[1].toUpperCase());

      if (message[1] === 'game') {
        this.startTime = new Date();
        this.startTimer();
      }

      if (message[1] === 'complete') {
        return this.clearSessionBitsAndEmitPrevSession();
      }
    }
  };

  private startTimer = () => {
    this.ratio = Math.floor(100 * Math.pow(Math.E, 12e-5 * ((new Date() as any) - this.startTime))) / 100 - 0.03;
    this.ratioTimer = setTimeout(() => this.startTimer(), 30);
  };

  private stopTimeRatio = () => {
    this.startTime = undefined;
    clearTimeout(this.ratioTimer);
  };

  private clearSessionBitsAndEmitPrevSession = () => {
    this.stopTimeRatio();

    this.historyCount.push(this.usersCount);
    this.maCount = this.maCount < this.usersCount || !this.maCount ? this.usersCount : this.maCount;
    this.miCount = this.miCount > this.usersCount || !this.miCount ? this.usersCount : this.miCount;

    this.maxCount.emit(this.maCount);
    this.minCount.emit(this.miCount);
    this.averageCount.emit(mean(this.historyCount));

    this.prevSessionsValues.push({
      won: Math.round(this.sWon),
      bet: Math.round(this.sBet),
      ratio: this.ratio < 1 ? 0 : this.ratio,
      count: this.usersCount,
      date: new Date(),
    });
    this.prevSessions.emit(this.prevSessionsValues.slice().reverse());
    this.gamesCount.emit(++this.gCount);

    this.gameUsers.emit(this.users);

    this.ratio = 0;
    this.sBet = 0;
    this.sWon = 0;
    this.usersCount = 0;
  };
}

const delay = (value: number) => {
  return new Promise((resolve) => setTimeout(resolve, value));
};

export const api = new API();
