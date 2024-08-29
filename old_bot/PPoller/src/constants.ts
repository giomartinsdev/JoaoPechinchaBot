import dotenv from 'dotenv';
import { AxiosHeaders } from 'axios';

dotenv.config();

export const headers = new AxiosHeaders({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Api-Key': process.env.X_API_KEY || '',
  'x-amz-user-agent': 'aws-amplify/5.1.12 js',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site'
});

export const query = `query {
        offers(limit: 30, nextToken: null) {
          items {
            id
            title
            price
            coupon
            url
            media
            likes
            liked
            hits
            store {
              id
              name
              icon
            }
            createdBy {
              userId
              name
              photo
            }
            status
            createdAt
            slug
          }
          nextToken
        }
      }`;