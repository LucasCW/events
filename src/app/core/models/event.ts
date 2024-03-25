export class EventData {
    constructor(
        public title: string,
        public position: google.maps.LatLngLiteral | google.maps.LatLng,
        public formattedAddress: string,
        public date?: Date,
        public range?: { start: Date | null; end: Date | null },
        public id?: string
    ) {}
}
