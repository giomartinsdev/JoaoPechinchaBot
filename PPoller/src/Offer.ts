interface Offer {
  id: string;
  title: string;
  price: number;
  coupon: string;
  url: string;
  media: string;
  likes: number;
  liked: boolean;
  hits: number;
  store: Store;
  createdBy: CreatedBy;
  status: string;
  createdAt: string;
  slug: string;
}

interface CreatedBy {
  userId: string;
  name: string;
  photo: string;
}

interface Store {
  id: string;
  name: string;
  icon: string;
}


export default Offer;