import React, { useState } from 'react'

import { Venue_v2 } from 'types/venues'
import { Room, RoomData_v2 } from 'types/rooms'

import MapPreview from '../MapPreview'

import './Spaces.scss'
import BackgroundSelect from '../BackgroundSelect'

export interface SpacesProps {
  venue:  Venue_v2
}

export const Spaces: React.FC<SpacesProps> = ({venue}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomData_v2>()
  return (
    <div className="spaces">
      <div className="spaces__rooms">
          <div className="spaces__background">
            <div className="spaces__title">
              Build your spaces
            </div>
            <BackgroundSelect
              venueName={venue.name}
              mapBackground={""}
            />
          </div>
          <div>
            advanced map settings
          </div>
          <div>
            rooms
          </div>
          <div>
            add room
          </div>
      </div>
      <div className="spaces__map">
        <MapPreview
          isEditing={!!selectedRoom}
          setIsEditing={() => {}}
          venueId={venue.id}
          venueName={venue.name}
          mapBackground={venue.mapBackgroundImageUrl}
          setSelectedRoom={setSelectedRoom}
          rooms={venue.rooms ?? []}
          selectedRoom={selectedRoom}
        />
      </div>
    </div>
  )
}
