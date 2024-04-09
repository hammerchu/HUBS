import { Component, EventEmitter, Input, Output } from "@angular/core";
import DailyIframe, {
  DailyCall,
  DailyEventObjectParticipant,
  DailyParticipant,
  DailyEventObjectFatalError,
  DailyEventObjectParticipants,
  DailyEventObjectNoPayload,
  DailyEventObjectParticipantLeft,
  DailyEventObjectTrack,
} from "@daily-co/daily-js";
import {DataService} from '../service/data.service'

export type Participant = {
  videoTrack?: MediaStreamTrack | undefined;
  audioTrack?: MediaStreamTrack | undefined;
  videoReady: boolean;
  audioReady: boolean;
  userName: string;
  local: boolean;
  id: string;
};

const PLAYABLE_STATE = "playable";
const LOADING_STATE = "loading";

type Participants = {
  [key: string]: Participant;
};

@Component({
  selector: "call",
  templateUrl: "./call.component.html",
  styleUrls: ["./call.component.scss"],
})
export class CallComponent {
  Object = Object;
  @Input() dailyRoomUrl!: string;
  @Input() userName!: string;
  @Output() callEnded: EventEmitter<null> = new EventEmitter();
  // callObject!: DailyCall;
  error: string = "";
  participants: Participants = {};
  isPublic: boolean = true;
  joined: boolean = false;

  constructor(
    public dataService: DataService
    ) {

    }

  ngOnInit(): void {
    // Retrieve or create the call object
    this.dataService.callObject= <DailyCall> DailyIframe.getCallInstance();
    if (!this.dataService.callObject) {
      this.dataService.callObject = DailyIframe.createCallObject();
    }

    // Add event listeners for Daily events
    this.dataService.callObject
      .on("joined-meeting", this.handleJoinedMeeting)
      .on("participant-joined", this.participantJoined)
      .on("track-started", this.handleTrackStartedStopped)
      .on("track-stopped", this.handleTrackStartedStopped)
      .on("participant-left", this.handleParticipantLeft)
      .on("left-meeting", this.handleLeftMeeting)
      .on("error", this.handleError);

    // Join Daily call
    this.dataService.callObject.join({
      userName: this.userName,
      url: this.dailyRoomUrl,
    }).then(()=>{
      // this.get_connection_speed()
      setInterval(()=>this.get_connection_speed(), 2000 ); // check connection speed every 2 secs
    });

  }

  ngOnDestroy(): void {
    if (!this.dataService.callObject) return;
    // Remove event listeners for Daily events
    this.dataService.callObject
      .off("joined-meeting", this.handleJoinedMeeting)
      .off("participant-joined", this.participantJoined)
      .off("track-started", this.handleTrackStartedStopped)
      .off("track-stopped", this.handleTrackStartedStopped)
      .off("participant-left", this.handleParticipantLeft)
      .off("left-meeting", this.handleLeftMeeting)
      .off("error", this.handleError);
  }

  // Make a copy of the participant information we're actually interested in to simplify things.
  // A track is considered ready to play if it's playable or loading. (Loading will be playable very soon!)
  formatParticipantObj(p: DailyParticipant): Participant {
    const { video, audio } = p.tracks;
    const vt = video?.persistentTrack;
    const at = audio?.persistentTrack;
    return {
      videoTrack: vt,
      audioTrack: at,
      videoReady:
        !!(vt && (video.state === PLAYABLE_STATE || video.state === LOADING_STATE)),
      audioReady:
        !!(at && (audio.state === PLAYABLE_STATE || audio.state === LOADING_STATE)),
      userName: p.user_name,
      local: p.local,
      id: p.session_id,
    };
  }

  addParticipant(participant: DailyParticipant) {
    console.log('add participant : ', participant );
    const p = this.formatParticipantObj(participant);

    // only adding guest participant
    if( participant.local == false){
      this.participants[participant.session_id] = p;
    }
  }

  updateTrack(participant: DailyParticipant, newTrackType: string): void {
    const existingParticipant = this.participants[participant.session_id];
    const currentParticipantCopy = this.formatParticipantObj(participant);

    if (newTrackType === "video") {
      if (existingParticipant.videoReady !== currentParticipantCopy.videoReady) {
        existingParticipant.videoReady = currentParticipantCopy.videoReady;
      }

      if (currentParticipantCopy.videoReady && existingParticipant.videoTrack?.id !== currentParticipantCopy.videoTrack?.id) {
        existingParticipant.videoTrack = currentParticipantCopy.videoTrack;
      }
      return;
    }

    if (newTrackType === "audio") {
      if (existingParticipant.audioReady !== currentParticipantCopy.audioReady) {
        existingParticipant.audioReady = currentParticipantCopy.audioReady;
      }

      if (currentParticipantCopy.audioReady && existingParticipant.audioTrack?.id !== currentParticipantCopy.audioTrack?.id) {
        existingParticipant.audioTrack = currentParticipantCopy.audioTrack;
      }
    }
  }

  handleJoinedMeeting = (e: DailyEventObjectParticipants | undefined): void => {
    if (!e) return; // make TypeScript happy
    console.log(e);
    this.joined = true;

    const { access } = this.dataService.callObject.accessState();

    // Set flag if room is public. If it's not, we'll alert the user in the UI.
    // Rooms should be public since this demo does not include access management.
    this.isPublic = access !== "unknown" && access.level === "full";
    // Add local participants to participants list used to display video tiles
    this.addParticipant(e.participants.local);
  };

  participantJoined = (e: DailyEventObjectParticipant | undefined) => {
    if (!e) return;
    console.log(e.action);
    // Add remote participants to participants list used to display video tiles
    this.addParticipant(e.participant);

    this.dataService.hasBotParticipant = true;
  };

  handleTrackStartedStopped = (e: DailyEventObjectTrack | undefined): void => {
    console.log("track started or stopped")
    if (!e || !e.participant || !this.joined) return;
    this.updateTrack(e.participant, e.type);
  };

  handleParticipantLeft = (
    e: DailyEventObjectParticipantLeft | undefined
  ): void => {
    if (!e) return;
    console.log(e.action);
    delete this.participants[e.participant.session_id];

    this.dataService.hasBotParticipant = false;
  };

  handleError = (e: DailyEventObjectFatalError | undefined): void => {
    if (!e) return;
    console.log(e);
    // Update local error message displayed in UI.
    this.error = e.errorMsg;
  };

  /**
   * Typical this wouldn't be called if we assume the hubs will always connect with all the bots
   */
  handleLeftMeeting = (e: DailyEventObjectNoPayload | undefined): void => {
    if (!e) return;
    console.log(e);
    this.joined = false;
    this.dataService.callObject.destroy();
    this.callEnded.emit();

    this.dataService.hasBotParticipant = false;

  };

  leaveCall(): void {
    this.error = "";
    if (!this.dataService.callObject) return;

    // Leave call
    this.dataService.callObject.leave();
  }

  toggleLocalVideo() {
    // Event is emitted from VideoTileComponent

    // Confirm they're in the call before updating media
    if (!this.joined) return;
    // Toggle current audio state
    const videoReady = this.dataService.callObject.localVideo();
    this.dataService.callObject.setLocalVideo(!videoReady);
  }

  toggleLocalAudio() {
    // Event is emitted from VideoTileComponent

    // Confirm they're in the call before updating media
    if (!this.joined) return;
    // Toggle current audio state
    const audioReady = this.dataService.callObject.localAudio();
    this.dataService.callObject.setLocalAudio(!audioReady);
  }

  get_connection_speed(){
    this.dataService.callObject.getNetworkStats().then((data) => {
      // console.log(' getNetworkStats : ', data, 'latest', data.stats.latest)
      this.dataService.connection_speed = <number>data.stats.latest.networkRoundTripTime;

      this.dataService.connection_quality = data.quality?data.quality:0
      this.dataService.bandwidth = (data.stats.latest.recvBitsPerSecond?data.stats.latest.recvBitsPerSecond:0)/1024
      this.dataService.latency = data.stats.latest.networkRoundTripTime?data.stats.latest.networkRoundTripTime:0
    });

  }
}
