export class EventData {
    constructor(
        public name: string,
        public position: google.maps.LatLngLiteral,
        public id?: string
    ) {}
}
