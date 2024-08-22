interface GPS {
  type: string;
  coordinates: [number, number];
}

interface BrandInfo {
  id: string;
  name: string;
  field: string;
  address: string;
  gps: GPS;
  bucketId: string;
}

export { BrandInfo };
