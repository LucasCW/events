export class EventData {
    constructor(
        public title: string,
        public position: google.maps.LatLngLiteral | google.maps.LatLng,
        public formattedAddress: string,
        public id?: string
    ) {}
}
