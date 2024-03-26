export class EventData {
    public position: google.maps.LatLngLiteral;
    constructor(
        public title: string,
        position: google.maps.LatLngLiteral | google.maps.LatLng,
        public formattedAddress: string,
        public date?: Date,
        public range?: { start: Date; end: Date },
        public id?: string
    ) {
        if (position instanceof google.maps.LatLng)
            this.position = { lat: position.lat(), lng: position.lng() };
        else this.position = position;
    }
}
