import { createNgModule } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from 'src/app/models/document.model';
import { CardDataService } from './card-data.service';
import { Router } from '@angular/router';
import { eventNames } from 'process';
import { observeOn } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RoomService } from './room.service';
import { keyframes } from '@angular/animations';
import { Room } from '../models/room.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  gameData = this.socket.fromEvent<string[]>('gameData');
  roomData = this.socket.fromEvent<string[]>('rooms');
  canJoin: boolean
  socketID
  temp

  constructor(
    public socket: Socket,
    cardDataService: CardDataService,
    private router: Router,
    private roomService: RoomService
  ) {
    this.gameData.subscribe(event => {
      cardDataService.cardsOfUser = event
      console.log(cardDataService.cardsOfUser)
    });

    this.roomData.subscribe(event => {
      let b = ''
      for (let i in event) {
        b += event[i]['roomId'] + event[i]['playerNum']
      }
      if (this.roomService.isChange != b) {
        this.roomService.isChange = ''
        this.roomService.rooms = new Array<Room>()
        for (let i in event) {
          let a = new Room()
          a.roomId = event[i]['roomId']
          a.playerNum = event[i]['playerNum']
          this.roomService.isChange += event[i]['roomId'] + event[i]['playerNum']
          this.roomService.rooms.push(a)
        }
      }
    });
  }

  letStart() {
    this.socket.emit('letStart', 'r123');
  }
  getSocketID() {
    this.socket.on('getID', (id) => {
      this.socketID = id
    })
  }
  //hello() { console.log('lo CC') }
  joinRoom(idRoom) {
    this.socket.emit('join', idRoom);
    this.socket.on('canJoin', e => {
      if (e == true) {
        this.router.navigate(['/play'])
      }
      else if (e == 'not found') {
        console.log(`room [${idRoom}] is not found!`)
      }
      else if (e == false) {
        console.log(`room [${idRoom}] is full!`)
      }
    })
  }

  createRoom(rid) {
    this.socket.emit('createRoom', rid);
    this.socket.on('canCreateRoom', e => {
      if (e) {
        this.joinRoom(rid)
      }
    })
  }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }


  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  listen(eventName) {
    return new Observable((sub) => {
      this.socket.on(eventName, (data) => {
        sub.next(data)
      })
    })
  }
}
