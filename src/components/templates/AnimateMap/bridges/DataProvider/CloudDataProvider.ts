import { ExtendedFirebaseInstance } from "react-redux-firebase";
import { utils } from "pixi.js";

import { DEFAULT_BADGE_IMAGE } from "settings";

import {
  ReplicatedFirebarrel,
  ReplicatedUser,
  ReplicatedVenue,
} from "store/reducers/AnimateMap";

import { Firebarrel } from "types/animateMap";
import { User } from "types/User";

import { WithId } from "utils/id";
import { getFirebaseStorageResizedImage } from "utils/image";

import { DataProvider } from "../../../DataProvider";
import { RoomWithFullData } from "../CloudDataProviderWrapper";
import EventProvider, { EventType } from "../EventProvider/EventProvider";

import { CommonInterface, CommonLinker } from "./Contructor/CommonInterface";
import { FirebaseDataProvider } from "./Contructor/Firebase/FirebaseDataProvider";
import { PlayerIOBots } from "./Contructor/PlayerIO/PlayerIOBots";
import { PlayerIODataProvider } from "./Contructor/PlayerIO/PlayerIODataProvider";
import { getIntByHash } from "./Contructor/PlayerIO/utils/getIntByHash";
import { DataProviderEvent } from "./Providers/DataProviderEvent";
import { PlayerDataProvider } from "./Providers/PlayerDataProvider";
import { UsersDataProvider } from "./Providers/UsersDataProvider";
import playerModel from "./Structures/PlayerModel";

interface TEMPORARY_USERS_TYPE_REPLACEMENT {
  isRecentWorldUsersLoaded: boolean;
  recentWorldUsers: readonly WithId<User>[];
}

interface CloudDataProviderSetting {
  playerId: string;
  userAvatarUrl?: string;
  firebase: ExtendedFirebaseInstance;
  playerioGameId: string;
  playerioMaxPlayerPerRoom: number;
  playerioFrequencyUpdate: number;
  playerioAdvancedMode?: boolean;
  reInitOnError?: boolean;
}

/**
 * Dirty class, for initiating all general data bridge logic
 */
export class CloudDataProvider
  extends utils.EventEmitter
  implements DataProvider {
  private _updateCounter = 0;
  private _maxUpdateCounter = 1000 / this.settings.playerioFrequencyUpdate;

  readonly player: PlayerDataProvider;
  readonly users: UsersDataProvider;
  readonly commonInterface: CommonInterface;

  /**
   * Update frequency (per second)
   */
  get frequencyUpdate() {
    return this.settings.playerioFrequencyUpdate;
  }

  set frequencyUpdate(value) {
    this.settings.playerioFrequencyUpdate = value;
    this._maxUpdateCounter = 1 / value;
  }

  private _testBots;

  constructor(readonly settings: CloudDataProviderSetting) {
    super();

    this.settings = { ...settings };

    this._testBots = new PlayerIOBots(
      this,
      this.settings.playerioGameId,
      this.settings.playerioAdvancedMode
    );
    //window.ADD_IO_BOT = this._testBots.addBot.bind(this._testBots); //TODO: remove later

    playerModel.data.pictureUrl =
      this.settings.userAvatarUrl ?? DEFAULT_BADGE_IMAGE;
    playerModel.data.id = this.settings.playerId;

    this.commonInterface = new CommonLinker(
      new PlayerIODataProvider(
        this,
        this.settings.playerioGameId,
        this.settings.playerId,
        this.settings.reInitOnError
      ),
      new FirebaseDataProvider(this.settings.firebase)
    );
    this.player = new PlayerDataProvider(
      this.settings.playerId,
      this.commonInterface
    );
    this.users = new UsersDataProvider(this.commonInterface);
    EventProvider.on(
      EventType.SEND_SHOUT,
      this.commonInterface.sendShoutMessage.bind(this.commonInterface)
    );
  }

  public update(dt: number) {
    this._updateCounter += dt;
    if (this._updateCounter > this._maxUpdateCounter) {
      this._updateCounter -= this._maxUpdateCounter;
      this.player.updatePosition();
      this._testBots.update();
      this.update(0);
    }
  }

  public release() {
    this.player.release();
  }

  public setPlayerPosition(x: number, y: number) {
    this.player.setPosition(x, y);
  }

  public venuesData: ReplicatedVenue[] = [];
  public firebarrelsData: ReplicatedFirebarrel[] = [];

  public updateRooms(data?: RoomWithFullData[]) {
    if (!data) return;

    const newVenues = data.filter(
      (item) => !this.venuesData.find((venue) => venue.data.id === item.id)
    );
    const deprecatedVenues = this.venuesData.filter(
      (item) => !data.find((room) => room.id === item.data.id)
    );
    deprecatedVenues.forEach((venue) =>
      this.emit(DataProviderEvent.VENUE_REMOVED, venue)
    );
    this.venuesData = this.venuesData.filter(
      (venue) => !deprecatedVenues.find((v) => v.data.id === venue.data.id)
    );

    const createReplicatedVenue = (room: RoomWithFullData) => {
      return {
        x: (room.x_percent / 100) * 9920 + 50, //TODO: refactor configs and throw data to here
        y: (room.y_percent / 100) * 9920 + 50,
        data: {
          ...room,
          countUsers: room.countUsers ?? 0,
          image_url: getFirebaseStorageResizedImage(room.image_url, {
            width: 256,
            height: 256,
            fit: "crop",
          }),
          withoutPlate: room.title === "Temple" || room.title === "The Man",
        },
      } as ReplicatedVenue;
    };

    const modifiedVenues = this.venuesData
      .filter((venue) => {
        const room = data.find((room) => room.id === venue.data.id);

        if (!room) return false;

        return !(
          room.url === venue.data.url &&
          room.title === venue.data.title &&
          room.subtitle === venue.data.subtitle &&
          getFirebaseStorageResizedImage(room.image_url, {
            width: 256,
            height: 256,
            fit: "crop",
          }) === venue.data.image_url &&
          room.isLive === venue.data.isLive &&
          room.countUsers === venue.data.countUsers &&
          room.isEnabled === venue.data.isEnabled
        );
      })
      .map((venue) => {
        const room = data.find((item) => item.id === venue.data.id);
        if (!room) return venue;
        return createReplicatedVenue(room);
      });
    modifiedVenues.forEach((modifiedVenue) => {
      const indx = this.venuesData.findIndex(
        (venue) => venue.data.id === modifiedVenue.data.id
      );
      if (indx >= 0) this.venuesData[indx] = modifiedVenue;
      this.emit(DataProviderEvent.VENUE_UPDATED, modifiedVenue);
    });

    newVenues.forEach((room) => {
      const vn = createReplicatedVenue(room);
      this.venuesData.push(vn);
      this.emit(DataProviderEvent.VENUE_ADDED, vn);
    });
  }

  private isUpdateUsersLocked = false;

  public async updateUsersAsync(data: TEMPORARY_USERS_TYPE_REPLACEMENT) {
    if (this.isUpdateUsersLocked) return;

    this.isUpdateUsersLocked = true;
    await this.updateUsers(data);
    this.isUpdateUsersLocked = false;
  }

  public updateUsers(data: TEMPORARY_USERS_TYPE_REPLACEMENT) {
    if (!data?.isRecentWorldUsersLoaded) return;

    // new entities scenario
    const usersData: ReplicatedUser[] = [];
    data.recentWorldUsers.forEach((user) => {
      // if (user.lastSeenIn) //todo: add counter

      usersData.push({
        x: -1000,
        y: -1000,
        data: {
          id: user.id,
          partyName: user.partyName,
          messengerId: getIntByHash(user.id),
          pictureUrl: getFirebaseStorageResizedImage(user.pictureUrl ?? "", {
            width: 64,
            height: 64,
            fit: "crop",
          }),
          dotColor: 0xabfcfb,
        },
      });
    });

    //TODO: update scenario

    // todo: add normalization
    this.users.updateUsers(usersData);
  }

  public updateFirebarrels(data: Firebarrel[] | undefined) {
    if (!data) return;

    const newFirebarrels = data.filter(
      (newFirebarrel) =>
        !this.firebarrelsData.find(
          (firebarrel) => firebarrel.data.id === newFirebarrel.id
        )
    );
    const deprecatedFirebarrels = this.firebarrelsData.filter(
      (item) => !data.find((firebarrel) => firebarrel.id === item.data.id)
    );
    deprecatedFirebarrels.forEach((firebarrel) =>
      this.emit(DataProviderEvent.FIREBARREL_REMOVED, firebarrel)
    );

    this.firebarrelsData = this.firebarrelsData.filter(
      (firebarrel) =>
        !deprecatedFirebarrels.find(
          (deprecatedFirebarrel) =>
            deprecatedFirebarrel.data.id === firebarrel.data.id
        )
    );

    const existFirebarrels = this.firebarrelsData
      .filter((existFirebarrel) => {
        const firebarrel = data.find(
          (firebarrel) => firebarrel.id === existFirebarrel.data.id
        );

        if (!firebarrel) return false;

        return !(
          firebarrel.id === existFirebarrel.data.id &&
          firebarrel.coordinateX === existFirebarrel.data.coordinateX &&
          firebarrel.coordinateY === existFirebarrel.data.coordinateY &&
          firebarrel.iconSrc === existFirebarrel.data.iconSrc &&
          firebarrel.trackSrc === existFirebarrel.data.trackSrc &&
          firebarrel.isLocked === existFirebarrel.data.isLocked &&
          firebarrel.connectedUsers?.length ===
            existFirebarrel.data.connectedUsers?.length &&
          firebarrel.maxUserCount === existFirebarrel.data.maxUserCount
        );
      })
      .map((existFirebarrel) => {
        const firebarrel = data.find(
          (firebarrel) => firebarrel.id === existFirebarrel.data.id
        );
        if (!firebarrel) return existFirebarrel;

        return {
          x: parseInt(firebarrel.coordinateX),
          y: parseInt(firebarrel.coordinateY),
          data: {
            ...firebarrel,
          },
        } as ReplicatedFirebarrel;
      });

    existFirebarrels.forEach((firebarrel) => {
      const index = this.firebarrelsData.findIndex(
        (fb) => fb.data.id === firebarrel.data.id
      );
      this.firebarrelsData[index] = firebarrel;
      this.emit(DataProviderEvent.FIREBARREL_UPDATED, firebarrel);
    });

    newFirebarrels.forEach((newFirebbarrel) => {
      const firebarrel = {
        x: parseInt(newFirebbarrel.coordinateX),
        y: parseInt(newFirebbarrel.coordinateY),
        data: {
          ...newFirebbarrel,
        },
      } as ReplicatedFirebarrel;

      this.firebarrelsData.push(firebarrel);
      this.emit(DataProviderEvent.FIREBARREL_ADDED, firebarrel);
    });
  }
}
