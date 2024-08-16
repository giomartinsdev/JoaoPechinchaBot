import Offer from './Offer';

interface ApiResponse {
  offers: Offer[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export default ApiResponse;